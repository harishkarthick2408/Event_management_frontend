import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Edit2, Eye, Copy, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEventContext } from '../../context/EventContext';
import { formatDate, formatPrice, calculateAttendanceRate } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const ROWS_PER_PAGE = 6;

const statusVariant = { published: 'success', draft: 'warning', completed: 'info', cancelled: 'error' };

const EventManagement = () => {
  const navigate = useNavigate();
  const { events, deleteEvent } = useEventContext();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selected, setSelected] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const filtered = events.filter((e) => {
    const matchSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.city || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || e.status === statusFilter;
    const matchCat = !categoryFilter || e.category === categoryFilter;
    return matchSearch && matchStatus && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE) || 1;
  const paged = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const toggleSelect = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleAll = () =>
    setSelected(selected.length === paged.length ? [] : paged.map((e) => e.id));

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      await deleteEvent(deleteTarget.id);
    } catch (err) {
      console.error('Failed to delete event', err);
    }
    setDeleteTarget(null);
    setLoading(false);
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      for (const id of selected) {
        // eslint-disable-next-line no-await-in-loop
        await deleteEvent(id);
      }
    } catch (err) {
      console.error('Failed to bulk delete events', err);
    }
    setSelected([]);
    setLoading(false);
  };

  const statCounts = {
    total: events.length,
    published: events.filter((e) => e.status === 'published').length,
    draft: events.filter((e) => e.status === 'draft').length,
    completed: events.filter((e) => e.status === 'completed').length,
  };

  const categories = [...new Set(events.map((e) => e.category).filter(Boolean))];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Manage all your events</p>
        </div>
        <Link to="/admin/events/create">
          <Button variant="primary" leftIcon={Plus}>
            Create New Event
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: statCounts.total, color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: 'Published', value: statCounts.published, color: 'bg-green-50 text-green-700 border-green-200' },
          { label: 'Draft', value: statCounts.draft, color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { label: 'Completed', value: statCounts.completed, color: 'bg-purple-50 text-purple-700 border-purple-200' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl border px-5 py-4 ${color}`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8441A]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8441A] bg-white"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8441A] bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="bg-[#E8441A]/5 border border-[#E8441A]/20 rounded-xl px-5 py-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-[#E8441A]">
            {selected.length} event{selected.length > 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-2">
            <Button variant="danger" size="sm" leftIcon={Trash2} onClick={handleBulkDelete} loading={loading}>
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selected.length === paged.length && paged.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-4 py-4">Event</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Tickets</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.map((ev) => {
                const rate = calculateAttendanceRate(ev.ticketsSold, ev.capacity);
                return (
                  <tr
                    key={ev.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      selected.includes(ev.id) ? 'bg-[#E8441A]/5' : ''
                    }`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selected.includes(ev.id)}
                        onChange={() => toggleSelect(ev.id)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={ev.image}
                          alt={ev.title}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-[#1A1A2E] text-sm">{ev.title}</p>
                          <p className="text-xs text-gray-400">{ev.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="info">{ev.category}</Badge>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{formatDate(ev.date)}</td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-[#1A1A2E]">
                        {ev.ticketsSold}/{ev.capacity}
                      </p>
                      <div className="h-1 w-16 bg-gray-100 rounded-full mt-1">
                        <div
                          className="h-full bg-[#E8441A] rounded-full"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant={statusVariant[ev.status] || 'default'}
                        dot
                        className="capitalize"
                      >
                        {ev.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/admin/events/${ev.id}/edit`}>
                          <button
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#1A1A2E] transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </Link>
                        <Link to={`/events/${ev.id}`}>
                          <button
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#1A1A2E] transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#1A1A2E] transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(ev)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No events match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing {(page - 1) * ROWS_PER_PAGE + 1}–
              {Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 hover:border-[#E8441A] disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold ${
                    p === page
                      ? 'bg-[#E8441A] text-white'
                      : 'border border-gray-200 hover:border-[#E8441A] text-gray-600'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:border-[#E8441A] disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Event"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={loading}>
              Delete
            </Button>
          </>
        }
      >
        <div className="text-center py-2">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-7 h-7 text-red-500" />
          </div>
          <p className="text-gray-600 text-sm">
            Are you sure you want to delete <strong>"{deleteTarget?.title}"</strong>? This action cannot be
            undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default EventManagement;
