import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { CheckCircle, Download, Calendar, Share2, Ticket, Copy, Check } from 'lucide-react';
import { formatDate, formatTime, formatPrice } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const TicketConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const state = location.state;

  useEffect(() => {
    if (!state?.bookingId) {
      navigate('/events');
      return;
    }
    setTimeout(() => setShowConfetti(true), 200);
  }, []);

  if (!state?.bookingId) return null;

  const { bookingId, event, attendee, ticketType, quantity, total } = state;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const confettiElements = Array.from({ length: 20 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 40}%`,
    color: ['#E8441A', '#F5A623', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'][i % 6],
    size: `${8 + Math.random() * 12}px`,
    delay: `${Math.random() * 2}s`,
  }));

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 relative overflow-hidden">
      {/* Confetti Elements */}
      {showConfetti && confettiElements.map((c, i) => (
        <div
          key={i}
          className="absolute rounded-sm opacity-70 animate-bounce"
          style={{
            left: c.left, top: c.top,
            width: c.size, height: c.size,
            backgroundColor: c.color,
            animationDelay: c.delay,
            animationDuration: `${1 + Math.random()}s`,
          }}
        />
      ))}

      <div className="max-w-2xl mx-auto px-4 relative z-10">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
          </div>
          <h1 className="text-4xl font-bold text-[#1A1A2E] mb-2">Booking Confirmed! 🎉</h1>
          <p className="text-gray-500">Your ticket is ready. See you at the event!</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
          {/* Top */}
          <div className="bg-gradient-to-r from-[#E8441A] to-[#F5A623] p-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Ticket className="w-5 h-5" />
              <span className="text-sm font-semibold opacity-90">Event Ticket</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">{event.title}</h2>
            <Badge className="bg-white/20 text-white">{ticketType}</Badge>
          </div>

          {/* Booking ID with dashed border */}
          <div className="px-6 py-4 bg-gray-50 border-b border-dashed border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Booking ID</p>
                <p className="font-mono font-bold text-lg text-[#1A1A2E] tracking-wider">{bookingId}</p>
              </div>
              <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium hover:border-[#E8441A] hover:text-[#E8441A] transition-all">
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-2 gap-4 p-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">Date</p>
              <p className="font-semibold text-[#1A1A2E] text-sm">{formatDate(event.date)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Time</p>
              <p className="font-semibold text-[#1A1A2E] text-sm">{formatTime(event.time)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Venue</p>
              <p className="font-semibold text-[#1A1A2E] text-sm">{event.city}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Attendee</p>
              <p className="font-semibold text-[#1A1A2E] text-sm">{attendee.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Quantity</p>
              <p className="font-semibold text-[#1A1A2E] text-sm">{quantity} ticket{quantity > 1 ? 's' : ''}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Total Paid</p>
              <p className="font-semibold text-[#E8441A] text-sm">{total === 0 ? 'Free' : formatPrice(total)}</p>
            </div>
          </div>

          {/* Dashed Divider */}
          <div className="relative mx-6">
            <div className="border-t-2 border-dashed border-gray-200" />
            <div className="absolute -left-9 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#F8F9FA] rounded-full border border-gray-200" />
            <div className="absolute -right-9 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#F8F9FA] rounded-full border border-gray-200" />
          </div>

          {/* QR Code */}
          <div className="p-6 text-center">
            <p className="text-xs text-gray-400 mb-4">Scan this QR code at the event entrance</p>
            <div className="inline-block p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-inner">
              <QRCode value={bookingId} size={160} level="H" />
            </div>
            <p className="text-xs text-gray-400 mt-4">{bookingId}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button variant="outline" leftIcon={Download} fullWidth>
            Download Ticket
          </Button>
          <Button variant="outline" leftIcon={Calendar} fullWidth>
            Add to Calendar
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="ghost" leftIcon={Share2} fullWidth>
            Share
          </Button>
          <Link to="/my-tickets" className="flex-1">
            <Button variant="secondary" fullWidth>View My Tickets</Button>
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          A confirmation email has been sent to {attendee.email}
        </p>
      </div>
    </div>
  );
};

export default TicketConfirmation;
