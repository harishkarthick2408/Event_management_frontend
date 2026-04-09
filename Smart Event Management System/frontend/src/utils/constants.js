// ─── EVENTS MOCK DATA ───────────────────────────────────────────────────────

export const events = [
  {
    id: '1',
    title: 'Tech Summit 2025: Future of AI',
    venueType: 'indoor',
    description:
      'Join us for the most anticipated technology conference of the year. Explore the bleeding edge of artificial intelligence, machine learning, and their transformative impact on industries. Connect with 500+ tech leaders, innovators, and pioneers who are shaping tomorrow. Sessions cover GenAI, LLMs, robotics, autonomous systems, and ethical AI governance.',
    category: 'Tech',
    date: '2025-04-15',
    time: '09:00',
    endDate: '2025-04-16',
    endTime: '18:00',
    location: 'Bangalore International Exhibition Centre, Tumkur Rd',
    city: 'Bangalore',
    image: 'https://picsum.photos/seed/tech2025/800/450',
    organizer: 'Zoho Corp',
    organizerAvatar: 'https://picsum.photos/seed/zoho/100/100',
    price: 1499,
    capacity: 500,
    ticketsSold: 423,
    status: 'published',
    tags: ['AI', 'Machine Learning', 'Innovation', 'Technology', 'GenAI'],
    language: 'English',
    speakers: [
      {
        id: 's1',
        name: 'Dr. Ananya Krishnan',
        role: 'Chief AI Scientist, Google DeepMind India',
        photo: 'https://picsum.photos/seed/speaker1/150/150',
        bio: 'Dr. Krishnan leads foundational AI research with 20+ published papers in top-tier conferences. She specializes in multi-modal learning and responsible AI systems.',
      },
      {
        id: 's2',
        name: 'Vikram Mehta',
        role: 'CTO, Zepto AI',
        photo: 'https://picsum.photos/seed/speaker2/150/150',
        bio: 'Vikram has built AI infrastructure at scale serving 50M+ users. He is a keynote speaker at NeurIPS and ICML with deep expertise in production ML systems.',
      },
      {
        id: 's3',
        name: 'Priya Nair',
        role: 'VP Engineering, Infosys AI Lab',
        photo: 'https://picsum.photos/seed/speaker3/150/150',
        bio: 'Priya leads a 300-person engineering team building enterprise AI solutions. She is a champion for diversity in STEM and mentors 100+ women engineers annually.',
      },
    ],
    schedule: [
      { time: '09:00', title: 'Registration & Networking Breakfast', speaker: '' },
      { time: '10:00', title: 'Keynote: The Next Decade of AI', speaker: 'Dr. Ananya Krishnan' },
      { time: '11:30', title: 'Panel: GenAI in Enterprise', speaker: 'Multiple Speakers' },
      { time: '13:00', title: 'Lunch Break & Networking', speaker: '' },
      { time: '14:00', title: 'Workshop: Building LLM Applications', speaker: 'Vikram Mehta' },
      { time: '15:30', title: 'Session: Ethical AI Governance', speaker: 'Priya Nair' },
      { time: '17:00', title: 'Startup Showcase & Demos', speaker: '' },
      { time: '18:00', title: 'Closing Ceremony & Awards', speaker: '' },
    ],
  },
  {
    id: '2',
    title: 'Startup Growth Summit',
    venueType: 'indoor',
    description:
      'A power-packed one-day conference for founders, investors, and business leaders. Discover growth hacking strategies, fundraising secrets, and how to scale your startup from zero to unicorn. Network with 200+ VCs and angel investors actively looking for the next big opportunity in India\'s booming startup ecosystem.',
    category: 'Business',
    date: '2025-04-28',
    time: '08:30',
    endDate: '2025-04-28',
    endTime: '20:00',
    location: 'ITC Maratha, Sahar Airport Rd',
    city: 'Mumbai',
    image: 'https://picsum.photos/seed/startup2025/800/450',
    organizer: 'Startup India',
    organizerAvatar: 'https://picsum.photos/seed/startupindia/100/100',
    price: 2999,
    capacity: 300,
    ticketsSold: 287,
    status: 'published',
    tags: ['Startup', 'Funding', 'Growth', 'Business', 'VC'],
    language: 'English',
    speakers: [
      {
        id: 's4',
        name: 'Rohit Bansal',
        role: 'Managing Partner, Accel India',
        photo: 'https://picsum.photos/seed/speaker4/150/150',
        bio: 'Rohit has invested in 80+ startups including Flipkart, Swiggy, and Freshworks. He actively mentors early-stage founders on product-market fit and go-to-market strategy.',
      },
      {
        id: 's5',
        name: 'Neha Agarwal',
        role: 'Co-founder, Nykaa',
        photo: 'https://picsum.photos/seed/speaker5/150/150',
        bio: 'Neha built one of India\'s most iconic D2C brands from scratch and took it public. She shares unfiltered lessons from building a ₹5000 Cr business.',
      },
    ],
    schedule: [
      { time: '08:30', title: 'Registration & Coffee', speaker: '' },
      { time: '09:00', title: 'Opening Keynote: India\'s Startup Decade', speaker: 'Rohit Bansal' },
      { time: '10:30', title: 'Fireside Chat: Building D2C Brands', speaker: 'Neha Agarwal' },
      { time: '12:00', title: 'Pitch Competition Round 1', speaker: '' },
      { time: '13:00', title: 'Networking Lunch', speaker: '' },
      { time: '14:30', title: 'Workshop: Fundraising 101', speaker: 'Rohit Bansal' },
      { time: '16:00', title: 'Panel: Future of Indian Startups', speaker: '' },
      { time: '18:00', title: 'Pitch Finals & Awards', speaker: '' },
    ],
  },
  {
    id: '3',
    title: 'Design Thinking Workshop',
    venueType: 'indoor',
    description:
      'An immersive 2-day workshop where designers, product managers, and developers come together to solve real-world problems using human-centered design principles. Learn UX research, rapid prototyping, and user testing. Leave with a portfolio-ready case study and a network of 150+ design professionals.',
    category: 'Design',
    date: '2025-05-10',
    time: '10:00',
    endDate: '2025-05-11',
    endTime: '17:00',
    location: 'T-Hub, IIIT-H Campus, Gachibowli',
    city: 'Hyderabad',
    image: 'https://picsum.photos/seed/design2025/800/450',
    organizer: 'Design Matters',
    organizerAvatar: 'https://picsum.photos/seed/designmatters/100/100',
    price: 0,
    capacity: 150,
    ticketsSold: 148,
    status: 'published',
    tags: ['Design', 'UX', 'Product', 'Workshop', 'HCD'],
    language: 'English',
    speakers: [
      {
        id: 's6',
        name: 'Arun Iyer',
        role: 'Chief Creative Officer, FCB Ulka',
        photo: 'https://picsum.photos/seed/speaker6/150/150',
        bio: 'Arun is a Cannes Lions judge and has created campaigns for Fortune 500 brands. He brings his decade of brand experience to teach design thinking that drives business results.',
      },
    ],
    schedule: [
      { time: '10:00', title: 'Intro to Design Thinking', speaker: 'Arun Iyer' },
      { time: '11:30', title: 'User Research Techniques', speaker: '' },
      { time: '13:00', title: 'Lunch', speaker: '' },
      { time: '14:00', title: 'Rapid Prototyping Sprint', speaker: '' },
      { time: '16:00', title: 'User Testing Live', speaker: '' },
      { time: '17:00', title: 'Day 1 Wrap', speaker: '' },
    ],
  },
  {
    id: '4',
    title: 'Digital Marketing Masterclass',
    venueType: 'indoor',
    description:
      'A comprehensive 1-day intensive covering all facets of modern digital marketing. From SEO and content strategy to performance media, influencer marketing, and marketing analytics. Taught by practitioners who manage ₹100Cr+ ad budgets. Walk away with a complete 90-day marketing playbook for your brand.',
    category: 'Marketing',
    date: '2025-05-22',
    time: '09:30',
    endDate: '2025-05-22',
    endTime: '18:30',
    location: 'Leela Palace, MG Road',
    city: 'Bangalore',
    image: 'https://picsum.photos/seed/marketing2025/800/450',
    organizer: 'Growth Marketers India',
    organizerAvatar: 'https://picsum.photos/seed/gmi/100/100',
    price: 799,
    capacity: 200,
    ticketsSold: 156,
    status: 'published',
    tags: ['Marketing', 'SEO', 'Digital', 'Growth', 'Analytics'],
    language: 'English',
    speakers: [
      {
        id: 's7',
        name: 'Sonal Jain',
        role: 'VP Marketing, Meesho',
        photo: 'https://picsum.photos/seed/speaker7/150/150',
        bio: 'Sonal scaled Meesho\'s user base from 5M to 100M through data-driven marketing. She is one of India\'s most followed marketing thought leaders on LinkedIn.',
      },
    ],
    schedule: [
      { time: '09:30', title: 'SEO Mastery', speaker: 'Sonal Jain' },
      { time: '11:00', title: 'Paid Media Strategy', speaker: '' },
      { time: '12:30', title: 'Lunch', speaker: '' },
      { time: '13:30', title: 'Content Marketing Workshop', speaker: '' },
      { time: '15:00', title: 'Analytics & Attribution', speaker: 'Sonal Jain' },
      { time: '16:30', title: 'Q&A & Networking', speaker: '' },
    ],
  },
  {
    id: '5',
    title: 'Wellness & Mental Health Retreat',
    venueType: 'outdoor',
    description:
      'A transformative weekend retreat combining mindfulness, modern psychology, and holistic wellness practices. Guided by certified therapists and wellness coaches. Sessions include yoga, meditation, breathwork, journaling, group therapy, and nutrition workshops. Strictly limited to 60 participants for an intimate, safe experience.',
    category: 'Health',
    date: '2025-06-07',
    time: '08:00',
    endDate: '2025-06-08',
    endTime: '17:00',
    location: 'Ananda in the Himalayas, Rishikesh',
    city: 'Rishikesh',
    image: 'https://picsum.photos/seed/wellness2025/800/450',
    organizer: 'MindSpace India',
    organizerAvatar: 'https://picsum.photos/seed/mindspace/100/100',
    price: 4999,
    capacity: 60,
    ticketsSold: 54,
    status: 'published',
    tags: ['Wellness', 'Mental Health', 'Yoga', 'Mindfulness', 'Retreat'],
    language: 'English & Hindi',
    speakers: [
      {
        id: 's8',
        name: 'Dr. Meena Raghavan',
        role: 'Clinical Psychologist & Wellness Coach',
        photo: 'https://picsum.photos/seed/speaker8/150/150',
        bio: 'Dr. Raghavan has guided 10,000+ clients through mental health journeys. She combines evidence-based CBT with ancient Indian wellness traditions for holistic healing.',
      },
    ],
    schedule: [
      { time: '08:00', title: 'Sunrise Yoga & Pranayama', speaker: '' },
      { time: '09:30', title: 'Mindful Breakfast', speaker: '' },
      { time: '10:30', title: 'Understanding Stress & Anxiety', speaker: 'Dr. Meena Raghavan' },
      { time: '12:00', title: 'Group Therapy Session', speaker: 'Dr. Meena Raghavan' },
      { time: '13:30', title: 'Lunch', speaker: '' },
      { time: '14:30', title: 'Breathwork & Meditation', speaker: '' },
      { time: '16:00', title: 'Journaling Workshop', speaker: '' },
    ],
  },
  {
    id: '6',
    title: 'EdTech Innovation Conference',
    venueType: 'indoor',
    description:
      'Bringing together educators, technologists, policymakers, and learners to reimagine the future of education. Explore cutting-edge ed-tech solutions, adaptive learning, gamification, and the role of AI in personalized education. Features a hackathon, product demo day, and awards for the most innovative ed-tech startups of 2025.',
    category: 'Education',
    date: '2025-06-20',
    time: '09:00',
    endDate: '2025-06-21',
    endTime: '18:00',
    location: 'Chennai Trade Centre, Nandambakkam',
    city: 'Chennai',
    image: 'https://picsum.photos/seed/edtech2025/800/450',
    organizer: 'EduIndia 2025',
    organizerAvatar: 'https://picsum.photos/seed/eduindia/100/100',
    price: 999,
    capacity: 400,
    ticketsSold: 312,
    status: 'published',
    tags: ['EdTech', 'Education', 'Innovation', 'AI', 'Learning'],
    language: 'English & Tamil',
    speakers: [
      {
        id: 's9',
        name: 'Byju Raveendran',
        role: 'Founder, BYJU\'S',
        photo: 'https://picsum.photos/seed/speaker9/150/150',
        bio: 'Byju is the man who revolutionized learning in India and built the world\'s most valued ed-tech company. He shares his vision for the next chapter of global education.',
      },
    ],
    schedule: [
      { time: '09:00', title: 'Opening Keynote: Future of Learning', speaker: 'Byju Raveendran' },
      { time: '10:30', title: 'Panel: AI in Classrooms', speaker: '' },
      { time: '12:00', title: 'Ed-Tech Startup Demos', speaker: '' },
      { time: '13:30', title: 'Lunch', speaker: '' },
      { time: '14:30', title: 'Workshop: Gamification in Learning', speaker: '' },
      { time: '16:00', title: 'Hackathon Kickoff', speaker: '' },
    ],
  },
  {
    id: '7',
    title: 'Cloud & DevOps Summit',
    venueType: 'indoor',
    description:
      'A deep-dive technical conference for cloud architects, SREs, DevOps engineers, and platform teams. Featuring hands-on labs, live demos, and war stories from engineers running systems at massive scale. Topics: Kubernetes, GitOps, FinOps, platform engineering, observability, and multi-cloud strategies.',
    category: 'Tech',
    date: '2025-07-05',
    time: '09:00',
    endDate: '2025-07-05',
    endTime: '18:00',
    location: 'Hyderabad International Convention Centre',
    city: 'Hyderabad',
    image: 'https://picsum.photos/seed/cloud2025/800/450',
    organizer: 'CloudNative India',
    organizerAvatar: 'https://picsum.photos/seed/cloudnative/100/100',
    price: 1999,
    capacity: 350,
    ticketsSold: 198,
    status: 'published',
    tags: ['Cloud', 'DevOps', 'Kubernetes', 'AWS', 'Platform Engineering'],
    language: 'English',
    speakers: [
      {
        id: 's10',
        name: 'Arjun Suresh',
        role: 'Principal SRE, Netflix',
        photo: 'https://picsum.photos/seed/speaker10/150/150',
        bio: 'Arjun has built reliability systems for Netflix\'s 200M+ subscriber platform. He is a CNCF ambassador and core contributor to several open-source observability projects.',
      },
    ],
    schedule: [
      { time: '09:00', title: 'Kubernetes at Scale', speaker: 'Arjun Suresh' },
      { time: '10:30', title: 'GitOps Workshop', speaker: '' },
      { time: '12:00', title: 'Lunch', speaker: '' },
      { time: '13:00', title: 'FinOps: Cloud Cost Optimization', speaker: '' },
      { time: '14:30', title: 'Observability Deep Dive', speaker: 'Arjun Suresh' },
      { time: '16:00', title: 'Platform Engineering Patterns', speaker: '' },
    ],
  },
  {
    id: '8',
    title: 'Women in Leadership Forum',
    venueType: 'outdoor',
    description:
      'An empowering full-day forum celebrating and advancing women in leadership across industries. Features keynote speeches from India\'s top female executives, panel discussions on breaking glass ceilings, mentorship circles, and a powerful networking evening. All genders welcome. Free for students with valid ID.',
    category: 'Business',
    date: '2025-07-19',
    time: '09:00',
    endDate: '2025-07-19',
    endTime: '19:00',
    location: 'Taj Lands End, Bandra',
    city: 'Mumbai',
    image: 'https://picsum.photos/seed/women2025/800/450',
    organizer: 'SheLead India',
    organizerAvatar: 'https://picsum.photos/seed/shelead/100/100',
    price: 0,
    capacity: 500,
    ticketsSold: 389,
    status: 'published',
    tags: ['Leadership', 'Women', 'Diversity', 'Inclusion', 'Business'],
    language: 'English',
    speakers: [
      {
        id: 's11',
        name: 'Kiran Mazumdar-Shaw',
        role: 'Executive Chairperson, Biocon',
        photo: 'https://picsum.photos/seed/speaker11/150/150',
        bio: 'Kiran built one of India\'s most respected biotech companies from scratch in 1978 when venture capital was unavailable to women. Her story of persistence and innovation is legendary.',
      },
    ],
    schedule: [
      { time: '09:00', title: 'Welcome Address', speaker: '' },
      { time: '09:30', title: 'Keynote: Redefining Success', speaker: 'Kiran Mazumdar-Shaw' },
      { time: '11:00', title: 'Panel: Breaking Glass Ceilings', speaker: '' },
      { time: '12:30', title: 'Lunch & Mentorship Circles', speaker: '' },
      { time: '14:00', title: 'Workshop: Negotiation & Influence', speaker: '' },
      { time: '16:00', title: 'Fireside Chat', speaker: 'Kiran Mazumdar-Shaw' },
      { time: '18:00', title: 'Networking Evening', speaker: '' },
    ],
  },
];

// ─── ATTENDEES MOCK DATA ─────────────────────────────────────────────────────

export const attendees = [
  {
    id: 'a1', name: 'Arjun Sharma', email: 'arjun.sharma@gmail.com',
    phone: '+91 98765 43210', eventId: '1', ticketType: 'VIP',
    registrationDate: '2025-03-01', checkedIn: true, checkedInTime: '09:15',
    organization: 'Google India', bookingId: 'BK-2025-001',
  },
  {
    id: 'a2', name: 'Priya Patel', email: 'priya.patel@outlook.com',
    phone: '+91 87654 32109', eventId: '1', ticketType: 'General',
    registrationDate: '2025-03-05', checkedIn: true, checkedInTime: '09:32',
    organization: 'Infosys', bookingId: 'BK-2025-002',
  },
  {
    id: 'a3', name: 'Rohit Kumar', email: 'rohit.k@techie.io',
    phone: '+91 76543 21098', eventId: '1', ticketType: 'Student',
    registrationDate: '2025-03-08', checkedIn: false, checkedInTime: null,
    organization: 'IIT Bombay', bookingId: 'BK-2025-003',
  },
  {
    id: 'a4', name: 'Sneha Nair', email: 'sneha.nair@startup.in',
    phone: '+91 65432 10987', eventId: '2', ticketType: 'VIP',
    registrationDate: '2025-03-10', checkedIn: true, checkedInTime: '08:45',
    organization: 'Ola Electric', bookingId: 'BK-2025-004',
  },
  {
    id: 'a5', name: 'Karan Mehta', email: 'karan.mehta@zomato.com',
    phone: '+91 54321 09876', eventId: '2', ticketType: 'General',
    registrationDate: '2025-03-12', checkedIn: false, checkedInTime: null,
    organization: 'Zomato', bookingId: 'BK-2025-005',
  },
  {
    id: 'a6', name: 'Divya Krishnamurthy', email: 'divya.k@design.co',
    phone: '+91 43210 98765', eventId: '3', ticketType: 'General',
    registrationDate: '2025-03-15', checkedIn: true, checkedInTime: '10:05',
    organization: 'Flipkart Design', bookingId: 'BK-2025-006',
  },
  {
    id: 'a7', name: 'Amit Singh', email: 'amit.singh@paytm.com',
    phone: '+91 32109 87654', eventId: '1', ticketType: 'General',
    registrationDate: '2025-03-18', checkedIn: false, checkedInTime: null,
    organization: 'Paytm', bookingId: 'BK-2025-007',
  },
  {
    id: 'a8', name: 'Meera Iyer', email: 'meera.iyer@wipro.com',
    phone: '+91 21098 76543', eventId: '4', ticketType: 'VIP',
    registrationDate: '2025-03-20', checkedIn: true, checkedInTime: '09:20',
    organization: 'Wipro', bookingId: 'BK-2025-008',
  },
  {
    id: 'a9', name: 'Suresh Reddy', email: 'suresh.r@tcs.com',
    phone: '+91 10987 65432', eventId: '5', ticketType: 'General',
    registrationDate: '2025-03-22', checkedIn: false, checkedInTime: null,
    organization: 'TCS', bookingId: 'BK-2025-009',
  },
  {
    id: 'a10', name: 'Lakshmi Venkatesh', email: 'lakshmi.v@zoho.com',
    phone: '+91 09876 54321', eventId: '6', ticketType: 'Student',
    registrationDate: '2025-03-25', checkedIn: true, checkedInTime: '09:10',
    organization: 'Zoho Corp', bookingId: 'BK-2025-010',
  },
  {
    id: 'a11', name: 'Ravi Chandran', email: 'ravi.c@microsoft.com',
    phone: '+91 98765 11111', eventId: '7', ticketType: 'VIP',
    registrationDate: '2025-03-28', checkedIn: false, checkedInTime: null,
    organization: 'Microsoft', bookingId: 'BK-2025-011',
  },
  {
    id: 'a12', name: 'Anita Desai', email: 'anita.d@amazon.in',
    phone: '+91 87654 22222', eventId: '8', ticketType: 'General',
    registrationDate: '2025-04-01', checkedIn: true, checkedInTime: '09:05',
    organization: 'Amazon', bookingId: 'BK-2025-012',
  },
  {
    id: 'a13', name: 'Vijay Raghunathan', email: 'vijay.r@infosys.com',
    phone: '+91 76543 33333', eventId: '1', ticketType: 'General',
    registrationDate: '2025-04-02', checkedIn: true, checkedInTime: '10:00',
    organization: 'Infosys BPM', bookingId: 'BK-2025-013',
  },
  {
    id: 'a14', name: 'Pooja Agarwal', email: 'pooja.a@razorpay.com',
    phone: '+91 65432 44444', eventId: '2', ticketType: 'Student',
    registrationDate: '2025-04-03', checkedIn: false, checkedInTime: null,
    organization: 'IIM Ahmedabad', bookingId: 'BK-2025-014',
  },
  {
    id: 'a15', name: 'Nikhil Joshi', email: 'nikhil.j@swiggy.com',
    phone: '+91 54321 55555', eventId: '3', ticketType: 'VIP',
    registrationDate: '2025-04-05', checkedIn: true, checkedInTime: '10:15',
    organization: 'Swiggy', bookingId: 'BK-2025-015',
  },
];

// ─── FEEDBACK DATA ───────────────────────────────────────────────────────────

export const feedbackData = [
  {
    id: 'f1', attendeeId: 'a1', eventId: '1', name: 'Arjun Sharma',
    overallRating: 5, venueRating: 5, contentRating: 5,
    organizationRating: 4, speakerRating: 5,
    comment: 'Absolutely mind-blowing event! Dr. Krishnan\'s keynote was the most inspiring talk I\'ve attended in years. The networking opportunities were world-class. Will definitely be back next year!',
    date: '2025-04-16',
  },
  {
    id: 'f2', attendeeId: 'a2', eventId: '1', name: 'Priya Patel',
    overallRating: 4, venueRating: 4, contentRating: 5,
    organizationRating: 4, speakerRating: 4,
    comment: 'Great content and very well organized. The venue was a bit crowded during lunch, but overall a fantastic experience. Loved the GenAI workshop sessions.',
    date: '2025-04-16',
  },
  {
    id: 'f3', attendeeId: 'a6', eventId: '3', name: 'Divya Krishnamurthy',
    overallRating: 5, venueRating: 4, contentRating: 5,
    organizationRating: 5, speakerRating: 5,
    comment: 'The Design Thinking workshop completely changed how I approach problem-solving. Arun Iyer is an incredible facilitator. Every designer should attend this workshop at least once.',
    date: '2025-05-12',
  },
  {
    id: 'f4', attendeeId: 'a4', eventId: '2', name: 'Sneha Nair',
    overallRating: 4, venueRating: 5, contentRating: 4,
    organizationRating: 4, speakerRating: 3,
    comment: 'The venue was luxurious and networking was excellent. Some sessions ran over time which affected the schedule flow. But the investor panel was incredibly valuable.',
    date: '2025-04-29',
  },
  {
    id: 'f5', attendeeId: 'a8', eventId: '4', name: 'Meera Iyer',
    overallRating: 5, venueRating: 5, contentRating: 5,
    organizationRating: 5, speakerRating: 5,
    comment: 'Sonal Jain is a marketing genius! Every single session was packed with actionable insights. I immediately implemented 3 strategies and saw results within a week.',
    date: '2025-05-23',
  },
  {
    id: 'f6', attendeeId: 'a10', eventId: '6', name: 'Lakshmi Venkatesh',
    overallRating: 4, venueRating: 3, contentRating: 5,
    organizationRating: 4, speakerRating: 5,
    comment: 'The content quality was exceptional. The venue could have been better equipped for a conference of this size. The ed-tech demos were the highlight — so much innovation happening in India!',
    date: '2025-06-22',
  },
  {
    id: 'f7', attendeeId: 'a13', eventId: '1', name: 'Vijay Raghunathan',
    overallRating: 3, venueRating: 4, contentRating: 3,
    organizationRating: 3, speakerRating: 3,
    comment: 'Decent event but I expected more depth in the AI sessions. Some talks felt like sales pitches rather than genuine knowledge sharing. The networking sessions were the best part.',
    date: '2025-04-17',
  },
  {
    id: 'f8', attendeeId: 'a12', eventId: '8', name: 'Anita Desai',
    overallRating: 5, venueRating: 5, contentRating: 5,
    organizationRating: 5, speakerRating: 5,
    comment: 'Kiran Mazumdar-Shaw\'s speech was worth every penny. This forum truly celebrate women leaders without making it tokenistic. Already recommended it to 20+ colleagues. See you next year!',
    date: '2025-07-20',
  },
  {
    id: 'f9', attendeeId: 'a15', eventId: '3', name: 'Nikhil Joshi',
    overallRating: 4, venueRating: 4, contentRating: 4,
    organizationRating: 5, speakerRating: 4,
    comment: 'Really well organized event with great hands-on learning. The project I built during the workshop is now part of our design system at Swiggy. Highly practical and impactful!',
    date: '2025-05-12',
  },
  {
    id: 'f10', attendeeId: 'a9', eventId: '5', name: 'Suresh Reddy',
    overallRating: 5, venueRating: 5, contentRating: 5,
    organizationRating: 4, speakerRating: 5,
    comment: 'A genuinely transformative experience. Dr. Raghavan is so compassionate and knowledgeable. The retreat environment was perfect for introspection. I feel like a new person.',
    date: '2025-06-09',
  },
];

// ─── TICKET TYPES ────────────────────────────────────────────────────────────

export const ticketTypes = [
  {
    id: 'general', name: 'General', price: 0, color: 'bg-blue-100 text-blue-800',
    description: 'Access to all main sessions and networking areas',
    perks: ['All keynote sessions', 'Networking lunch', 'Event swag bag', 'Digital certificate'],
  },
  {
    id: 'vip', name: 'VIP', price: 1499, color: 'bg-yellow-100 text-yellow-800',
    description: 'Premium experience with exclusive access and benefits',
    perks: ['All General benefits', 'VIP lounge access', 'Meet & greet with speakers', 'Priority seating', 'Recorded sessions', 'Executive dinner'],
  },
  {
    id: 'student', name: 'Student', price: 299, color: 'bg-green-100 text-green-800',
    description: 'Discounted access for full-time students with valid ID',
    perks: ['All main sessions', 'Networking lunch', 'Digital certificate', 'Student-specific workshops'],
  },
];

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export const categories = [
  { id: 'tech', name: 'Tech', icon: 'Cpu', color: 'bg-blue-500', lightColor: 'bg-blue-50 text-blue-700', count: 45 },
  { id: 'business', name: 'Business', icon: 'Briefcase', color: 'bg-purple-500', lightColor: 'bg-purple-50 text-purple-700', count: 32 },
  { id: 'design', name: 'Design', icon: 'Palette', color: 'bg-pink-500', lightColor: 'bg-pink-50 text-pink-700', count: 28 },
  { id: 'marketing', name: 'Marketing', icon: 'TrendingUp', color: 'bg-orange-500', lightColor: 'bg-orange-50 text-orange-700', count: 19 },
  { id: 'health', name: 'Health', icon: 'Heart', color: 'bg-red-500', lightColor: 'bg-red-50 text-red-700', count: 15 },
  { id: 'education', name: 'Education', icon: 'BookOpen', color: 'bg-green-500', lightColor: 'bg-green-50 text-green-700', count: 24 },
];

// ─── NAV LINKS ───────────────────────────────────────────────────────────────

export const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Events', path: '/events' },
  { label: 'About', path: '/about' },
];

export const adminNavLinks = [
  { label: 'Dashboard', path: '/admin', icon: 'LayoutDashboard' },
  { label: 'Events', path: '/admin/events', icon: 'Calendar' },
  { label: 'Attendees', path: '/admin/attendees', icon: 'Users' },
  { label: 'Check-in', path: '/admin/check-in', icon: 'QrCode' },
  { label: 'Analytics', path: '/admin/analytics', icon: 'BarChart2' },
  { label: 'Feedback', path: '/admin/feedback', icon: 'MessageSquare' },
];

// ─── ANALYTICS CHART DATA ────────────────────────────────────────────────────

export const salesChartData = [
  { date: 'Mar 10', tickets: 45 },
  { date: 'Mar 11', tickets: 72 },
  { date: 'Mar 12', tickets: 58 },
  { date: 'Mar 13', tickets: 90 },
  { date: 'Mar 14', tickets: 125 },
  { date: 'Mar 15', tickets: 87 },
  { date: 'Mar 16', tickets: 143 },
];

export const categoryPieData = [
  { name: 'Tech', value: 45, color: '#3B82F6' },
  { name: 'Business', value: 32, color: '#8B5CF6' },
  { name: 'Design', value: 28, color: '#EC4899' },
  { name: 'Marketing', value: 19, color: '#F97316' },
  { name: 'Health', value: 15, color: '#EF4444' },
  { name: 'Education', value: 24, color: '#10B981' },
];

export const registrationsChartData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date('2025-03-01');
  date.setDate(date.getDate() + i);
  return {
    date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    registrations: Math.floor(Math.random() * 80) + 20,
  };
});

export const ticketBreakdownData = [
  { name: 'General', value: 420, color: '#3B82F6' },
  { name: 'VIP', value: 180, color: '#F5A623' },
  { name: 'Student', value: 160, color: '#10B981' },
];

export const attendanceByEventData = [
  { event: 'Tech Summit', registered: 423, attended: 389 },
  { event: 'Startup Summit', registered: 287, attended: 261 },
  { event: 'Design Workshop', registered: 148, attended: 142 },
  { event: 'Marketing MC', registered: 156, attended: 134 },
  { event: 'EdTech Conf', registered: 312, attended: 278 },
  { event: 'Cloud Summit', registered: 198, attended: 176 },
];

export const testimonials = [
  {
    id: 't1', name: 'Rahul Gupta', role: 'CTO, TechBridge Solutions',
    avatar: 'https://picsum.photos/seed/t1/80/80',
    quote: 'This platform made organizing our annual developer conference effortless. The check-in scanner alone saved us 2 hours of queue time. Absolutely brilliant product!',
    rating: 5, event: 'Tech Summit 2024',
  },
  {
    id: 't2', name: 'Shruti Menon', role: 'Event Manager, Nasscom',
    avatar: 'https://picsum.photos/seed/t2/80/80',
    quote: 'The analytics dashboard is incredibly powerful. We could see real-time registrations, demographics, and even predict no-shows. This is the future of event management.',
    rating: 5, event: 'Product Conclave 2024',
  },
  {
    id: 't3', name: 'Aditya Bose', role: 'Founder, StartupHouse',
    avatar: 'https://picsum.photos/seed/t3/80/80',
    quote: 'From ticket sales to feedback collection, everything is seamlessly integrated. The QR-based check-in is so fast and professional. Our attendees love it too!',
    rating: 5, event: 'Startup Mixer 2024',
  },
];

// ─── USERS (MOCK AUTH) ───────────────────────────────────────────────────────

export const mockUsers = [
  {
    id: 'u1', name: 'Admin User', email: 'admin@zoho.com', password: 'admin123',
    role: 'admin', avatar: 'https://picsum.photos/seed/admin/100/100',
  },
  {
    id: 'u2', name: 'Arjun Sharma', email: 'arjun@gmail.com', password: 'user123',
    role: 'attendee', avatar: 'https://picsum.photos/seed/arjun/100/100',
  },
  {
    id: 'u3', name: 'Priya Organizer', email: 'organizer@events.com', password: 'org123',
    role: 'organizer', avatar: 'https://picsum.photos/seed/priya/100/100',
  },
];