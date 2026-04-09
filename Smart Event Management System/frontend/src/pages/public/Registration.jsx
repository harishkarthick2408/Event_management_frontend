import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Check, ChevronRight, ChevronLeft, User, Mail, Phone, Building2, Sparkles, MapPin, CheckCircle } from 'lucide-react';
import { useEventContext } from '../../context/EventContext';
import { useAuth } from '../../hooks/useAuth';
import { formatDate, formatTime, formatPrice, generateBookingId } from '../../utils/helpers';
import SeatMap from '../../components/seats/SeatMap';
import SeatLegend from '../../components/seats/SeatLegend';
import SeatTimer from '../../components/seats/SeatTimer';
import { allocateSeats, generateSeatLayout, holdSeats, releaseExpiredHolds, simulateExistingBookings } from '../../utils/seatAlgorithm';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { paymentService } from '../../services/paymentService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const createBackendTicket = async ({ eventId, attendeeName, attendeeEmail, ticketType }) => {
  const token = localStorage.getItem('eventpro_token');

  const res = await fetch(`${API_BASE_URL}/api/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      event: eventId,
      attendeeName,
      attendeeEmail,
      ticketType,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create ticket');
  }

  return data;
};

const ticketOptions = [
  {
    name: 'General',
    type: 'General',
    priceAdd: 0,
    description: 'All main sessions',
    perks: ['All main sessions', 'Networking lunch', 'Digital certificate'],
  },
  {
    name: 'VIP',
    type: 'VIP',
    priceAdd: 1499,
    description: 'All General benefits',
    perks: ['All General benefits', 'VIP lounge', 'Meet speakers', 'Recorded sessions', 'Executive dinner'],
  },
  {
    name: 'Student',
    type: 'Student',
    studentMultiplier: 0.3,
    description: 'Main sessions',
    perks: ['Main sessions', 'Networking lunch', 'Digital certificate'],
  },
];

const DEFAULT_SEAT_CONFIG = {
  rows: 10,
  seatsPerRow: 20,
  vipRows: 2,
  premiumRows: 3,
  prices: { VIP: 2999, Premium: 1499, Regular: 999 },
};

const typeToSection = {
  VIP: 'VIP',
  General: 'Regular',
  Student: 'Regular',
};

const Registration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const incomingTicketType = location.state?.ticketType || null;
  const incomingQuantity = location.state?.quantity || 1;
  const { getEventById } = useEventContext();
  const { currentUser } = useAuth();
  const event = getEventById(id);
  const venueType = location.state?.venueType || event?.venueType || 'outdoor';
  const requiresSeatSelection = location.state?.requiresSeatSelection ?? (venueType === 'indoor');

  const matchedTicketIndex = incomingTicketType
    ? Math.max(
      0,
      ticketOptions.findIndex((t) =>
        t.name === incomingTicketType?.name ||
        t.type === incomingTicketType?.type ||
        t.name === incomingTicketType ||
        t.type === incomingTicketType
      )
    )
    : 0;

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTicketIdx, setSelectedTicketIdx] = useState(matchedTicketIndex);
  const [quantity, setQuantity] = useState(Math.min(10, Math.max(1, Number(incomingQuantity) || 1)));
  const [form, setForm] = useState({
    name: currentUser?.name || '', email: currentUser?.email || '',
    phone: '', organization: '', requirements: '', terms: false,
  });
  const [errors, setErrors] = useState({});
  const [paying, setPaying] = useState(false);
  const [seats, setSeats] = useState(() => simulateExistingBookings(generateSeatLayout(DEFAULT_SEAT_CONFIG), 35));
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [heldUntil, setHeldUntil] = useState(null);
  const [sectionFilter, setSectionFilter] = useState('all');
  const [assigning, setAssigning] = useState(false);
  const [seatToast, setSeatToast] = useState('');

  const steps = requiresSeatSelection
    ? [
      { number: 1, label: 'Ticket' },
      { number: 2, label: 'Seats' },
      { number: 3, label: 'Details' },
      { number: 4, label: 'Review' },
    ]
    : [
      { number: 1, label: 'Ticket' },
      { number: 2, label: 'Details' },
      { number: 3, label: 'Review' },
    ];

  const totalSteps = steps.length;
  const seatStepNumber = requiresSeatSelection ? 2 : null;
  const detailsStepNumber = requiresSeatSelection ? 3 : 2;
  const reviewStepNumber = requiresSeatSelection ? 4 : 3;

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Event not found</h2>
          <Button onClick={() => navigate('/events')}>Browse Events</Button>
        </div>
      </div>
    );
  }

  const selectedTicket = ticketOptions[selectedTicketIdx] || ticketOptions[0];
  const preferredSection = typeToSection[selectedTicket.type] || 'Regular';
  const ticketPrice = selectedTicket.type === 'Student'
    ? Math.max(0, Math.round(event.price * (selectedTicket.studentMultiplier || 0.3)))
    : Math.max(0, event.price + (selectedTicket.priceAdd || 0));
  const subtotal = ticketPrice * quantity;
  const taxAmount = Math.round(subtotal * 0.18);
  const total = subtotal + taxAmount;

  const selectedSeats = useMemo(() => selectedSeatIds
    .map((seatId) => seats.find((seat) => seat.id === seatId))
    .filter(Boolean), [selectedSeatIds, seats]);

  const selectedSeatLabels = selectedSeats.map((seat) => seat.seatId || seat.id).join(', ');

  const updateForm = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: '' }));
  };

  const validateStep1 = () => true; // ticket selection always valid

  const validateSeatStep = () => {
    if (!requiresSeatSelection) return true;
    if (selectedSeatIds.length !== quantity) {
      setSeatToast(`Select exactly ${quantity} seats to continue.`);
      window.setTimeout(() => setSeatToast(''), 1800);
      return false;
    }
    return true;
  };

  const validateDetailsStep = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter valid email';
    if (!form.phone) e.phone = 'Phone is required';
    if (!form.terms) e.terms = 'You must accept the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      return;
    }

    if (requiresSeatSelection && currentStep === 2 && validateSeatStep()) {
      setCurrentStep(3);
      return;
    }

    if (currentStep === detailsStepNumber && validateDetailsStep()) {
      setCurrentStep(reviewStepNumber);
    }
  };

  const showSeatToast = (message) => {
    setSeatToast(message);
    window.setTimeout(() => setSeatToast(''), 1800);
  };

  const handleSeatClick = (seat) => {
    setSelectedSeatIds((prev) => {
      if (prev.includes(seat.id)) {
        return prev.filter((item) => item !== seat.id);
      }
      if (prev.length >= quantity) {
        showSeatToast(`You can only select ${quantity} seat${quantity > 1 ? 's' : ''}.`);
        return prev;
      }
      return [...prev, seat.id];
    });
  };

  const handleAutoAssignSeats = async () => {
    setAssigning(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const picks = allocateSeats(seats, quantity, preferredSection);
    setAssigning(false);

    if (!picks || picks.length !== quantity) {
      showSeatToast('Could not find ideal seats. Try another section.');
      return;
    }

    setSelectedSeatIds(picks.map((seat) => seat.id));
    setSeats(holdSeats(seats, picks, currentUser?.id || 'demo-user'));
    setHeldUntil(Date.now() + 5 * 60 * 1000);
    showSeatToast(`Found ${picks.length} seats in Row ${picks[0].row} - your group stays together!`);
  };

  const holdCurrentSelection = () => {
    if (selectedSeatIds.length !== quantity) return;
    const selected = seats.filter((seat) => selectedSeatIds.includes(seat.id));
    setSeats(holdSeats(seats, selected, currentUser?.id || 'demo-user'));
    setHeldUntil(Date.now() + 5 * 60 * 1000);
  };

  const handleSeatExpire = () => {
    setSeats((prev) => releaseExpiredHolds(prev));
    setSelectedSeatIds([]);
    setHeldUntil(null);
    showSeatToast('Seat hold expired. Please reselect seats.');
  };

  const resetSeatSelection = () => {
    setSelectedSeatIds([]);
    setHeldUntil(null);
    setSeats((prev) => releaseExpiredHolds(prev));
  };

  const handlePay = async () => {
    if (total === 0) {
      let backendTicket = null;

      try {
        backendTicket = await createBackendTicket({
          eventId: event.id,
          attendeeName: form.name,
          attendeeEmail: form.email,
          ticketType: selectedTicket.type,
        });
      } catch (e) {
        console.error('Failed to create backend ticket', e);
      }

      const qrCode = backendTicket?.qrCode || '';
      const bookingId = qrCode
        ? (qrCode.slice(-8).toUpperCase())
        : generateBookingId();
      const bookingState = {
        bookingId,
        qrCode,
        event,
        attendee: { name: form.name, email: form.email, phone: form.phone },
        ticketType: selectedTicket.type,
        venueType,
        requiresSeatSelection,
        selectedSeats: requiresSeatSelection ? selectedSeats.map((seat) => seat.seatId || seat.id) : [],
        selectedSection: requiresSeatSelection ? (selectedSeats[0]?.section || preferredSection) : 'Open Seating',
        quantity,
        total,
      };

      try {
        localStorage.setItem('lastBooking', JSON.stringify(bookingState));
      } catch (e) {
        // ignore storage errors
      }

      navigate('/ticket-confirmation', { state: bookingState });
      return;
    }

    try {
      setPaying(true);

      // Create order on backend (amount in paise)
      const order = await paymentService.createOrder({
        amount: total * 100,
        currency: 'INR',
        receipt: generateBookingId(),
        notes: {
          eventId: event.id,
          userEmail: form.email,
        },
      });

      const keyId = order.key || import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!keyId) {
        throw new Error('Razorpay key is not configured');
      }

      // Load Razorpay script if not already loaded
      if (typeof window.Razorpay === 'undefined') {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
          document.body.appendChild(script);
        });
      }

      const bookingId = order.receipt || generateBookingId();

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: event.title,
        description: `${selectedTicket.type} x ${quantity}`,
        order_id: order.orderId,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          eventId: event.id,
          bookingId,
        },
        theme: {
          color: '#E8441A',
        },
        handler: async (response) => {
          try {
            let backendTicket = null;

            try {
              backendTicket = await createBackendTicket({
                eventId: event.id,
                attendeeName: form.name,
                attendeeEmail: form.email,
                ticketType: selectedTicket.type,
              });
            } catch (e) {
              console.error('Failed to create backend ticket', e);
            }

            const qrCode = backendTicket?.qrCode || '';

            await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            const bookingState = {
              bookingId: qrCode
                ? (qrCode.slice(-8).toUpperCase())
                : bookingId,
              qrCode,
              event,
              attendee: { name: form.name, email: form.email, phone: form.phone },
              ticketType: selectedTicket.type,
              venueType,
              requiresSeatSelection,
              selectedSeats: requiresSeatSelection ? selectedSeats.map((seat) => seat.seatId || seat.id) : [],
              selectedSection: requiresSeatSelection ? (selectedSeats[0]?.section || preferredSection) : 'Open Seating',
              quantity,
              total,
              payment: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
              },
            };

            try {
              localStorage.setItem('lastBooking', JSON.stringify(bookingState));
            } catch (e) {
              // ignore storage errors
            }

            navigate('/ticket-confirmation', { state: bookingState });
          } catch (err) {
            console.error('Payment verification failed', err);
            alert('Payment verification failed. Please contact support with your payment ID.');
          }
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error', err);
      alert(err.message || 'Payment failed. Please try again.');
      setPaying(false);
    }
  };

  useEffect(() => {
    if (requiresSeatSelection && location.state?.selectedSeats?.length) {
      setSelectedSeatIds(location.state.selectedSeats);
      setHeldUntil(Date.now() + 5 * 60 * 1000);
    }
  }, [location.state, requiresSeatSelection]);

  const canProceedFromSeatStep = selectedSeatIds.length === quantity;
  const isLastStep = currentStep === totalSteps;

  const renderTicketStep = () => (
    <div className="space-y-4">
      {requiresSeatSelection ? (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3">
          <Building2 size={16} className="text-blue-600 flex-shrink-0" />
          <p className="text-blue-700 text-sm">
            <span className="font-semibold">Indoor Event</span> — You will select your seats in the next step.
          </p>
        </div>
      ) : (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3">
          <MapPin size={16} className="text-green-600 flex-shrink-0" />
          <p className="text-green-700 text-sm">
            <span className="font-semibold">Outdoor Event</span> — Open seating, no seat selection required.
          </p>
        </div>
      )}

      {ticketOptions.map((t, i) => {
        const price = t.type === 'Student'
          ? Math.max(0, Math.round(event.price * (t.studentMultiplier || 0.3)))
          : Math.max(0, event.price + (t.priceAdd || 0));
        return (
          <button
            key={i}
            type="button"
            onClick={() => setSelectedTicketIdx(i)}
            className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
              selectedTicketIdx === i
                ? 'border-[#E8441A] bg-[#E8441A]/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-[#1A1A2E]">{t.type}</p>
                <p className="text-xs text-gray-400">{t.perks[0]}</p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${selectedTicketIdx === i ? 'text-[#E8441A]' : 'text-[#1A1A2E]'}`}>
                  {formatPrice(price)}
                </p>
                <p className="text-xs text-gray-400">per ticket</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {t.perks.map((p) => (
                <span key={p} className="text-xs px-2 py-0.5 bg-white border border-gray-200 rounded-full text-gray-600">✓ {p}</span>
              ))}
            </div>
          </button>
        );
      })}

      <div className="pt-4">
        <p className="text-sm font-semibold text-[#1A1A2E] mb-3">Quantity</p>
        <div className="flex items-center gap-4">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center text-xl hover:border-[#E8441A] hover:text-[#E8441A] transition-colors">
            −
          </button>
          <span className="text-2xl font-bold w-8 text-center">{quantity}</span>
          <button onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center text-xl hover:border-[#E8441A] hover:text-[#E8441A] transition-colors">
            +
          </button>
        </div>
      </div>

      <div className="p-4 bg-[#E8441A]/5 rounded-xl">
        <div className="flex justify-between font-bold text-[#1A1A2E]">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </div>
    </div>
  );

  const renderSeatStep = () => (
    <div>
      {incomingTicketType && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3">
          <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
          <p className="text-green-700 text-sm">
            <span className="font-semibold">
              {incomingQuantity}x {incomingTicketType?.name || incomingTicketType} ticket
            </span>{' '}
            pre-selected from event page. You can change it below.
          </p>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {['all', 'VIP', 'Premium', 'Regular'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSectionFilter(tab)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${sectionFilter === tab ? 'bg-[#E8441A] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <SeatMap
        seats={seats}
        selectedSeats={selectedSeatIds}
        onSeatClick={handleSeatClick}
        maxSelectable={quantity}
        preferredSection={preferredSection}
        sectionFilter={sectionFilter}
        onAutoAssign={(picked) => {
          setSelectedSeatIds(picked.map((seat) => seat.id));
          setSeats(holdSeats(seats, picked, currentUser?.id || 'demo-user'));
          setHeldUntil(Date.now() + 5 * 60 * 1000);
          showSeatToast('Best seats found! 🎉');
        }}
      />
      <SeatLegend />
      <SeatTimer heldUntil={heldUntil} onExpire={handleSeatExpire} />

      <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm">
        <p className="font-semibold text-[#1A1A2E]">Selected seats: {selectedSeatLabels || 'None yet'}</p>
        <p className="mt-1 text-gray-500">Need {quantity} seat{quantity > 1 ? 's' : ''}. Preferred section: {preferredSection}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleAutoAssignSeats}
          disabled={assigning}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E8441A] px-4 py-2 text-sm font-semibold text-[#E8441A] hover:bg-[#E8441A] hover:text-white disabled:opacity-60"
        >
          <Sparkles className={`h-4 w-4 ${assigning ? 'animate-spin' : ''}`} />
          {assigning ? 'Finding best seats...' : 'Smart Assign'}
        </button>
        <button
          type="button"
          onClick={holdCurrentSelection}
          disabled={selectedSeatIds.length !== quantity}
          className="rounded-xl bg-[#1A1A2E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d2d4e] disabled:opacity-60"
        >
          Hold Seats
        </button>
        <button
          type="button"
          onClick={resetSeatSelection}
          className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-500 hover:text-[#E8441A]"
        >
          Reset Selection
        </button>
      </div>

      {seatToast && (
        <div className="mt-3 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
          {seatToast}
        </div>
      )}
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input label="Full Name" placeholder="Arjun Sharma" value={form.name}
            onChange={(e) => updateForm('name', e.target.value)}
            error={errors.name} leftIcon={User} required />
        </div>
        <Input label="Email" type="email" placeholder="you@example.com" value={form.email}
          onChange={(e) => updateForm('email', e.target.value)}
          error={errors.email} leftIcon={Mail} required />
        <Input label="Phone" type="tel" placeholder="+91 98765 43210" value={form.phone}
          onChange={(e) => updateForm('phone', e.target.value)}
          error={errors.phone} leftIcon={Phone} required />
        <div className="col-span-2">
          <Input label="Organisation" placeholder="Company / College (optional)" value={form.organization}
            onChange={(e) => updateForm('organization', e.target.value)} leftIcon={Building2} />
        </div>
        <div className="col-span-2">
          <label className="text-sm font-semibold text-[#1A1A2E] mb-1 block">Special Requirements</label>
          <textarea value={form.requirements} onChange={(e) => updateForm('requirements', e.target.value)}
            placeholder="Dietary needs, accessibility requests, etc. (optional)"
            rows={3} className="input-field resize-none" />
        </div>
      </div>
      <label className="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" checked={form.terms} onChange={(e) => updateForm('terms', e.target.checked)}
          className="mt-0.5 rounded border-gray-300 text-[#E8441A] focus:ring-[#E8441A]" />
        <span className="text-sm text-gray-600">
          I agree to the event's Terms & Conditions and Privacy Policy
        </span>
      </label>
      {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-5">
      <div className="bg-gray-50 rounded-xl p-5">
        <h4 className="font-bold text-[#1A1A2E] mb-3">Order Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>{selectedTicket.type} × {quantity}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax (18%)</span>
            <span>{formatPrice(taxAmount)}</span>
          </div>
          {requiresSeatSelection && selectedSeats.length > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Seats</span>
              <span className="font-medium text-[#1A1A2E]">
                {selectedSeats.map((seat) => seat.seatId || seat.id).join(', ')}
              </span>
            </div>
          )}
          {!requiresSeatSelection && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Seating</span>
              <span className="font-medium text-green-600">Open Seating (Outdoor Event)</span>
            </div>
          )}
          {requiresSeatSelection && (
            <div className="flex justify-between text-gray-600">
              <span>Section</span>
              <span>{selectedSeats[0]?.section || preferredSection}</span>
            </div>
          )}
          <div className="h-px bg-gray-200 my-2" />
          <div className="flex justify-between font-bold text-[#1A1A2E] text-base">
            <span>Total</span>
            <span className="text-[#E8441A]">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-5">
        <h4 className="font-bold text-[#1A1A2E] mb-3">Attendee Details</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><p className="text-gray-400 text-xs">Name</p><p className="font-semibold text-[#1A1A2E]">{form.name}</p></div>
          <div><p className="text-gray-400 text-xs">Email</p><p className="font-semibold text-[#1A1A2E]">{form.email}</p></div>
          <div><p className="text-gray-400 text-xs">Phone</p><p className="font-semibold text-[#1A1A2E]">{form.phone}</p></div>
          {form.organization && <div><p className="text-gray-400 text-xs">Organisation</p><p className="font-semibold text-[#1A1A2E]">{form.organization}</p></div>}
        </div>
        {requiresSeatSelection && (
          <div className="mt-3 rounded-xl bg-white p-3">
            <p className="text-xs text-gray-400">Seat Numbers</p>
            <p className="mt-1 flex items-center gap-1 font-semibold text-[#1A1A2E]"><MapPin className="h-4 w-4 text-[#E8441A]" />{selectedSeatLabels || 'Not selected'}</p>
          </div>
        )}
      </div>
      <Button variant="primary" fullWidth loading={paying} onClick={handlePay}>
        {total === 0 ? 'Confirm Registration' : `Confirm & Pay ${formatPrice(total)}`}
      </Button>
      <p className="text-xs text-center text-gray-400">🔒 Payments are processed securely via Razorpay</p>
    </div>
  );

  const getStepContent = (stepNumber) => {
    if (requiresSeatSelection) {
      if (stepNumber === 1) return renderTicketStep();
      if (stepNumber === 2) return renderSeatStep();
      if (stepNumber === 3) return renderDetailsStep();
      if (stepNumber === 4) return renderReviewStep();
      return null;
    }

    if (stepNumber === 1) return renderTicketStep();
    if (stepNumber === 2) return renderDetailsStep();
    if (stepNumber === 3) return renderReviewStep();
    return null;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-[#E8441A] transition-all duration-300"
              style={{ width: `${totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 100}%` }}
            />
          </div>
          <div className="flex items-center justify-center gap-0">
            {steps.map((s, i) => (
              <div key={s.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    currentStep > s.number ? 'bg-green-500 text-white' :
                    currentStep === s.number ? 'bg-[#E8441A] text-white' :
                    'bg-gray-200 text-gray-400'
                  }`}>
                    {currentStep > s.number ? <Check className="w-4 h-4" /> : s.number}
                  </div>
                  <span className={`text-xs mt-1 font-medium hidden sm:block ${currentStep === s.number ? 'text-[#E8441A]' : 'text-gray-400'}`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-16 md:w-24 h-0.5 mx-2 ${currentStep > s.number ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-bold text-[#1A1A2E] mb-6">{steps.find((s) => s.number === currentStep)?.label || 'Registration'}</h2>

              {getStepContent(currentStep)}

              {/* Navigation */}
              {currentStep < totalSteps && (
                <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
                  {currentStep > 1 ? (
                    <Button variant="ghost" leftIcon={ChevronLeft} onClick={() => setCurrentStep((prev) => prev - 1)} disabled={currentStep === 1}>Back</Button>
                  ) : <div />}
                  <Button
                    variant="primary"
                    rightIcon={ChevronRight}
                    onClick={() => {
                      if (currentStep < totalSteps) {
                        handleNext();
                      } else {
                        handlePay();
                      }
                    }}
                    disabled={requiresSeatSelection && currentStep === seatStepNumber && !canProceedFromSeatStep}
                  >
                    {isLastStep ? (total === 0 ? 'Confirm Registration' : `Confirm & Pay ${formatPrice(total)}`) : currentStep === detailsStepNumber ? 'Review Order' : 'Continue'}
                  </Button>
                </div>
              )}

              {requiresSeatSelection && currentStep === seatStepNumber && !canProceedFromSeatStep && (
                <p className="mt-2 text-center text-sm text-amber-600">
                  Please select {quantity - selectedSeatIds.length} more seat(s) to continue
                </p>
              )}
            </Card>
          </div>

          {/* Event Summary Sidebar */}
          <div>
            <Card className="sticky top-20">
              <img src={event.image} alt={event.title} className="w-full h-32 object-cover rounded-xl mb-4" />
              <h3 className="font-bold text-[#1A1A2E] text-sm mb-3">{event.title}</h3>
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-[#E8441A]/10 rounded flex items-center justify-center text-[10px]">📅</span>
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-[#E8441A]/10 rounded flex items-center justify-center text-[10px]">⏰</span>
                  {formatTime(event.time)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-[#E8441A]/10 rounded flex items-center justify-center text-[10px]">📍</span>
                  {event.city}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;