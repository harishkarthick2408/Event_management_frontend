import { createContext, useContext, useState, useMemo } from 'react';
import { events as eventsData } from '../utils/constants';

const EventContext = createContext(null);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(eventsData);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    date: '',
    location: '',
    sortBy: 'date',
  });

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

  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: `e${Date.now()}`,
      ticketsSold: 0,
      status: 'draft',
    };
    setEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  };

  const updateEvent = (id, updates) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <EventContext.Provider
      value={{
        events,
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
