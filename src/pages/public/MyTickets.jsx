import { useState } from 'react';
import { Search, Ticket, Filter } from 'lucide-react';
import QRCode from 'react-qr-code';
import { attendees, events } from '../../utils/constants';
import TicketCard from '../../components/event/TicketCard';
import Modal from '../../components/ui/Modal';

const tabs = ['All', 'Upcoming', 'Past', 'Cancelled'];

const MyTickets = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [qrTicket, setQrTicket] = useState(null); // for QR modal

  // Mock: Use first attendee's data
  const myAttendees = attendees.slice(0, 8);

  const getEvent = (eventId) => events.find((e) => e.id === eventId);

  const now = new Date();

  const filtered = myAttendees.filter((a) => {
    const event = getEvent(a.eventId);
    if (!event) return false;

    // Search
    if (search) {
      const q = search.toLowerCase();
      if (!event.title.toLowerCase().includes(q) && !a.bookingId.toLowerCase().includes(q)) return false;
    }

    // Tab filter
    const eventDate = new Date(event.date);
    if (activeTab === 'Upcoming') return eventDate >= now;
    if (activeTab === 'Past') return eventDate < now;
    if (activeTab === 'Cancelled') return false; // no cancelled in mock

    return true;
  });

  const tabCounts = {
    All: myAttendees.length,
    Upcoming: myAttendees.filter((a) => {
      const e = getEvent(a.eventId);
      return e && new Date(e.date) >= now;
    }).length,
    Past: myAttendees.filter((a) => {
      const e = getEvent(a.eventId);
      return e && new Date(e.date) < now;
    }).length,
    Cancelled: 0,
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1A1A2E] to-[#2d2d5e] text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Ticket className="w-7 h-7 text-[#E8441A]" />
            <h1 className="text-3xl font-bold">My Tickets</h1>
          </div>
          <p className="text-gray-400">All your event registrations in one place</p>

          {/* Search */}
          <div className="relative mt-5 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by event name or booking ID..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#E8441A]" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-6 w-fit">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-[#E8441A] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}>
              {tab}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>{tabCounts[tab]}</span>
            </button>
          ))}
        </div>

        {/* Ticket List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">
              {search ? 'No tickets match your search' : `No ${activeTab.toLowerCase()} tickets`}
            </h3>
            <p className="text-gray-400 text-sm">
              {activeTab === 'Cancelled' ? 'You have no cancelled tickets.' : 'Browse events and register to see your tickets here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((ticket) => {
              const event = getEvent(ticket.eventId);
              if (!event) return null;
              return (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  event={event}
                  onViewQR={(t) => setQrTicket(t)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* QR Modal */}
      <Modal isOpen={!!qrTicket} onClose={() => setQrTicket(null)} title="Ticket QR Code" size="sm">
        {qrTicket && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 mb-4">Show this at the event entrance</p>
            <div className="inline-block p-4 bg-white border-2 border-gray-100 rounded-2xl">
              <QRCode value={qrTicket.bookingId} size={200} level="H" />
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-1">Booking ID</p>
              <p className="font-mono font-bold text-[#1A1A2E]">{qrTicket.bookingId}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyTickets;
