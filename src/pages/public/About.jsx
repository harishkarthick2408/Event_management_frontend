import { Link } from 'react-router-dom';
import {
  Target,
  Eye,
  QrCode,
  UserCheck,
  BarChart2,
  Zap,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const missionVision = [
  {
    title: 'Our Mission',
    description:
      'To simplify event management for organizers of every size with tools that feel intuitive, fast, and reliable from planning to post-event insights.',
    Icon: Target,
  },
  {
    title: 'Our Vision',
    description:
      'To become the go-to platform where unforgettable events are launched, discovered, and experienced seamlessly across every city and community.',
    Icon: Eye,
  },
];

const featureHighlights = [
  {
    title: 'Smart Ticketing',
    description: 'Generate secure digital tickets with QR validation to make entry smoother and safer.',
    Icon: QrCode,
  },
  {
    title: 'Live Check-in',
    description: 'Track attendance in real time with lightning-fast check-ins at your event gates.',
    Icon: UserCheck,
  },
  {
    title: 'Real-time Analytics',
    description: 'Monitor registrations, attendance, and engagement metrics as your event unfolds.',
    Icon: BarChart2,
  },
  {
    title: 'Seamless Experience',
    description: 'Deliver a polished journey for organizers and attendees with fewer operational headaches.',
    Icon: Zap,
  },
];

const stats = [
  { value: '500+', label: 'Events Hosted' },
  { value: '50,000+', label: 'Attendees Served' },
  { value: '100+', label: 'Cities Reached' },
  { value: '4.9★', label: 'Average Rating' },
];

const teamMembers = [
  {
    name: 'Aarav Mehta',
    role: 'Product Lead',
    bio: 'Shapes product strategy to ensure EventPro solves real organizer problems with clarity.',
    initials: 'AM',
  },
  {
    name: 'Riya Kapoor',
    role: 'Head of Engineering',
    bio: 'Leads platform architecture focused on reliability, speed, and secure event operations.',
    initials: 'RK',
  },
  {
    name: 'Neel Sharma',
    role: 'Growth Manager',
    bio: 'Partners with organizers to scale event reach through data-informed growth initiatives.',
    initials: 'NS',
  },
  {
    name: 'Sana Iyer',
    role: 'Customer Success Lead',
    bio: 'Supports teams end-to-end so every event launch feels confident and stress-free.',
    initials: 'SI',
  },
];

const benefits = [
  'Modern, intuitive tools designed for teams and solo organizers alike',
  'Flexible ticketing flows for free, paid, and tiered event formats',
  'Live attendee insights that help you optimize in the moment',
  'Reliable check-in operations for high-volume events',
  'Unified dashboard for planning, execution, and post-event reporting',
  'Dedicated support that stays with you before, during, and after launch',
];

const About = () => {
  return (
    <div className="bg-[#F8F9FA]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#E8441A] via-[#c83a16] to-[#1A1A2E]">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#1A1A2E]/50 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-28">
          <p className="mb-4 inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">
            About Our Platform
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">About EventPro</h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/85 sm:text-lg">
            EventPro was built to simplify event management from start to finish, helping organizers create
            exceptional experiences while staying in complete control of registrations, ticketing, and attendee
            engagement.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {missionVision.map(({ title, description, Icon }) => (
            <Card key={title} className="h-full rounded-2xl border border-gray-100" shadow="sm" border>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8441A]/10">
                <Icon className="h-6 w-6 text-[#E8441A]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1A1A2E]">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#E8441A]">What We Do</p>
            <h2 className="mt-2 text-3xl font-bold text-[#1A1A2E] sm:text-4xl">Powerful Features for Better Events</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featureHighlights.map(({ title, description, Icon }) => (
              <Card key={title} className="h-full rounded-2xl border border-gray-100" shadow="sm" hover border>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#1A1A2E]/10">
                  <Icon className="h-6 w-6 text-[#1A1A2E]" />
                </div>
                <h3 className="text-lg font-bold text-[#1A1A2E]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1A1A2E] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-extrabold text-white sm:text-4xl">{value}</p>
                <p className="mt-2 text-sm font-medium text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#E8441A]">Our People</p>
          <h2 className="mt-2 text-3xl font-bold text-[#1A1A2E] sm:text-4xl">Meet the Team</h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map(({ name, role, bio, initials }) => (
            <Card key={name} className="h-full rounded-2xl border border-gray-100" shadow="sm" border>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#E8441A] to-[#1A1A2E] text-lg font-bold text-white">
                {initials}
              </div>
              <h3 className="text-lg font-bold text-[#1A1A2E]">{name}</h3>
              <p className="mt-1 text-sm font-semibold text-[#E8441A]">{role}</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{bio}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#E8441A]">Why Choose Us</p>
            <h2 className="mt-2 text-3xl font-bold text-[#1A1A2E] sm:text-4xl">Built for High-Impact Events</h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              We combine thoughtful product design with robust event operations so your team can focus on creating
              memorable moments, not wrestling with logistics.
            </p>
            <ul className="mt-6 space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 rounded-xl bg-[#F8F9FA] p-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#E8441A]" />
                  <span className="text-sm text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card
            className="relative overflow-hidden rounded-2xl border border-[#1A1A2E]/10 bg-gradient-to-br from-[#1A1A2E] to-[#2a2a48] text-white"
            shadow="lg"
            border
          >
            <div className="absolute -right-14 -top-14 h-48 w-48 rounded-full bg-[#E8441A]/30 blur-3xl" />
            <div className="relative">
              <p className="text-sm uppercase tracking-wider text-white/70">Platform Snapshot</p>
              <h3 className="mt-2 text-2xl font-bold">Everything in One Command Center</h3>
              <div className="mt-8 space-y-4">
                {[
                  { label: 'Average Check-in Time', value: '2.1 sec' },
                  { label: 'Event Setup Time', value: '< 10 min' },
                  { label: 'Organizer Satisfaction', value: '98%' },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl border border-white/15 bg-white/5 p-4">
                    <p className="text-xs text-white/70">{label}</p>
                    <p className="mt-1 text-2xl font-bold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-r from-[#E8441A] to-[#1A1A2E] px-6 py-12 text-center sm:px-10">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to host your next event?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85 sm:text-base">
            Start planning with EventPro today and deliver an event experience your audience remembers.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/register">
              <Button variant="white" size="lg" rightIcon={ArrowRight}>
                Get Started
              </Button>
            </Link>
            <Link to="/events">
              <Button
                size="lg"
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#E8441A]"
              >
                Browse Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
