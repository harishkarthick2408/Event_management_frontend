import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, ChevronRight, ChevronLeft, User, Mail, Phone, Building2 } from 'lucide-react';
import { useEventContext } from '../../context/EventContext';
import { useAuth } from '../../hooks/useAuth';
import { formatDate, formatTime, formatPrice, generateBookingId } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const ticketOptions = [
  { type: 'General', priceAdd: 0, perks: ['All main sessions', 'Networking lunch', 'Digital certificate'] },
  { type: 'VIP', priceAdd: 1499, perks: ['All General benefits', 'VIP lounge', 'Meet speakers', 'Recorded sessions', 'Executive dinner'] },
  { type: 'Student', priceAdd: -500, perks: ['All main sessions', 'Networking lunch', 'Digital certificate', 'Student workshops'] },
];

const Steps = ['Select Ticket', 'Your Details', 'Review & Pay'];

const Registration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById } = useEventContext();
  const { currentUser } = useAuth();
  const event = getEventById(id);

  const [step, setStep] = useState(0);
  const [selectedTicketIdx, setSelectedTicketIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({
    name: currentUser?.name || '', email: currentUser?.email || '',
    phone: '', organization: '', requirements: '', terms: false,
  });
  const [errors, setErrors] = useState({});
  const [paying, setPaying] = useState(false);

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

  const selectedTicket = ticketOptions[selectedTicketIdx];
  const ticketPrice = Math.max(0, event.price + selectedTicket.priceAdd);
  const subtotal = ticketPrice * quantity;
  const taxAmount = Math.round(subtotal * 0.18);
  const total = subtotal + taxAmount;

  const updateForm = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: '' }));
  };

  const validateStep1 = () => true; // ticket selection always valid

  const validateStep2 = () => {
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
    if (step === 0 && validateStep1()) setStep(1);
    if (step === 1 && validateStep2()) setStep(2);
  };

  const handlePay = async () => {
    setPaying(true);
    await new Promise((res) => setTimeout(res, 1500)); // mock payment
    const bookingId = generateBookingId();
    navigate('/ticket-confirmation', {
      state: {
        bookingId,
        event,
        attendee: { name: form.name, email: form.email, phone: form.phone },
        ticketType: selectedTicket.type,
        quantity,
        total,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-0">
            {Steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    i < step ? 'bg-green-500 text-white' :
                    i === step ? 'bg-[#E8441A] text-white' :
                    'bg-gray-200 text-gray-400'
                  }`}>
                    {i < step ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-xs mt-1 font-medium hidden sm:block ${i === step ? 'text-[#E8441A]' : 'text-gray-400'}`}>{s}</span>
                </div>
                {i < Steps.length - 1 && (
                  <div className={`w-16 md:w-24 h-0.5 mx-2 ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-bold text-[#1A1A2E] mb-6">{Steps[step]}</h2>

              {/* STEP 0: Select Ticket */}
              {step === 0 && (
                <div className="space-y-4">
                  {ticketOptions.map((t, i) => {
                    const price = Math.max(0, event.price + t.priceAdd);
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

                  {/* Quantity */}
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

                  {/* Subtotal */}
                  <div className="p-4 bg-[#E8441A]/5 rounded-xl">
                    <div className="flex justify-between font-bold text-[#1A1A2E]">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 1: Attendee Details */}
              {step === 1 && (
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
              )}

              {/* STEP 2: Review & Pay */}
              {step === 2 && (
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
                  </div>
                  <Button variant="primary" fullWidth loading={paying} onClick={handlePay}>
                    {total === 0 ? 'Confirm Registration' : `Confirm & Pay ${formatPrice(total)}`}
                  </Button>
                  <p className="text-xs text-center text-gray-400">🔒 This is a demo — no real payment will be made</p>
                </div>
              )}

              {/* Navigation */}
              {step < 2 && (
                <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
                  {step > 0 ? (
                    <Button variant="ghost" leftIcon={ChevronLeft} onClick={() => setStep((s) => s - 1)}>Back</Button>
                  ) : <div />}
                  <Button variant="primary" rightIcon={ChevronRight} onClick={handleNext}>
                    {step === 1 ? 'Review Order' : 'Continue'}
                  </Button>
                </div>
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
