import { useParams } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { events } from '../../utils/constants';
import { formatDate, formatTime } from '../../utils/helpers';
import FeedbackForm from '../../components/event/FeedbackForm';
import { useState } from 'react';

const Feedback = () => {
  const { eventId } = useParams();
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const event = events.find((e) => e.id === eventId) || events[0];

  const handleSubmitSuccess = () => {
    setAlreadySubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Event Header */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="relative h-40">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h1 className="text-xl font-bold text-white">{event.title}</h1>
            </div>
          </div>
          <div className="p-4 flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#E8441A]" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#E8441A]" />
              <span>{event.city}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#E8441A]">🎤</span>
              <span>{event.organizer}</span>
            </div>
          </div>
        </div>

        {/* Feedback Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {alreadySubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎉</span>
              </div>
              <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">Feedback Submitted!</h2>
              <p className="text-gray-500 text-sm">Thank you for helping us improve future events.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#1A1A2E] mb-1">Share Your Experience</h2>
                <p className="text-gray-500 text-sm">
                  Your feedback helps organisers improve future events. This takes about 2 minutes.
                </p>
              </div>
              <FeedbackForm
                eventId={eventId || event.id}
                eventName={event.title}
                onSubmitSuccess={handleSubmitSuccess}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
