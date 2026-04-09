import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, MapPin, Clock, Users, Tag, Share2,
  Twitter, Linkedin, Copy, ChevronRight, Star, Building2, Trees
} from 'lucide-react';
import { useEventContext } from '../../context/EventContext';
import { formatDate, formatTime, formatPrice, calculateAttendanceRate } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById } = useEventContext();
  const [activeTab, setActiveTab] = useState('about');
  const [quantity, setQuantity] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [copied, setCopied] = useState(false);

  const event = getEventById(id);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">Event Not Found</h2>
          <p className="text-gray-500 mb-4">This event doesn't exist or has been removed.</p>
          <Button variant="primary" onClick={() => navigate('/events')}>Browse Events</Button>
        </div>
      </div>
    );
  }

  const ticketOptions = [
    {
      name: 'General',
      type: 'General',
      price: event.price,
      description: 'All main sessions',
      perks: ['All main sessions', 'Networking lunch', 'Digital certificate'],
    },
    {
      name: 'VIP',
      type: 'VIP',
      price: event.price + 1499,
      description: 'All General benefits',
      perks: ['All General benefits', 'VIP lounge', 'Meet speakers', 'Recorded sessions'],
    },
    {
      name: 'Student',
      type: 'Student',
      price: Math.round(event.price * 0.3) || 0,
      description: 'Main sessions',
      perks: ['Main sessions', 'Networking lunch', 'Digital certificate'],
    },
  ];

  useEffect(() => {
    if (!selectedTicket) {
      setSelectedTicket(ticketOptions[0]);
    }
  }, [selectedTicket, ticketOptions]);

  const selectedTicketData = selectedTicket || ticketOptions[0];
  const subtotal = selectedTicketData.price * quantity;
  const attendanceRate = calculateAttendanceRate(event.ticketsSold, event.capacity);

  const handleRegister = () => {
    if (!selectedTicket) {
      alert('Please select a ticket type');
      return;
    }

    if (event.venueType === 'indoor') {
      navigate(`/events/${id}/register`, {
        state: {
          ticketType: selectedTicket,
          quantity,
          eventId: id,
          venueType: 'indoor',
          requiresSeatSelection: true,
        },
      });
      return;
    }

    navigate(`/events/${id}/register`, {
      state: {
        ticketType: selectedTicket,
        quantity,
        eventId: id,
        venueType: 'outdoor',
        requiresSeatSelection: false,
      },
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = ['about', 'schedule', 'speakers'];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Banner */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back Button */}
        <button onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Bottom overlay info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <Badge variant="primary" className="mb-3">{event.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{event.title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Meta */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-[#E8441A] mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Date</p>
                  <p className="text-sm font-semibold text-[#1A1A2E]">{formatDate(event.date)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#E8441A] mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Time</p>
                  <p className="text-sm font-semibold text-[#1A1A2E]">{formatTime(event.time)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E8441A] mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Location</p>
                  <p className="text-sm font-semibold text-[#1A1A2E]">{event.city}</p>
                  {event.venueType === 'indoor' ? (
                    <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      <Building2 size={12} />
                      Indoor Event · Seat Selection Available
                    </span>
                  ) : (
                    <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      <Trees size={12} />
                      Outdoor Event · Open Seating
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-[#E8441A] mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Attendees</p>
                  <p className="text-sm font-semibold text-[#1A1A2E]">{event.ticketsSold}/{event.capacity}</p>
                </div>
              </div>
            </div>

            {/* Organizer */}
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 flex items-center gap-4">
              <img src={event.organizerAvatar} alt={event.organizer}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#E8441A]/20" />
              <div>
                <p className="text-xs text-gray-400">Organised by</p>
                <p className="font-bold text-[#1A1A2E]">{event.organizer}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
              <div className="flex border-b border-gray-100">
                {tabs.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-[#E8441A] border-b-2 border-[#E8441A]'
                        : 'text-gray-500 hover:text-[#1A1A2E]'
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'about' && (
                  <div>
                    <p className="text-gray-600 leading-relaxed mb-5">{event.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {event.tags?.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-[#E8441A]/10 text-[#E8441A] text-xs font-semibold rounded-full">
                          <Tag className="w-3 h-3" />{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'schedule' && (
                  <div className="space-y-4">
                    {event.schedule?.map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 bg-[#E8441A]/10 rounded-full flex items-center justify-center text-[#E8441A] text-xs font-bold flex-shrink-0">
                            {i + 1}
                          </div>
                          {i < event.schedule.length - 1 && (
                            <div className="w-0.5 flex-1 bg-gray-100 my-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-[#E8441A] bg-[#E8441A]/10 px-2 py-0.5 rounded-full">{item.time}</span>
                          </div>
                          <p className="font-semibold text-[#1A1A2E] text-sm">{item.title}</p>
                          {item.speaker && <p className="text-xs text-gray-400">{item.speaker}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'speakers' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {event.speakers?.map((speaker) => (
                      <div key={speaker.id} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                        <img src={speaker.photo} alt={speaker.name}
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                        <div>
                          <p className="font-bold text-[#1A1A2E] text-sm">{speaker.name}</p>
                          <p className="text-xs text-[#E8441A] font-medium mb-1">{speaker.role}</p>
                          <p className="text-xs text-gray-500 line-clamp-2">{speaker.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="mb-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Select Ticket</p>
                  <div className="space-y-2">
                    {ticketOptions.map((t, i) => (
                      <button key={i} onClick={() => setSelectedTicket(t)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                          selectedTicket?.name === t.name
                            ? 'border-[#E8441A] bg-[#E8441A]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                        <div className="text-left">
                          <p className="text-sm font-bold text-[#1A1A2E]">{t.type}</p>
                          <p className="text-xs text-gray-400">{t.perks[0]}</p>
                        </div>
                        <span className={`text-sm font-bold ${selectedTicket?.name === t.name ? 'text-[#E8441A]' : 'text-gray-700'}`}>
                          {formatPrice(t.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quantity</p>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:border-[#E8441A] hover:text-[#E8441A] text-xl font-light transition-colors">
                      −
                    </button>
                    <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                    <button onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:border-[#E8441A] hover:text-[#E8441A] text-xl font-light transition-colors">
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="p-4 bg-gray-50 rounded-xl mb-5">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-bold text-[#1A1A2E]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#E8441A] rounded-full" style={{ width: `${attendanceRate}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{100 - attendanceRate}% tickets remaining</p>
                </div>

                <Button variant="primary" fullWidth rightIcon={ChevronRight} onClick={handleRegister}>Register Now</Button>

                {/* Share */}
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Share Event</p>
                  <div className="flex gap-2">
                    <button onClick={handleCopyLink} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                      {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                    <a href={`https://twitter.com/share?url=${window.location.href}`} target="_blank" rel="noreferrer"
                      className="p-2 rounded-lg bg-sky-100 text-sky-600 hover:bg-sky-200 transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a href={`https://linkedin.com/sharing/share-offsite/?url=${window.location.href}`} target="_blank" rel="noreferrer"
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Event Details Card */}
                <div className="mt-5 pt-5 border-t border-gray-100 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Category</span>
                    <Badge variant="primary">{event.category}</Badge>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Language</span>
                    <span className="font-medium text-[#1A1A2E]">{event.language}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Capacity</span>
                    <span className="font-medium text-[#1A1A2E]">{event.capacity}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;