const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const mapApiEventToUi = (e) => {
  const start = e.startTime ? new Date(e.startTime) : null;
  const end = e.endTime ? new Date(e.endTime) : null;

  return {
    id: e._id,
    title: e.name,
    description: e.description || '',
    category: e.category || 'General',
    date: start ? start.toISOString().slice(0, 10) : '',
    time: start ? start.toISOString().slice(11, 16) : '',
    endDate: end ? end.toISOString().slice(0, 10) : '',
    endTime: end ? end.toISOString().slice(11, 16) : '',
    location: e.location || '',
    city: e.city || '',
    image: e.image ,
    capacity: e.capacity || 0,
    price: e.price || 0,
    ticketsSold: e.ticketsSold || 0,
    status: e.status || 'draft',
    tags: e.tags || [],
    venueType: e.venueType || 'outdoor',
    requiresSeatSelection: e.venueType === 'indoor',
  };
};

const authHeaders = () => {
  const token = localStorage.getItem('eventpro_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const eventService = {
  getEvents: async () => {
    const res = await fetch(`${API_BASE_URL}/api/events`);
    const data = await res.json().catch(() => []);
    if (!res.ok) {
      throw new Error(data.message || 'Failed to load events');
    }
    return data.map(mapApiEventToUi);
  },

  getEventById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/events/${id}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Failed to load event');
    }
    return mapApiEventToUi(data);
  },

  createEvent: async (eventData) => {
    const res = await fetch(`${API_BASE_URL}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(eventData),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Failed to create event');
    }
    return mapApiEventToUi(data);
  },

  updateEvent: async (id, updates) => {
    const res = await fetch(`${API_BASE_URL}/api/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update event');
    }
    return mapApiEventToUi(data);
  },

  deleteEvent: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/events/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete event');
    }
    return data;
  },
};

export default eventService;
