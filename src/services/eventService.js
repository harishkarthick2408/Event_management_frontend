import { events } from '../utils/constants';

let eventsStore = [...events];

export const eventService = {
  getEvents: async (filters = {}) => {
    await new Promise((res) => setTimeout(res, 300));
    let result = [...eventsStore];
    if (filters.category) result = result.filter((e) => e.category === filters.category);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (e) => e.title.toLowerCase().includes(q) || e.city.toLowerCase().includes(q)
      );
    }
    return result;
  },

  getEventById: async (id) => {
    await new Promise((res) => setTimeout(res, 200));
    const event = eventsStore.find((e) => e.id === id);
    if (!event) throw new Error('Event not found');
    return event;
  },

  createEvent: async (eventData) => {
    await new Promise((res) => setTimeout(res, 500));
    const newEvent = {
      ...eventData,
      id: `e${Date.now()}`,
      ticketsSold: 0,
      status: eventData.status || 'draft',
    };
    eventsStore = [newEvent, ...eventsStore];
    return newEvent;
  },

  updateEvent: async (id, updates) => {
    await new Promise((res) => setTimeout(res, 400));
    eventsStore = eventsStore.map((e) => (e.id === id ? { ...e, ...updates } : e));
    return eventsStore.find((e) => e.id === id);
  },

  deleteEvent: async (id) => {
    await new Promise((res) => setTimeout(res, 300));
    eventsStore = eventsStore.filter((e) => e.id !== id);
    return { success: true };
  },
};

export default eventService;
