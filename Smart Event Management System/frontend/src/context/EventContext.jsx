import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { eventService } from '../services/eventService';

const EventContext = createContext(null);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    date: '',
    location: '',
    sortBy: 'date',
  });

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await eventService.getEvents();
        setEvents(data);
      } catch (err) {
        console.error('Failed to load events', err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Computed filtered events
  const filteredEvents = useMemo(() => {
    let result = [...events];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.organizer.toLowerCase().includes(q)
      );
    }

    if (filters.category) {
      result = result.filter((e) => e.category === filters.category);
    }

    if (filters.date) {
      result = result.filter((e) => e.date === filters.date);
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      result = result.filter(
        (e) =>
          e.city.toLowerCase().includes(loc) ||
          e.location.toLowerCase().includes(loc)
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'date':
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => b.ticketsSold - a.ticketsSold);
        break;
      default:
        break;
    }

    return result;
  }, [events, filters]);

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', date: '', location: '', sortBy: 'date' });
  };

  const getEventById = (id) => events.find((e) => e.id === id) || null;

  const addEvent = async (eventData) => {
    const created = await eventService.createEvent(eventData);
    setEvents((prev) => [created, ...prev]);
    return created;
  };

  const updateEvent = async (id, updates) => {
    const updated = await eventService.updateEvent(id, updates);
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  };

  const deleteEvent = async (id) => {
    await eventService.deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        filteredEvents,
        filters,
        selectedEvent,
        setSelectedEvent,
        setFilter,
        clearFilters,
        getEventById,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error('useEventContext must be used within EventProvider');
  return ctx;
};

export default EventContext;
