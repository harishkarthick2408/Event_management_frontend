import { Link } from 'react-router-dom';
import { ArrowRight, Star, Calendar, Users, Globe, Zap, Check, Cpu, Briefcase, Palette, TrendingUp, Heart, BookOpen } from 'lucide-react';
import { events, testimonials, categories } from '../../utils/constants';
import EventList from '../../components/event/EventList';
import Button from '../../components/ui/Button';

const categoryIconMap = { Cpu, Briefcase, Palette, TrendingUp, Heart, BookOpen };

const Landing = () => {
  const featuredEvents = events.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* ─── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460] min-h-[90vh] flex items-center overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[500px] h-[500px] bg-[#E8441A]/15 rounded-full -top-40 -right-40 blur-3xl" />
          <div className="absolute w-[300px] h-[300px] bg-[#F5A623]/10 rounded-full bottom-0 left-0 blur-2xl" />
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{ top: `${10 + i * 7}%`, left: `${5 + i * 8}%` }} />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#E8441A]/20 border border-[#E8441A]/30 rounded-full px-4 py-1.5 mb-6">
                <Zap className="w-3.5 h-3.5 text-[#E8441A]" />
                <span className="text-[#E8441A] text-xs font-semibold">Powered by Zoho — Hackathon 2025</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                Your Events,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8441A] to-[#F5A623]">Perfectly</span><br />
                Managed
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-lg">
                Create, promote, and analyse stunning events. From intimate webinars to massive conferences — all in one powerful platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/events">
                  <Button variant="primary" size="lg" rightIcon={ArrowRight}>Explore Events</Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#1A1A2E]">
                    Create Event
                  </Button>
                </Link>
              </div>
              {/* Trust indicators */}
              <div className="flex items-center gap-6 mt-10">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://picsum.photos/seed/h${i}/40/40`} alt=""
                      className="w-9 h-9 rounded-full border-2 border-[#1A1A2E]" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#F5A623] text-[#F5A623]" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">Trusted by 10,000+ organisers</p>
                </div>
              </div>
            </div>

            {/* Right illustration */}
            <div className="relative hidden lg:block">
              <div className="relative w-full h-96">
                {/* Main card */}
                <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6">
                  <img src="https://picsum.photos/seed/hero-event/600/400" alt="Event"
                    className="w-full h-48 object-cover rounded-2xl mb-4" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold">Tech Summit 2025</p>
                      <p className="text-gray-400 text-sm">Apr 15 · Bangalore</p>
                    </div>
                    <span className="bg-[#E8441A] text-white text-xs font-bold px-3 py-1 rounded-full">
                      ₹1,499
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>423/500 registered</span><span>84% full</span>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full">
                      <div className="h-full w-[84%] bg-[#E8441A] rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Floating stat cards */}
                <div className="absolute -left-6 top-1/4 bg-white rounded-xl shadow-xl p-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[#1A1A2E] text-xs font-bold">156 Checked In</p>
                    <p className="text-gray-400 text-xs">Today</p>
                  </div>
                </div>
                <div className="absolute -right-4 bottom-16 bg-white rounded-xl shadow-xl p-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#E8441A]/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-[#E8441A]" />
                  </div>
                  <div>
                    <p className="text-[#1A1A2E] text-xs font-bold">₹2.4L Revenue</p>
                    <p className="text-gray-400 text-xs">This month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Events Hosted', icon: Calendar, color: 'bg-blue-100 text-blue-600' },
              { value: '50,000+', label: 'Happy Attendees', icon: Users, color: 'bg-green-100 text-green-600' },
              { value: '100+', label: 'Cities Covered', icon: Globe, color: 'bg-purple-100 text-purple-600' },
              { value: '4.9★', label: 'Average Rating', icon: Star, color: 'bg-amber-100 text-amber-600' },
            ].map(({ value, label, icon: Icon, color }) => (
              <div key={label} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1A1A2E]">{value}</p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED EVENTS ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-[#E8441A] font-semibold text-sm uppercase tracking-wider mb-2">Trending</p>
              <h2 className="text-4xl font-bold text-[#1A1A2E]">Featured Events</h2>
            </div>
            <Link to="/events">
              <Button variant="outline" rightIcon={ArrowRight}>View All Events</Button>
            </Link>
          </div>
          <EventList events={featuredEvents} />
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#E8441A] font-semibold text-sm uppercase tracking-wider mb-2">Simple Process</p>
            <h2 className="text-4xl font-bold text-[#1A1A2E]">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-[#E8441A] to-[#F5A623]" />
            {[
              { step: '01', title: 'Create Your Event', desc: 'Use our intuitive form to set up your event details, ticket types, and branding in minutes.', icon: Calendar },
              { step: '02', title: 'Share & Register', desc: 'Share your event page instantly. Attendees register and receive digital tickets with QR codes.', icon: Users },
              { step: '03', title: 'Check-in & Analyse', desc: 'Scan QR tickets at the door and access real-time analytics to measure your event success.', icon: BarChart2 },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#E8441A] to-[#F5A623] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="absolute top-0 right-6 lg:right-16 w-8 h-8 bg-[#1A1A2E] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {step}
                </div>
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#E8441A] font-semibold text-sm uppercase tracking-wider mb-2">Browse</p>
            <h2 className="text-4xl font-bold text-[#1A1A2E]">Explore by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(({ id, name, icon, color, count }) => {
              const Icon = categoryIconMap[icon] || Cpu;
              return (
                <Link key={id} to={`/events?category=${name}`}
                  className="group bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                  <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-[#1A1A2E] text-sm mb-1">{name}</h3>
                  <p className="text-xs text-gray-400">{count} events</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#E8441A] font-semibold text-sm uppercase tracking-wider mb-2">Reviews</p>
            <h2 className="text-4xl font-bold text-[#1A1A2E]">What Organisers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-gradient-to-br from-[#F8F9FA] to-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-[#1A1A2E] text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ───────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-[#E8441A] to-[#F5A623] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to host your event?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of organisers who trust EventPro for their most important events.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register">
              <Button variant="white" size="lg" rightIcon={ArrowRight}>Get Started Free</Button>
            </Link>
            <Link to="/events">
              <Button size="lg" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#E8441A] px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105">
                Browse Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Add missing import
import { BarChart2 } from 'lucide-react';

export default Landing;
