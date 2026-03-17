import {
  Calendar, Ticket, UserCheck, DollarSign, TrendingUp, TrendingDown,
  ArrowRight
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Link } from 'react-router-dom';
import { events, attendees, salesChartData, categoryPieData } from '../../utils/constants';
import { formatDate, formatPrice, calculateAttendanceRate } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';

const StatCard = ({ label, value, icon: Icon, color, bg, change, up }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
        {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {change}
      </div>
    </div>
    <p className="text-3xl font-bold text-[#1A1A2E] mb-0.5">{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

const Dashboard = () => {
  const totalrev = attendees.reduce((sum, a) => {
    const e = events.find((ev) => ev.id === a.eventId);
    return sum + (e?.price || 0);
  }, 0);

  const checkedInToday = attendees.filter((a) => a.checkedIn).length;

  const recentRegistrations = attendees.slice(0, 6);
  const upcomingEvents = events.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Events" value={events.length} icon={Calendar}
          color="text-blue-600" bg="bg-blue-100" change="+12%" up />
        <StatCard label="Tickets Sold" value={attendees.length} icon={Ticket}
          color="text-green-600" bg="bg-green-100" change="+28%" up />
        <StatCard label="Check-ins Today" value={checkedInToday} icon={UserCheck}
          color="text-orange-600" bg="bg-orange-100" change="+5%" up />
        <StatCard label="Revenue" value={formatPrice(totalrev)} icon={DollarSign}
          color="text-purple-600" bg="bg-purple-100" change="+18%" up />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-[#1A1A2E]">Ticket Sales — Last 7 Days</h3>
              <p className="text-xs text-gray-400">Daily ticket registrations</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={salesChartData}>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }} />
              <Line type="monotone" dataKey="tickets" stroke="#E8441A" strokeWidth={3}
                dot={{ fill: '#E8441A', strokeWidth: 0, r: 5 }}
                activeDot={{ r: 7, fill: '#E8441A' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-[#1A1A2E] mb-1">Events by Category</h3>
          <p className="text-xs text-gray-400 mb-4">Distribution across categories</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                paddingAngle={3} dataKey="value">
                {categoryPieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent Registrations */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1A1A2E]">Recent Registrations</h3>
            <Link to="/admin/attendees" className="text-xs text-[#E8441A] hover:underline font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Event</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentRegistrations.map((a) => {
                  const ev = events.find((e) => e.id === a.eventId);
                  return (
                    <tr key={a.id} className="text-sm">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#E8441A]/10 flex items-center justify-center text-[#E8441A] text-xs font-bold">
                            {a.name[0]}
                          </div>
                          <span className="font-medium text-[#1A1A2E]">{a.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-500 max-w-[120px] truncate">{ev?.title || '-'}</td>
                      <td className="py-3"><Badge variant={a.ticketType === 'VIP' ? 'warning' : a.ticketType === 'Student' ? 'success' : 'info'}>{a.ticketType}</Badge></td>
                      <td className="py-3"><Badge variant={a.checkedIn ? 'success' : 'warning'} dot>{a.checkedIn ? 'Checked In' : 'Pending'}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1A1A2E]">Upcoming Events</h3>
            <Link to="/admin/events" className="text-xs text-[#E8441A] hover:underline font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((ev) => {
              const rate = calculateAttendanceRate(ev.ticketsSold, ev.capacity);
              return (
                <div key={ev.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A2E] leading-tight">{ev.title}</p>
                      <p className="text-xs text-gray-400">{formatDate(ev.date)} · {ev.city}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-600 ml-2">{ev.ticketsSold}/{ev.capacity}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${rate >= 90 ? 'bg-red-500' : rate >= 70 ? 'bg-amber-500' : 'bg-[#E8441A]'}`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{rate}% filled</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
