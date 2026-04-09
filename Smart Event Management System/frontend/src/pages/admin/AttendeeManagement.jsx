import { useState, useEffect } from 'react';
import { Search, UserCheck, Download, Mail, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEventContext } from '../../context/EventContext';
import { formatDate, calculateAttendanceRate, exportToCSV } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import checkinService from '../../services/checkinService';
import seatService from '../../services/seatService';

const ROWS_PER_PAGE = 8;

const AttendeeManagement = () => {
  const { events, loading: eventsLoading } = useEventContext();
  const [selectedEventId, setSelectedEventId] = useState('');
  const [search, setSearch] = useState('');
  const [ticketFilter, setTicketFilter] = useState('');
  const [checkinFilter, setCheckinFilter] = useState('');
  const [page, setPage] = useState(1);
  const [attendeesData, setAttendeesData] = useState([]);
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [seatStats, setSeatStats] = useState(null);
  const [seatStatsError, setSeatStatsError] = useState('');

  useEffect(() => {
    if (!selectedEventId && events.length > 0) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  useEffect(() => {
    const loadAttendees = async () => {
      if (!selectedEventId) return;
      try {
        const tickets = await checkinService.getTicketsByEvent(selectedEventId);
        setAttendeesData(tickets);
      } catch (err) {
        console.error('Failed to load attendees', err);
      }
    };
    loadAttendees();
  }, [selectedEventId]);

  useEffect(() => {
    const loadSeatStats = async () => {
      if (!selectedEventId) {
        setSeatStats(null);
        setSeatStatsError('');
        return;
      }
      try {
        const stats = await seatService.getSeatStats(selectedEventId);
        setSeatStats(stats);
        setSeatStatsError('');
      } catch (err) {
        console.error('Failed to load seat stats', err);
        setSeatStats(null);
        setSeatStatsError('');
      }
    };
    loadSeatStats();
  }, [selectedEventId]);

  const event = events.find((e) => e.id === selectedEventId);

  const eventAttendees = attendeesData.filter((a) => a.eventId === selectedEventId);
  const checkedIn = eventAttendees.filter((a) => a.checkedIn).length;
  const rate = calculateAttendanceRate(checkedIn, eventAttendees.length);

  const filtered = eventAttendees.filter((a) => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
    const matchTicket = !ticketFilter || a.ticketType === ticketFilter;
    const matchCheckin = !checkinFilter || (checkinFilter === 'checked' ? a.checkedIn : !a.checkedIn);
    return matchSearch && matchTicket && matchCheckin;
  });

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const toggleCheckin = async (id) => {
    const attendee = attendeesData.find((a) => a.id === id);
    if (!attendee) return;

    const nextCheckedIn = !attendee.checkedIn;
    try {
      const updated = await checkinService.updateCheckInStatus(id, nextCheckedIn);
      setAttendeesData((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (err) {
      console.error('Failed to update check-in status', err);
    }
  };

  const handleExport = () => {
    exportToCSV(eventAttendees.map((a) => ({
      Name: a.name, Email: a.email, Phone: a.phone,
      TicketType: a.ticketType, BookingId: a.bookingId,
      CheckedIn: a.checkedIn ? 'Yes' : 'No', CheckinTime: a.checkedInTime || '-',
    })), `attendees-event-${selectedEventId}`);
  };

  return (
    <div className="space-y-5">
      {/* Event Selector */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-48">
          <label className="text-sm font-semibold text-gray-600 mb-1 block">Select Event</label>
          <select value={selectedEventId} onChange={(e) => { setSelectedEventId(e.target.value); setPage(1); }}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E8441A]">
            <option value="" disabled>
              {eventsLoading ? 'Loading events...' : 'Select an event'}
            </option>
            {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
        <div className="mt-5">
          <Button variant="outline" leftIcon={Download} onClick={handleExport}>Export CSV</Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Registered', value: eventAttendees.length, color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: 'Checked In', value: checkedIn, color: 'bg-green-50 text-green-700 border-green-200' },
          { label: 'Pending', value: eventAttendees.length - checkedIn, color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { label: 'Attendance Rate', value: `${rate}%`, color: 'bg-purple-50 text-purple-700 border-purple-200' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl border px-5 py-4 ${color}`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm font-medium">{label}</p>
          </div>
        ))}
      </div>

      {seatStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Seats', value: seatStats.total, color: 'bg-gray-50 text-gray-700 border-gray-200' },
            { label: 'Booked Seats', value: seatStats.booked, color: 'bg-green-50 text-green-700 border-green-200' },
            { label: 'Seat Occupancy', value: `${seatStats.occupancyRate}%`, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
            { label: 'Seat Revenue', value: `₹${(seatStats.revenue || 0).toLocaleString('en-IN')}`, color: 'bg-teal-50 text-teal-700 border-teal-200' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-xl border px-5 py-4 ${color}`}>
              <p className="text-2xl font-bold break-words">{value}</p>
              <p className="text-sm font-medium">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by name or email..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8441A]" />
        </div>
        <select value={ticketFilter} onChange={(e) => { setTicketFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E8441A]">
          <option value="">All Ticket Types</option>
          <option value="General">General</option>
          <option value="VIP">VIP</option>
          <option value="Student">Student</option>
        </select>
        <select value={checkinFilter} onChange={(e) => { setCheckinFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E8441A]">
          <option value="">All Check-in Status</option>
          <option value="checked">Checked In</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-4">Attendee</th>
                <th className="px-5 py-4">Ticket</th>
                <th className="px-5 py-4">Registered</th>
                <th className="px-5 py-4">Check-in</th>
                <th className="px-5 py-4">Time</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedAttendee(a)}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#E8441A]/10 flex items-center justify-center text-[#E8441A] font-bold text-sm flex-shrink-0">
                        {a.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1A1A2E] text-sm">{a.name}</p>
                        <p className="text-xs text-gray-400">{a.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={a.ticketType === 'VIP' ? 'warning' : a.ticketType === 'Student' ? 'success' : 'info'}>
                      {a.ticketType}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{formatDate(a.registrationDate)}</td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleCheckin(a.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        a.checkedIn
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}>
                      <UserCheck className="w-3.5 h-3.5" />
                      {a.checkedIn ? 'Checked In' : 'Mark In'}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{a.checkedInTime || '—'}</td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#1A1A2E] transition-colors" title="Send email">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Remove">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400">No attendees match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-400">Page {page} of {totalPages}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 hover:border-[#E8441A] disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:border-[#E8441A] disabled:opacity-40">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Attendee Detail Modal */}
      <Modal isOpen={!!selectedAttendee} onClose={() => setSelectedAttendee(null)} title="Attendee Details" size="sm">
        {selectedAttendee && (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#E8441A]/10 flex items-center justify-center text-[#E8441A] text-2xl font-bold">
                {selectedAttendee.name[0]}
              </div>
              <div>
                <p className="font-bold text-[#1A1A2E] text-lg">{selectedAttendee.name}</p>
                <p className="text-gray-500 text-sm">{selectedAttendee.email}</p>
                <p className="text-gray-400 text-xs">{selectedAttendee.phone}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Booking ID', selectedAttendee.bookingId],
                ['Ticket Type', selectedAttendee.ticketType],
                ['Organisation', selectedAttendee.organization || '—'],
                ['Registered', formatDate(selectedAttendee.registrationDate)],
                ['Check-in Status', selectedAttendee.checkedIn ? 'Checked In' : 'Pending'],
                ['Check-in Time', selectedAttendee.checkedInTime || '—'],
              ].map(([label, val]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-[#1A1A2E]">{val}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AttendeeManagement;
