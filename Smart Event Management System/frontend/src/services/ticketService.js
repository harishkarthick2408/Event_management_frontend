import { attendees } from '../utils/constants';
import { generateBookingId } from '../utils/helpers';

let ticketsStore = [...attendees];

export const ticketService = {
  registerForEvent: async ({ eventId, attendeeData, ticketType }) => {
    await new Promise((res) => setTimeout(res, 700));
    const ticket = {
      id: `a${Date.now()}`,
      name: attendeeData.name,
      email: attendeeData.email,
      phone: attendeeData.phone,
      organization: attendeeData.organization || '',
      eventId,
      ticketType,
      registrationDate: new Date().toISOString().split('T')[0],
      checkedIn: false,
      checkedInTime: null,
      bookingId: generateBookingId(),
    };
    ticketsStore = [...ticketsStore, ticket];
    return ticket;
  },

  getMyTickets: async (email) => {
    await new Promise((res) => setTimeout(res, 300));
    return ticketsStore.filter((t) => t.email === email);
  },

  getTicketById: async (bookingId) => {
    await new Promise((res) => setTimeout(res, 200));
    const ticket = ticketsStore.find((t) => t.bookingId === bookingId);
    if (!ticket) throw new Error('Ticket not found');
    return ticket;
  },

  getTicketsByEvent: async (eventId) => {
    await new Promise((res) => setTimeout(res, 300));
    return ticketsStore.filter((t) => t.eventId === eventId);
  },

  checkInAttendee: async (bookingId) => {
    await new Promise((res) => setTimeout(res, 400));
    const ticket = ticketsStore.find((t) => t.bookingId === bookingId);
    if (!ticket) throw new Error('Ticket not found');
    if (ticket.checkedIn) throw new Error('Already checked in');

    ticketsStore = ticketsStore.map((t) =>
      t.bookingId === bookingId
        ? {
            ...t,
            checkedIn: true,
            checkedInTime: new Date().toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }
        : t
    );
    return ticketsStore.find((t) => t.bookingId === bookingId);
  },

  toggleCheckIn: async (attendeeId) => {
    await new Promise((res) => setTimeout(res, 300));
    ticketsStore = ticketsStore.map((t) =>
      t.id === attendeeId
        ? {
            ...t,
            checkedIn: !t.checkedIn,
            checkedInTime: !t.checkedIn
              ? new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
              : null,
          }
        : t
    );
    return ticketsStore.find((t) => t.id === attendeeId);
  },
};

export default ticketService;
