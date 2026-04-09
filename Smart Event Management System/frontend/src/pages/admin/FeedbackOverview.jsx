import { useEffect, useState } from 'react';
import { Star, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEventContext } from '../../context/EventContext';
import { formatDate } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import feedbackService from '../../services/feedbackService';

const FeedbackOverview = () => {
  const { events } = useEventContext();
  const [selectedEventId, setSelectedEventId] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const COMMENTS_PER_PAGE = 4;

  // Initialize selected event when events load
  useEffect(() => {
    if (!selectedEventId && events.length > 0) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  // Load feedback when event selection changes
  useEffect(() => {
    if (!selectedEventId) return;
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await feedbackService.getFeedbackByEvent(selectedEventId);
        if (isMounted) {
          setFeedback(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load feedback');
          setFeedback([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [selectedEventId]);

  const eventFeedback = feedback;

  const normalizedFeedback = eventFeedback
    .map((f) => {
      const rawOverall =
        f.overallRating !== undefined && f.overallRating !== null
          ? f.overallRating
          : f.rating !== undefined && f.rating !== null
          ? f.rating
          : 0;

      const overall = Number(rawOverall) || 0;
      const base = overall || 0;

      return {
        ...f,
        id: f.id || f._id, // ensure stable id for React
        name: f.attendeeName || f.name || '',
        overallRating: overall,
        venueRating:
          typeof f.venueRating === 'number'
            ? f.venueRating
            : base,
        contentRating:
          typeof f.contentRating === 'number'
            ? f.contentRating
            : base,
        organizationRating:
          typeof f.organizationRating === 'number'
            ? f.organizationRating
            : base,
        speakerRating:
          typeof f.speakerRating === 'number'
            ? f.speakerRating
            : base,
        comment: f.comment || f.comments || '',
      };
    })
    .filter((f) => Number.isFinite(f.overallRating) && f.overallRating > 0);

  const totalReviews = normalizedFeedback.length;

  // Average scores
  const avg = (key) => {
    if (!normalizedFeedback.length) return 0;
    return (
      normalizedFeedback.reduce((sum, f) => sum + (f[key] || 0), 0) /
      totalReviews
    ).toFixed(1);
  };
  const overallAvg = parseFloat(avg('overallRating'));
  const categoryScores = [
    { label: 'Overall', key: 'overallRating', score: parseFloat(avg('overallRating')) },
    { label: 'Venue', key: 'venueRating', score: parseFloat(avg('venueRating')) },
    { label: 'Content', key: 'contentRating', score: parseFloat(avg('contentRating')) },
    { label: 'Organisation', key: 'organizationRating', score: parseFloat(avg('organizationRating')) },
    { label: 'Speakers', key: 'speakerRating', score: parseFloat(avg('speakerRating')) },
  ];

  // Rating distribution
  const ratingDist = [5, 4, 3, 2, 1].map((r) => {
    const count = normalizedFeedback.filter((f) => f.overallRating === r).length;
    return { stars: r, count, pct: totalReviews ? Math.round((count / totalReviews) * 100) : 0 };
  });

  // Sentiment
  const positive = normalizedFeedback.filter((f) => f.overallRating >= 4).length;
  const neutral = normalizedFeedback.filter((f) => f.overallRating === 3).length;
  const negative = normalizedFeedback.filter((f) => f.overallRating <= 2).length;

  // Filtered comments
  const filteredComments = normalizedFeedback.filter((f) => {
    const matchRating =
      !ratingFilter || Math.round(f.overallRating) === ratingFilter;
    const matchSearch =
      !search ||
      (f.comment || '').toLowerCase().includes(search.toLowerCase()) ||
      (f.name || '')
        .toLowerCase()
        .includes(search.toLowerCase());
    return matchRating && matchSearch;
  });
  const commentsToShow =
    filteredComments.length > 0 || !ratingFilter ? filteredComments : normalizedFeedback;

  const totalPages = Math.ceil(commentsToShow.length / COMMENTS_PER_PAGE) || 1;
  const pagedComments = commentsToShow.slice(
    (page - 1) * COMMENTS_PER_PAGE,
    page * COMMENTS_PER_PAGE
  );

  const StarDisplay = ({ rating, big = false }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`${big ? 'w-5 h-5' : 'w-3.5 h-3.5'} ${s <= rating ? 'fill-[#F5A623] text-[#F5A623]' : 'text-gray-200'}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Event Selector */}
      <div className="flex items-center justify-between">
        <select
          value={selectedEventId}
          onChange={(e) => {
            setSelectedEventId(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E8441A] max-w-sm">
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
        <Button variant="outline" leftIcon={Download} size="sm">Export Feedback</Button>
      </div>

      {loading && (
        <div className="text-sm text-gray-400">Loading feedback...</div>
      )}
      {error && !loading && (
        <div className="text-sm text-red-500">{error}</div>
      )}

      {/* Overall Score */}
      <div className="bg-gradient-to-br from-[#1A1A2E] to-[#2d2d5e] rounded-2xl p-8 text-white flex items-center gap-8">
        <div className="text-center">
          <p className="text-7xl font-bold text-white">{overallAvg || '—'}</p>
          <StarDisplay rating={Math.round(overallAvg)} big />
          <p className="text-gray-400 text-sm mt-2">{totalReviews} reviews</p>
        </div>
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-3">Rating Distribution</p>
          {ratingDist.map(({ stars, count, pct }) => (
            <div key={stars} className="flex items-center gap-3 mb-2">
              <span className="text-xs text-gray-400 w-4">{stars}</span>
              <Star className="w-3 h-3 fill-[#F5A623] text-[#F5A623]" />
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#F5A623] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs text-gray-400 w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Scores */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categoryScores.map(({ label, score }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm text-center">
            <p className="text-3xl font-bold text-[#1A1A2E] mb-1">{score || '—'}</p>
            <div className="flex justify-center mb-1">
              <StarDisplay rating={Math.round(score)} />
            </div>
            <p className="text-xs text-gray-400 font-medium">{label}</p>
            <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#E8441A] rounded-full" style={{ width: `${(score / 5) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Sentiment */}
      {totalReviews > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-[#1A1A2E] mb-4">Sentiment Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Positive (4-5★)', count: positive, color: 'bg-green-100 text-green-700 border-green-200', pct: Math.round((positive / totalReviews) * 100) },
              { label: 'Neutral (3★)', count: neutral, color: 'bg-amber-100 text-amber-700 border-amber-200', pct: Math.round((neutral / totalReviews) * 100) },
              { label: 'Negative (1-2★)', count: negative, color: 'bg-red-100 text-red-600 border-red-200', pct: Math.round((negative / totalReviews) * 100) },
            ].map(({ label, count, color, pct }) => (
              <div key={label} className={`rounded-xl border p-4 text-center ${color}`}>
                <p className="text-3xl font-bold">{pct}%</p>
                <p className="text-xs font-medium mt-1">{label}</p>
                <p className="text-xs opacity-70">{count} review{count !== 1 ? 's' : ''}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-[#1A1A2E] mb-4">Comments ({commentsToShow.length})</h3>
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search comments..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8441A]" />
          </div>
          <div className="flex gap-1">
            <button onClick={() => { setRatingFilter(0); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold ${ratingFilter === 0 ? 'bg-[#E8441A] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              All
            </button>
            {[5, 4, 3, 2, 1].map((r) => (
              <button key={r} onClick={() => { setRatingFilter(r); setPage(1); }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 ${ratingFilter === r ? 'bg-[#E8441A] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {r}<Star className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>

        {pagedComments.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Star className="w-10 h-10 mx-auto mb-2 opacity-20" />
            <p>No comments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pagedComments.map((f) => (
              <div key={f.id} className="p-5 bg-gray-50 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E8441A]/10 flex items-center justify-center text-[#E8441A] font-bold text-sm">
                      {(f.attendeeName || f.name || '?')[0]}
                    </div>
                    <div>
                      <p className="font-bold text-[#1A1A2E] text-sm">{f.attendeeName || f.name}</p>
                      <p className="text-xs text-gray-400">{formatDate(f.createdAt?.slice(0, 10))}</p>
                    </div>
                  </div>
                  <StarDisplay rating={f.overallRating} />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic">"{f.comment}"</p>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg border border-gray-200 hover:border-[#E8441A] disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-500">{page} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:border-[#E8441A] disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackOverview;
