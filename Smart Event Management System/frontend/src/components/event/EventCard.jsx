import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Bookmark, Clock, Building2 } from 'lucide-react';
import { formatDate, formatPrice, truncateText, calculateAttendanceRate } from '../../utils/helpers';
import { getStatusColor } from '../../utils/helpers';
import Badge from '../ui/Badge';

const EventCard = ({ event }) => {
  const { id, title, description, category, date, time, location, city, image, organizer, price, capacity, ticketsSold, status } = event;
  const attendanceRate = calculateAttendanceRate(ticketsSold, capacity);
  const isFull = ticketsSold >= capacity;

  return (
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="primary" className="bg-[#E8441A] text-white">{category}</Badge>
        </div>

        {/* Bookmark */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white hover:text-[#E8441A] transition-all duration-200 shadow-sm">
          <Bookmark className="w-4 h-4 text-gray-600" />
        </button>

        {/* Status */}
        {status && (
          <div className="absolute bottom-3 right-3">
            <Badge variant={getStatusColor(status)} dot>{status}</Badge>
          </div>
        )}

        {/* Price */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/95 text-[#E8441A] text-sm font-bold px-3 py-1 rounded-full shadow-sm">
            {formatPrice(price)}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <Link to={`/events/${id}`}>
          <h3 className="text-[#1A1A2E] font-bold text-base leading-snug mb-2 group-hover:text-[#E8441A] transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {truncateText(description, 100)}
        </p>

        {/* Meta */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Calendar className="w-3.5 h-3.5 text-[#E8441A] flex-shrink-0" />
            <span>{formatDate(date)}</span>
            {time && (
              <>
                <Clock className="w-3.5 h-3.5 text-[#E8441A] flex-shrink-0 ml-1" />
                <span>{time}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <MapPin className="w-3.5 h-3.5 text-[#E8441A] flex-shrink-0" />
            <span className="truncate">{city}</span>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            event.venueType === 'indoor' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
          }`}>
            {event.venueType === 'indoor' ? (
              <><Building2 size={10} /> Indoor</>
            ) : (
              <><MapPin size={10} /> Outdoor</>
            )}
          </span>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Users className="w-3.5 h-3.5 text-[#E8441A] flex-shrink-0" />
            <span>{ticketsSold?.toLocaleString()} / {capacity?.toLocaleString()} registered</span>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Capacity</span>
            <span className={isFull ? 'text-red-500 font-semibold' : ''}>{attendanceRate}% filled</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                attendanceRate >= 90 ? 'bg-red-500' : attendanceRate >= 70 ? 'bg-amber-500' : 'bg-[#E8441A]'
              }`}
              style={{ width: `${Math.min(attendanceRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#E8441A]/10 flex items-center justify-center text-xs font-bold text-[#E8441A]">
              {organizer?.[0]}
            </div>
            <span className="text-xs text-gray-500 font-medium">{organizer}</span>
          </div>
          <Link
            to={`/events/${id}`}
            className="text-xs font-semibold text-[#E8441A] hover:underline transition-colors"
          >
            {isFull ? 'View Details →' : 'Register →'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;