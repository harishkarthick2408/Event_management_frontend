import { useState, useRef, useEffect } from 'react';
import { QrCode, CheckCircle, AlertTriangle, XCircle, UserCheck, Clock } from 'lucide-react';
import { attendees, events } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { calculateAttendanceRate } from '../../utils/helpers';

const CheckInScanner = () => {
  const [selectedEventId, setSelectedEventId] = useState('1');
  const [scanResult, setScanResult] = useState(null); // null | 'success' | 'already' | 'invalid'
  const [resultData, setResultData] = useState(null);
  const [manualId, setManualId] = useState('');
  const [scannerActive, setScannerActive] = useState(false);
  const [recentCheckins, setRecentCheckins] = useState([]);
  const [attendeesData, setAttendeesData] = useState(attendees);
  const scannerRef = useRef(null);
  const scannerInstance = useRef(null);

  const event = events.find((e) => e.id === selectedEventId);
  const eventAttendees = attendeesData.filter((a) => a.eventId === selectedEventId);
  const checkedIn = eventAttendees.filter((a) => a.checkedIn).length;
  const rate = calculateAttendanceRate(checkedIn, eventAttendees.length);

  const processCheckIn = (bookingId) => {
    const attendee = attendeesData.find(
      (a) => a.bookingId === bookingId.trim() && a.eventId === selectedEventId
    );

    if (!attendee) {
      setScanResult('invalid');
      setResultData(null);
      return;
    }

    if (attendee.checkedIn) {
      setScanResult('already');
      setResultData(attendee);
      return;
    }

    // Check in the attendee
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setAttendeesData((prev) => prev.map((a) =>
      a.bookingId === bookingId ? { ...a, checkedIn: true, checkedInTime: time } : a
    ));
    const updated = { ...attendee, checkedIn: true, checkedInTime: time };
    setScanResult('success');
    setResultData(updated);
    setRecentCheckins((prev) => [{ ...updated, timestamp: time }, ...prev.slice(0, 9)]);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualId.trim()) return;
    processCheckIn(manualId.trim());
    setManualId('');
  };

  const startScanner = async () => {
    if (scannerActive) {
      setScannerActive(false);
      if (scannerInstance.current) {
        try { await scannerInstance.current.stop(); } catch {}
        scannerInstance.current = null;
      }
      return;
    }
    setScannerActive(true);
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      scannerInstance.current = new Html5Qrcode('qr-reader');
      await scannerInstance.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          processCheckIn(decodedText);
          scannerInstance.current?.stop().then(() => { setScannerActive(false); });
        },
        () => {}
      );
    } catch (err) {
      setScannerActive(false);
      console.warn('Camera not available:', err.message);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerInstance.current) {
        scannerInstance.current.stop().catch(() => {});
      }
    };
  }, []);

  const ResultCard = () => {
    if (!scanResult) return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-400">
        <QrCode className="w-12 h-12 mb-3 opacity-30" />
        <p className="font-semibold text-sm">Scan or enter Booking ID</p>
        <p className="text-xs mt-1">Results will appear here</p>
      </div>
    );
    if (scanResult === 'success') return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-green-700 mb-4">
          <CheckCircle className="w-7 h-7" />
          <span className="text-lg font-bold">Checked In Successfully!</span>
        </div>
        <div className="space-y-2">
          <p className="font-bold text-[#1A1A2E]">{resultData?.name}</p>
          <p className="text-sm text-gray-500">{resultData?.email}</p>
          <div className="flex gap-2 mt-3">
            <Badge variant="success">{resultData?.ticketType}</Badge>
            <Badge variant="success" dot>Verified</Badge>
          </div>
        </div>
      </div>
    );
    if (scanResult === 'already') return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-amber-700 mb-4">
          <AlertTriangle className="w-7 h-7" />
          <span className="text-lg font-bold">Already Checked In</span>
        </div>
        <p className="font-bold text-[#1A1A2E]">{resultData?.name}</p>
        <p className="text-sm text-gray-500">Checked in at {resultData?.checkedInTime}</p>
        <Badge variant="warning" className="mt-3">Duplicate Scan</Badge>
      </div>
    );
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-red-600 mb-4">
          <XCircle className="w-7 h-7" />
          <span className="text-lg font-bold">Invalid Ticket</span>
        </div>
        <p className="text-sm text-gray-600">No matching ticket found for this event.</p>
        <p className="text-xs text-gray-400 mt-2">Check the booking ID and try again.</p>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Event Selector */}
      <div>
        <label className="text-sm font-semibold text-gray-600 mb-1 block">Select Event</label>
        <select value={selectedEventId} onChange={(e) => { setSelectedEventId(e.target.value); setScanResult(null); }}
          className="w-full md:w-80 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E8441A]">
          {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: eventAttendees.length, color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: 'Checked In', value: checkedIn, color: 'bg-green-50 text-green-700 border-green-200' },
          { label: 'Remaining', value: eventAttendees.length - checkedIn, color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { label: 'Rate %', value: `${rate}%`, color: 'bg-purple-50 text-purple-700 border-purple-200' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl border px-5 py-4 ${color}`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm font-medium">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Scanner Left */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-[#1A1A2E]">QR Scanner</h3>

          {/* Camera area */}
          <div className="relative bg-gray-900 rounded-xl overflow-hidden" style={{ minHeight: '240px' }}>
            <div id="qr-reader" className="w-full" />
            {!scannerActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <QrCode className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm text-gray-400">Camera inactive</p>
              </div>
            )}
            {scannerActive && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-[#E8441A] rounded-xl">
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-[#E8441A] rounded-tl" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-[#E8441A] rounded-tr" />
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-[#E8441A] rounded-bl" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-[#E8441A] rounded-br" />
                </div>
              </div>
            )}
          </div>

          <Button variant={scannerActive ? 'danger' : 'primary'} fullWidth leftIcon={QrCode} onClick={startScanner}>
            {scannerActive ? 'Stop Scanner' : 'Start Scanner'}
          </Button>

          {/* Manual Entry */}
          <div className="pt-2">
            <p className="text-sm font-semibold text-gray-500 mb-2">Or enter Booking ID manually</p>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input type="text" placeholder="BK-XXXXX-XXXX" value={manualId}
                onChange={(e) => setManualId(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8441A] font-mono" />
              <Button type="submit" variant="secondary" size="sm">Submit</Button>
            </form>
            {/* Quick test buttons */}
            <div className="mt-2 flex flex-wrap gap-1">
              <p className="text-xs text-gray-400 w-full">Quick test:</p>
              {attendeesData.filter((a) => a.eventId === selectedEventId).slice(0, 3).map((a) => (
                <button key={a.id} onClick={() => { processCheckIn(a.bookingId); }}
                  className="text-xs px-2 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 font-mono transition-colors">
                  {a.bookingId}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result Right */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-[#1A1A2E] mb-4">Check-in Result</h3>
          <ResultCard />

          {scanResult && (
            <button onClick={() => setScanResult(null)}
              className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-[#E8441A] transition-colors">
              Clear & Scan Next
            </button>
          )}
        </div>
      </div>

      {/* Recent Check-ins */}
      {recentCheckins.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-[#1A1A2E] mb-4">Recent Check-ins</h3>
          <div className="space-y-2">
            {recentCheckins.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1A1A2E] text-sm truncate">{c.name}</p>
                  <p className="text-xs text-gray-400 truncate">{c.email}</p>
                </div>
                <Badge variant="success">{c.ticketType}</Badge>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{c.timestamp}</span>
                </div>
                <UserCheck className="w-4 h-4 text-green-500" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInScanner;
