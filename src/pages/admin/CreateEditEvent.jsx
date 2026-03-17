import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Tag, ArrowLeft } from 'lucide-react';
import { events } from '../../utils/constants';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { categories } from '../../utils/constants';

const defaultTicket = { type: 'General', price: 0, quantity: 100, description: '' };

const CreateEditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const existingEvent = isEdit ? events.find((e) => e.id === id) : null;

  const [form, setForm] = useState({
    title: existingEvent?.title || '',
    description: existingEvent?.description || '',
    category: existingEvent?.category || 'Tech',
    tags: existingEvent?.tags?.join(', ') || '',
    date: existingEvent?.date || '',
    time: existingEvent?.time || '',
    endDate: existingEvent?.endDate || '',
    endTime: existingEvent?.endTime || '',
    location: existingEvent?.location || '',
    city: existingEvent?.city || '',
    bannerUrl: existingEvent?.image || '',
    capacity: existingEvent?.capacity || 200,
    visibility: 'public',
    status: existingEvent?.status || 'draft',
    ticketTypes: [{ ...defaultTicket }],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: '' }));
  };

  const addTicket = () => setForm((p) => ({ ...p, ticketTypes: [...p.ticketTypes, { ...defaultTicket }] }));
  const removeTicket = (i) => setForm((p) => ({ ...p, ticketTypes: p.ticketTypes.filter((_, idx) => idx !== i) }));
  const updateTicket = (i, k, v) => setForm((p) => {
    const t = [...p.ticketTypes];
    t[i] = { ...t[i], [k]: v };
    return { ...p, ticketTypes: t };
  });

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Event title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.date) e.date = 'Date is required';
    if (!form.time) e.time = 'Start time is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.city.trim()) e.city = 'City is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (status) => {
    if (!validate() && status === 'published') return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    navigate('/admin/events');
  };

  // Live preview data
  const preview = {
    title: form.title || 'Event Title',
    date: form.date || '2025-01-01',
    time: form.time || '09:00',
    city: form.city || 'City',
    category: form.category,
    image: form.bannerUrl || 'https://picsum.photos/seed/preview/400/250',
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">{isEdit ? 'Edit Event' : 'Create New Event'}</h2>
          <p className="text-sm text-gray-400">Fill in the details to {isEdit ? 'update' : 'publish'} your event</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-[#1A1A2E] mb-4 pb-2 border-b border-gray-100">Basic Information</h3>
            <div className="space-y-4">
              <Input label="Event Title" placeholder="e.g. Tech Summit 2025" value={form.title}
                onChange={(e) => set('title', e.target.value)} error={errors.title} required />
              <div>
                <label className="text-sm font-semibold text-[#1A1A2E] mb-1 block">Description <span className="text-[#E8441A]">*</span></label>
                <textarea placeholder="Describe the event..." value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  rows={4} className={`input-field resize-none ${errors.description ? 'border-red-500' : ''}`} />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-[#1A1A2E] mb-1 block">Category</label>
                  <select value={form.category} onChange={(e) => set('category', e.target.value)} className="input-field">
                    {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1A1A2E] mb-1 block">Visibility</label>
                  <select value={form.visibility} onChange={(e) => set('visibility', e.target.value)} className="input-field">
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>
              <Input label="Tags" placeholder="AI, Cloud, Networking (comma separated)"
                value={form.tags} onChange={(e) => set('tags', e.target.value)} leftIcon={Tag}
                hint="Separate with commas" />
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-[#1A1A2E] mb-4 pb-2 border-b border-gray-100">Date & Time</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Start Date" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} error={errors.date} required />
              <Input label="Start Time" type="time" value={form.time} onChange={(e) => set('time', e.target.value)} error={errors.time} required />
              <Input label="End Date" type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} />
              <Input label="End Time" type="time" value={form.endTime} onChange={(e) => set('endTime', e.target.value)} />
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-[#1A1A2E] mb-4 pb-2 border-b border-gray-100">Location</h3>
            <div className="space-y-4">
              <Input label="Venue / Address" placeholder="Venue name and full address"
                value={form.location} onChange={(e) => set('location', e.target.value)} error={errors.location} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" placeholder="Bangalore" value={form.city} onChange={(e) => set('city', e.target.value)} error={errors.city} required />
                <Input label="Total Capacity" type="number" value={form.capacity} onChange={(e) => set('capacity', parseInt(e.target.value))} />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-[#1A1A2E] mb-4 pb-2 border-b border-gray-100">Media</h3>
            <Input label="Banner Image URL" placeholder="https://example.com/banner.jpg"
              value={form.bannerUrl} onChange={(e) => set('bannerUrl', e.target.value)} />
            {form.bannerUrl && (
              <div className="mt-3 rounded-xl overflow-hidden h-40 border border-gray-200">
                <img src={form.bannerUrl} alt="Banner" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://picsum.photos/seed/default/800/400'; }} />
              </div>
            )}
          </div>

          {/* Ticket Types */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="font-bold text-[#1A1A2E]">Ticket Types</h3>
              <Button type="button" variant="outline" size="sm" leftIcon={Plus} onClick={addTicket}>Add Type</Button>
            </div>
            <div className="space-y-4">
              {form.ticketTypes.map((t, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex gap-3 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <Input label="Ticket Name" placeholder="General / VIP / Student"
                        value={t.type} onChange={(e) => updateTicket(i, 'type', e.target.value)} />
                      <Input label="Price (₹)" type="number" placeholder="0 = Free"
                        value={t.price} onChange={(e) => updateTicket(i, 'price', parseFloat(e.target.value) || 0)} />
                      <Input label="Quantity" type="number" placeholder="100"
                        value={t.quantity} onChange={(e) => updateTicket(i, 'quantity', parseInt(e.target.value) || 0)} />
                      <Input label="Description" placeholder="Benefits..."
                        value={t.description} onChange={(e) => updateTicket(i, 'description', e.target.value)} />
                    </div>
                    {form.ticketTypes.length > 1 && (
                      <button onClick={() => removeTicket(i)} className="mt-6 p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" loading={loading} onClick={() => handleSave('draft')}>Save as Draft</Button>
            <Button variant="primary" loading={loading} onClick={() => handleSave('published')}>Publish Event</Button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-[#1A1A2E] text-sm">Live Preview</h3>
              </div>
              <div>
                <img src={preview.image} alt="Preview" className="w-full h-40 object-cover"
                  onError={(e) => { e.target.src = 'https://picsum.photos/seed/default/400/200'; }} />
                <div className="p-4">
                  <span className="text-xs bg-[#E8441A]/10 text-[#E8441A] font-semibold px-2 py-0.5 rounded-full">{preview.category}</span>
                  <h4 className="font-bold text-[#1A1A2E] mt-2 mb-2 line-clamp-2">{preview.title}</h4>
                  {form.description && (
                    <p className="text-xs text-gray-400 line-clamp-2 mb-3">{form.description}</p>
                  )}
                  <div className="space-y-1.5 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">📅 {preview.date}</div>
                    <div className="flex items-center gap-1.5">📍 {preview.city}</div>
                    <div className="flex items-center gap-1.5">🎫 {form.capacity} capacity</div>
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

export default CreateEditEvent;
