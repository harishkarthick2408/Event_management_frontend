import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Calendar, MapPin, Clock, Download, Copy, Check } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/helpers';
import Badge from '../ui/Badge';

const TicketCard = ({ ticket, event, onViewQR }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ticket.bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ticketTypeVariant = {
    VIP: 'warning',
    General: 'info',
    Student: 'success',
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-200">
      {/* Top Section */}
      <div className="flex">
        {/* Left accent strip */}
        <div className="w-1.5 bg-gradient-to-b from-[#E8441A] to-[#F5A623]" />

        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#1A1A2E] text-base leading-snug mb-1 truncate">
                {event?.title || 'Event'}
              </h3>
              <div className="flex items-center flex-wrap gap-2 mb-3">
                <Badge variant={ticketTypeVariant[ticket.ticketType] || 'default'}>
                  {ticket.ticketType}
                </Badge>
                <Badge variant={ticket.checkedIn ? 'success' : 'warning'} dot>
                  {ticket.checkedIn ? 'Checked In' : 'Pending'}
                </Badge>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-3.5 h-3.5 text-[#E8441A]" />
                  <span>{formatDate(event?.date)}</span>
                </div>
                {event?.time && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-[#E8441A]" />
                    <span>{formatTime(event.time)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-3.5 h-3.5 text-[#E8441A]" />
                  <span className="truncate">{event?.city}</span>
                </div>
              </div>
            </div>

            {/* QR Code (mini) */}
            <div
              onClick={() => onViewQR && onViewQR(ticket)}
              className="flex-shrink-0 w-20 h-20 border border-gray-200 rounded-xl p-1.5 cursor-pointer hover:border-[#E8441A] transition-colors"
              title="Click to enlarge QR"
            >
              <QRCode value={ticket.bookingId || 'TICKET'} size={64} level="M" />
            </div>
          </div>
        </div>
      </div>

      {/* Dashed Divider (ticket stub) */}
      <div className="relative mx-5">
        <div className="border-t-2 border-dashed border-gray-200" />
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#F8F9FA] rounded-full border border-gray-200" />
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#F8F9FA] rounded-full border border-gray-200" />
      </div>

      {/* Bottom Section */}
      <div className="p-5 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Booking ID</p>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-[#1A1A2E]">{ticket.bookingId}</span>
              <button
                onClick={handleCopy}
                className="text-gray-400 hover:text-[#E8441A] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewQR && onViewQR(ticket)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#E8441A] text-[#E8441A] hover:bg-[#E8441A] hover:text-white transition-all duration-200"
            >
              View QR
            </button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1A1A2E] text-white hover:bg-[#2a2a4e] transition-colors flex items-center gap-1">
              <Download className="w-3 h-3" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
