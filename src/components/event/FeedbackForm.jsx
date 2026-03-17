import { useState } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';

const RatingCategory = ({ label, value, onChange }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-none">
      <span className="text-sm font-semibold text-[#1A1A2E]">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
            className="transition-transform duration-150 hover:scale-110"
          >
            <Star
              className={`w-6 h-6 transition-colors duration-150 ${
                star <= (hovered || value)
                  ? 'fill-[#F5A623] text-[#F5A623]'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm font-bold text-[#1A1A2E] w-4">{value || '–'}</span>
      </div>
    </div>
  );
};

const FeedbackForm = ({ eventId, eventName, onSubmitSuccess }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [ratings, setRatings] = useState({
    overall: 0,
    venue: 0,
    content: 0,
    organization: 0,
    speakers: 0,
  });
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});

  const ratingLabels = [
    { key: 'overall', label: '⭐ Overall Experience' },
    { key: 'venue', label: '🏛️ Venue & Facilities' },
    { key: 'content', label: '📚 Content Quality' },
    { key: 'organization', label: '🗂️ Organization' },
    { key: 'speakers', label: '🎤 Speakers' },
  ];

  const totalPossible = ratingLabels.length;
  const filledRatings = Object.values(ratings).filter((v) => v > 0).length;
  const progress = Math.round((filledRatings / totalPossible) * 100);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Your name is required';
    if (ratings.overall === 0) newErrors.overall = 'Please rate your overall experience';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 1200));
    setLoading(false);
    setSubmitted(true);
    onSubmitSuccess?.({ eventId, name, ratings, comment });
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-[#1A1A2E] mb-2">Thank You! 🎉</h3>
        <p className="text-gray-500 mb-2">Your feedback has been submitted successfully.</p>
        <p className="text-gray-400 text-sm">Your opinions help us improve future events.</p>
        <div className="flex items-center justify-center gap-1 mt-4">
          {[1,2,3,4,5].map((s) => (
            <Star key={s} className={`w-6 h-6 ${s <= ratings.overall ? 'fill-[#F5A623] text-[#F5A623]' : 'text-gray-200'}`} />
          ))}
          <span className="ml-2 font-bold text-[#1A1A2E]">{ratings.overall} / 5</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Progress</span>
          <span className="font-semibold text-[#E8441A]">{filledRatings} of {totalPossible} ratings</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E8441A] to-[#F5A623] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="text-sm font-semibold text-[#1A1A2E] mb-1 block">Your Name <span className="text-[#E8441A]">*</span></label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`input-field ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      {/* Star Ratings */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h4 className="font-bold text-[#1A1A2E] mb-1">Rate Your Experience</h4>
        {errors.overall && <p className="text-xs text-red-500 mb-2">{errors.overall}</p>}
        {ratingLabels.map(({ key, label }) => (
          <RatingCategory
            key={key}
            label={label}
            value={ratings[key]}
            onChange={(val) => setRatings((prev) => ({ ...prev, [key]: val }))}
          />
        ))}
      </div>

      {/* Comment */}
      <div>
        <label className="text-sm font-semibold text-[#1A1A2E] mb-1 block">
          Additional Comments <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          placeholder="Share your experience, suggestions, or any other feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="input-field resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">{comment.length}/500 characters</p>
      </div>

      <Button type="submit" variant="primary" fullWidth loading={loading} rightIcon={Send}>
        Submit Feedback
      </Button>
    </form>
  );
};

export default FeedbackForm;
