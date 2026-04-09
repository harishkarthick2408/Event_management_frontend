import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Building2, MapPin } from 'lucide-react';
import { useEventContext } from '../../context/EventContext';
import { categories } from '../../utils/constants';
import EventList from '../../components/event/EventList';
import Badge from '../../components/ui/Badge';

const EVENTS_PER_PAGE = 6;

const EventListing = () => {
  const [searchParams] = useSearchParams();
  const { filteredEvents, filters, setFilter, clearFilters } = useEventContext();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [venueFilter, setVenueFilter] = useState('all');

  // Sync URL category param
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setFilter('category', cat);
  }, [searchParams]);

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [filters]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setFilter('search', e.target.value);
    setPage(1);
  };

  const handleCategory = (cat) => {
    setFilter('category', filters.category === cat ? '' : cat);
    setPage(1);
  };

  const handleClearFilters = () => {
    clearFilters();
    setSearch('');
    setPage(1);
  };

  const venueFilteredEvents = filteredEvents.filter((event) => {
    const matchesVenue = venueFilter === 'all' || event.venueType === venueFilter;
    return matchesVenue;
  });

  // Paginate
  const totalPages = Math.ceil(venueFilteredEvents.length / EVENTS_PER_PAGE);
  const paginatedEvents = venueFilteredEvents.slice((page - 1) * EVENTS_PER_PAGE, page * EVENTS_PER_PAGE);

  const activeFiltersCount = [filters.category, filters.date, filters.location].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1A1A2E] to-[#2d2d5e] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Explore Events</h1>
          <p className="text-gray-400">{venueFilteredEvents.length} events found across India</p>

          {/* Search Bar */}
          <div className="relative mt-6 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, venues, cities..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#E8441A] focus:bg-white/15 transition-all text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Category pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => { setFilter('category', ''); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                !filters.category ? 'bg-[#E8441A] text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategory(c.name)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  filters.category === c.name
                    ? 'bg-[#E8441A] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Advanced filters toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
              showFilters ? 'bg-[#1A1A2E] text-white border-[#1A1A2E]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-[#E8441A] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Venue:</span>
            {['All', 'Indoor', 'Outdoor'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setVenueFilter(type.toLowerCase());
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  venueFilter === type.toLowerCase()
                    ? type === 'Indoor'
                      ? 'bg-blue-50 text-blue-700 border-blue-300'
                      : type === 'Outdoor'
                        ? 'bg-green-50 text-green-700 border-green-300'
                        : 'bg-[#E8441A] text-white border-[#E8441A]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {type === 'Indoor' && <Building2 size={12} className="inline mr-1" />}
                {type === 'Outdoor' && <MapPin size={12} className="inline mr-1" />}
                {type}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={filters.sortBy}
            onChange={(e) => setFilter('sortBy', e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E8441A]"
          >
            <option value="date">Sort: Date</option>
            <option value="popular">Sort: Popular</option>
            <option value="price-low">Sort: Price (Low)</option>
            <option value="price-high">Sort: Price (High)</option>
          </select>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Date</label>
              <input type="date" value={filters.date}
                onChange={(e) => { setFilter('date', e.target.value); setPage(1); }}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8441A]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Location / City</label>
              <input type="text" placeholder="e.g. Bangalore, Mumbai..."
                value={filters.location}
                onChange={(e) => { setFilter('location', e.target.value); setPage(1); }}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8441A]" />
            </div>
            <div className="flex items-end">
              <button onClick={handleClearFilters}
                className="w-full px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors">
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Active Filter Chips */}
        {(filters.category || filters.date || filters.location) && (
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="text-sm text-gray-500">Active filters:</span>
            {filters.category && (
              <Badge variant="primary" className="cursor-pointer" onClick={() => setFilter('category', '')}>
                {filters.category} <X className="w-3 h-3 ml-1 inline" />
              </Badge>
            )}
            {filters.date && (
              <Badge variant="info" className="cursor-pointer" onClick={() => setFilter('date', '')}>
                {filters.date} <X className="w-3 h-3 ml-1 inline" />
              </Badge>
            )}
            {filters.location && (
              <Badge variant="success" className="cursor-pointer" onClick={() => setFilter('location', '')}>
                {filters.location} <X className="w-3 h-3 ml-1 inline" />
              </Badge>
            )}
            <button onClick={handleClearFilters} className="text-xs text-red-500 hover:underline">Clear all</button>
          </div>
        )}

        {/* Events Grid */}
        <EventList events={paginatedEvents} loading={loading}
          emptyMessage="No events match your search. Try adjusting your filters." />

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:border-[#E8441A] hover:text-[#E8441A] disabled:opacity-40 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                  p === page
                    ? 'bg-[#E8441A] text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-[#E8441A] hover:text-[#E8441A]'
                }`}
              >{p}</button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:border-[#E8441A] hover:text-[#E8441A] disabled:opacity-40 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventListing;