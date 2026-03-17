import { useState } from 'react';
import { Download, DollarSign, Users, TrendingUp, Star } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { events, registrationsChartData, ticketBreakdownData, attendanceByEventData } from '../../utils/constants';
import { formatPrice, calculateAttendanceRate } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const AnalyticsReports = () => {
  const [dateFrom, setDateFrom] = useState('2025-03-01');
  const [dateTo, setDateTo] = useState('2025-04-30');
  const [selectedEvent, setSelectedEvent] = useState('all');

  const totalRevenue = events.reduce((sum, e) => sum + e.price * e.ticketsSold, 0);
  const totalRegistrations = events.reduce((sum, e) => sum + e.ticketsSold, 0);
  const avgRate = Math.round(events.reduce((sum, e) => sum + calculateAttendanceRate(e.ticketsSold, e.capacity), 0) / events.length);
  const topEvent = events.reduce((top, e) => (e.ticketsSold > top.ticketsSold ? e : top), events[0]);

  const perEventTable = events.map((e) => ({
    name: e.title,
    date: e.date,
    registrations: e.ticketsSold,
    attendance: Math.round(e.ticketsSold * 0.91),
    rate: calculateAttendanceRate(Math.round(e.ticketsSold * 0.91), e.capacity),
    revenue: e.price * e.ticketsSold,
    feedback: (4 + Math.random()).toFixed(1),
  }));

  const KpiCard = ({ label, value, icon: Icon, color, bg }) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-[#1A1A2E] mt-0.5">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">Performance insights across all events</p>
        <Button variant="outline" leftIcon={Download}>Export Report</Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">From</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8441A]" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">To</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8441A]" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Event</label>
          <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E8441A]">
            <option value="all">All Events</option>
            {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Revenue" value={formatPrice(totalRevenue)} icon={DollarSign} color="text-purple-600" bg="bg-purple-100" />
        <KpiCard label="Registrations" value={totalRegistrations.toLocaleString()} icon={Users} color="text-blue-600" bg="bg-blue-100" />
        <KpiCard label="Avg Attendance" value={`${avgRate}%`} icon={TrendingUp} color="text-green-600" bg="bg-green-100" />
        <KpiCard label="Top Event" value={`${topEvent.ticketsSold} tickets`} icon={Star} color="text-amber-600" bg="bg-amber-100" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Registrations line chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-[#1A1A2E] mb-1">Registrations Over Time (30 days)</h3>
          <p className="text-xs text-gray-400 mb-5">Daily registration trends</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={registrationsChartData}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }} />
              <Line type="monotone" dataKey="registrations" stroke="#E8441A" strokeWidth={2.5}
                dot={false} activeDot={{ r: 5, fill: '#E8441A' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-[#1A1A2E] mb-1">Ticket Breakdown</h3>
          <p className="text-xs text-gray-400 mb-4">By ticket type</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={ticketBreakdownData} innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {ticketBreakdownData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {ticketBreakdownData.map((t) => (
              <div key={t.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                  <span className="text-gray-600">{t.name}</span>
                </div>
                <span className="font-semibold text-[#1A1A2E]">{t.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-[#1A1A2E] mb-1">Attendance by Event</h3>
        <p className="text-xs text-gray-400 mb-5">Registered vs Attended comparison</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={attendanceByEventData} barGap={4}>
            <XAxis dataKey="event" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
            <Bar dataKey="registered" name="Registered" fill="#1A1A2E" radius={[4,4,0,0]} />
            <Bar dataKey="attended" name="Attended" fill="#E8441A" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-Event Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm overflow-hidden">
        <h3 className="font-bold text-[#1A1A2E] mb-4">Per-Event Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                <th className="pb-3">Event Name</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Registrations</th>
                <th className="pb-3">Attended</th>
                <th className="pb-3">Rate %</th>
                <th className="pb-3">Revenue</th>
                <th className="pb-3">Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {perEventTable.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-3 font-medium text-[#1A1A2E] max-w-[200px] truncate">{row.name}</td>
                  <td className="py-3 text-gray-500">{row.date}</td>
                  <td className="py-3">{row.registrations}</td>
                  <td className="py-3">{row.attendance}</td>
                  <td className="py-3">
                    <Badge variant={row.rate >= 80 ? 'success' : row.rate >= 60 ? 'warning' : 'error'}>{row.rate}%</Badge>
                  </td>
                  <td className="py-3 font-semibold text-[#1A1A2E]">{formatPrice(row.revenue)}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#F5A623] text-[#F5A623]" />
                      <span className="font-semibold">{row.feedback}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;
