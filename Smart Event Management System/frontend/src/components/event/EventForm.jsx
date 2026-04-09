import { useState } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { categories } from '../../utils/constants';

const defaultTicketType = { type: 'General', price: 0, quantity: 100, description: '' };

const EventForm = ({ initialData = {}, onSubmit, onSaveDraft, loading = false }) => {
  const [form, setForm] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || 'Tech',
    date: initialData.date || '',
    time: initialData.time || '',
    endDate: initialData.endDate || '',
    endTime: initialData.endTime || '',
    location: initialData.location || '',
    city: initialData.city || '',
    capacity: initialData.capacity || 200,
    bannerUrl: initialData.image || '',
    tags: initialData.tags?.join(', ') || '',
    ticketTypes: initialData.ticketTypes || [{ ...defaultTicketType }],
  });
  const [errors, setErrors] = useState({});

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const addTicketType = () => {
    setForm((prev) => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, { ...defaultTicketType }],
    }));
  };

  const removeTicketType = (idx) => {
    setForm((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== idx),
    }));
  };

  const updateTicketType = (idx, key, value) => {
    setForm((prev) => {
      const updated = [...prev.ticketTypes];
      updated[idx] = { ...updated[idx], [key]: value };
      return { ...prev, ticketTypes: updated };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Event title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.time) newErrors.time = 'Time is required';
    if (!form.location.trim()) newErrors.location = 'Location is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.capacity || form.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e, isDraft = false) => {
    e.preventDefault();
    if (!validate() && !isDraft) return;
    const eventData = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    if (isDraft) onSaveDraft?.(eventData);
    else onSubmit?.(eventData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <section>
        <h3 className="text-lg font-bold text-[#1A1A2E] mb-4 pb-2 border-b border-gray-100">Basic Information</h3>
        <div className="space-y-4">
          <Input label="Event Title" placeholder="Enter event title" value={form.title}
            onChange={(e) => updateField('title', e.target.value)} error={errors.title} required />
          <div>
            <label className="text-sm font-semibold text-[#1A1A2E] mb-1 block">Description <span className="text-[#E8441A]">*</span></label>
            <textarea
              placeholder="Describe your event in detail..."
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
              className={`input-field resize-none ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-[#1A1A2E] mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="input-field"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-[#1A1A2E] mb-1 block">Total Capacity</label>
              <Input type="number" placeholder="200" value={form.capacity}
                onChange={(e) => updateField('capacity', parseInt(e.target.value))} error={errors.capacity} />
            </div>
          </div>
          <Input label="Tags" placeholder="AI, Machine Learning, Cloud (comma separated)"
            value={form.tags} onChange={(e) => updateField('tags', e.target.value)}
            leftIcon={Tag} hint="Separate tags with commas" />
        </div>
      </section>

      {/* Date & Time */}
      <section>
        <h3 className="text-lg font-bold text-[#1A1A2E] mb-4 pb-2 border-b border-gray-100">Date & Time</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Start Date" type="date" value={form.date}
            onChange={(e) => updateField('date', e.target.value)} error={errors.date} required />
          <Input label="Start Time" type="time" value={form.time}
            onChange={(e) => updateField('time', e.target.value)} error={errors.time} required />
          <Input label="End Date" type="date" value={form.endDate}
            onChange={(e) => updateField('endDate', e.target.value)} />
          <Input label="End Time" type="time" value={form.endTime}
            onChange={(e) => updateField('endTime', e.target.value)} />
        </div>
      </section>

      {/* Location */}
      <section>
        <h3 className="text-lg font-bold text-[#1A1A2E] mb-4 pb-2 border-b border-gray-100">Location</h3>
        <div className="space-y-4">
          <Input label="Venue / Address" placeholder="Enter venue name and address"
            value={form.location} onChange={(e) => updateField('location', e.target.value)}
            error={errors.location} required />
          <Input label="City" placeholder="Bangalore" value={form.city}
            onChange={(e) => updateField('city', e.target.value)} error={errors.city} required />
        </div>
      </section>

      {/* Media */}
      <section>
        <h3 className="text-lg font-bold text-[#1A1A2E] mb-4 pb-2 border-b border-gray-100">Media</h3>
        <Input label="Banner Image URL" placeholder="https://example.com/banner.jpg"
          value={form.bannerUrl} onChange={(e) => updateField('bannerUrl', e.target.value)} />
        {form.bannerUrl && (
          <div className="mt-3 rounded-xl overflow-hidden h-40 border border-gray-200">
            <img src={form.bannerUrl} alt="Banner preview" className="w-full h-full object-cover" />
          </div>
        )}
      </section>

      {/* Ticket Types */}
      <section>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#1A1A2E]">Ticket Types</h3>
          <Button type="button" variant="outline" size="sm" leftIcon={Plus} onClick={addTicketType}>
            Add Ticket
          </Button>
        </div>
        <div className="space-y-4">
          {form.ticketTypes.map((ticket, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <Input label="Ticket Type" placeholder="General / VIP / Student"
                    value={ticket.type} onChange={(e) => updateTicketType(idx, 'type', e.target.value)} />
                  <Input label="Price (₹)" type="number" placeholder="0 for Free"
                    value={ticket.price} onChange={(e) => updateTicketType(idx, 'price', parseFloat(e.target.value))} />
                  <Input label="Quantity" type="number" placeholder="100"
                    value={ticket.quantity} onChange={(e) => updateTicketType(idx, 'quantity', parseInt(e.target.value))} />
                  <Input label="Description" placeholder="Benefits included..."
                    value={ticket.description} onChange={(e) => updateTicketType(idx, 'description', e.target.value)} />
                </div>
                {form.ticketTypes.length > 1 && (
                  <button type="button" onClick={() => removeTicketType(idx)}
                    className="mt-6 p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="outline" onClick={(e) => handleSubmit(e, true)} loading={loading}>
          Save as Draft
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          Publish Event
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
