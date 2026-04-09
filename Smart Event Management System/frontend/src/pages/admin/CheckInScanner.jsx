import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Users,
  UserCheck,
  Clock,
  TrendingUp,
  QrCode,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  XCircle,
  X,
  ScanLine,
  RefreshCcw,
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { formatDate } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useEventContext } from '../../context/EventContext';
import checkinService from '../../services/checkinService';

const CheckInScanner = () => {
  const { events, loading: eventsLoading } = useEventContext();
  const [selectedEventId, setSelectedEventId] = useState('');
  const [resultState, setResultState] = useState('idle');
  const [resultData, setResultData] = useState(null);
  const [manualId, setManualId] = useState('');
  const [scannerActive, setScannerActive] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const [attendeesData, setAttendeesData] = useState([]);
  const [scanResult, setScanResult] = useState(null);
  const [recentCheckIns, setRecentCheckIns] = useState([]);
  const html5QrCodeRef = useRef(null);

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId),
    [events, selectedEventId]
  );

  useEffect(() => {
    if (!selectedEventId && events.length > 0) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  const eventAttendees = useMemo(
    () => attendeesData.filter((attendee) => attendee.eventId === selectedEventId),
    [attendeesData, selectedEventId]
  );

  const checkedInAttendees = useMemo(
    () => eventAttendees.filter((attendee) => attendee.checkedIn),
    [eventAttendees]
  );

  const totalRegistered = eventAttendees.length;
  const checkedInCount = checkedInAttendees.length;
  const remaining = Math.max(totalRegistered - checkedInCount, 0);
  const attendanceRate = totalRegistered
    ? Math.round((checkedInCount / totalRegistered) * 100)
    : 0;

  const resetResultPanel = () => {
    setScanResult(null);
    setResultState('idle');
    setResultData(null);
  };

  const updateStats = () => {
    setAttendeesData((prev) => [...prev]);
  };

  const handleScanResult = async (scannedText) => {
    stopScanner();

    const normalizedText = (scannedText || '').trim();
    if (!normalizedText) {
      setResultState('invalid');
      setResultData({ bookingId: '' });
      return;
    }

    try {
      const ticket = await checkinService.checkInWithQr(normalizedText);

      if (ticket.eventId && selectedEventId && ticket.eventId !== selectedEventId) {
        setResultState('invalid');
        setResultData({ bookingId: ticket.bookingId });
        return;
      }

      setAttendeesData((prev) => {
        const exists = prev.find((a) => a.id === ticket.id);
        if (exists) {
          return prev.map((a) => (a.id === ticket.id ? ticket : a));
        }
        return [ticket, ...prev];
      });

      setScanResult({ type: 'success', attendee: ticket });
      setResultState('success');
      setResultData(ticket);
      setRecentCheckIns((prev) => [ticket, ...prev.slice(0, 9)]);
      updateStats();
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('Already checked in')) {
        const existing = attendeesData.find((a) => a.qrCode === normalizedText);
        if (existing) {
          setScanResult({ type: 'already', attendee: existing });
          setResultState('already');
          setResultData(existing);
        } else {
          setResultState('already');
        }
      } else if (msg.includes('Ticket not found')) {
        setScanResult({ type: 'invalid', scannedText: normalizedText });
        setResultState('invalid');
        setResultData({ bookingId: normalizedText });
      } else {
        setScannerError(`Could not check in: ${msg}`);
        setResultState('invalid');
        setResultData({ bookingId: normalizedText });
      }
    }
  };

  const handleCheckIn = async (rawValue) => {
    const normalizedBookingId = rawValue.trim().toUpperCase();
    if (!normalizedBookingId) return;

    const matchedAttendee = attendeesData.find(
      (attendee) =>
        attendee.eventId === selectedEventId &&
        (attendee.bookingId === normalizedBookingId ||
          attendee.id.toUpperCase() === normalizedBookingId)
    );

    if (!matchedAttendee) {
      setResultState('invalid');
      setResultData({ bookingId: normalizedBookingId });
      return;
    }

    if (matchedAttendee.checkedIn) {
      setResultState('already');
      setResultData(matchedAttendee);
      return;
    }

    try {
      const ticket = await checkinService.checkInWithQr(matchedAttendee.qrCode);
      setAttendeesData((prev) =>
        prev.map((attendee) =>
          attendee.id === matchedAttendee.id ? ticket : attendee
        )
      );
      setResultState('success');
      setResultData(ticket);
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('Already checked in')) {
        setResultState('already');
        setResultData(matchedAttendee);
      } else {
        setScannerError(`Could not check in: ${msg}`);
        setResultState('invalid');
        setResultData({ bookingId: normalizedBookingId });
      }
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualId.trim()) return;
    handleCheckIn(manualId);
    setManualId('');
  };

  const startScanner = async () => {
    setScannerError('');
    try {
      const isSecureContext = window.isSecureContext ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      if (!isSecureContext) {
        setScannerError('Camera requires HTTPS. Please use localhost for development or deploy to HTTPS.');
        return;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setScannerError('Camera not supported in this browser. Use Chrome or Firefox.');
        return;
      }

      const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
      (tempStream.getTracks() || []).forEach((track) => track.stop());

      const element = document.getElementById('qr-reader');
      if (!element) {
        setScannerError('Scanner element not found. Please refresh the page.');
        return;
      }

      // Ensure qr-reader div is visible before scanner starts rendering video.
      setScannerActive(true);
      await new Promise((resolve) => window.setTimeout(resolve, 50));

      if (html5QrCodeRef.current) {
        try {
          await html5QrCodeRef.current.stop();
        } catch (_e) {
          // ignore
        }
        html5QrCodeRef.current = null;
      }

      html5QrCodeRef.current = new Html5Qrcode('qr-reader');

      const config = {
        fps: 10,
        qrbox: { width: 220, height: 220 },
        disableFlip: false,
      };

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          handleScanResult(decodedText);
        },
        () => {}
      );

      window.setTimeout(() => {
        const video = document.querySelector('#qr-reader video');
        if (video) {
          video.style.width = '100%';
          video.style.height = 'auto';
          video.style.minHeight = '250px';
          video.style.display = 'block';
          video.style.objectFit = 'cover';
        }

        const qrDiv = document.getElementById('qr-reader');
        if (qrDiv) {
          qrDiv.style.width = '100%';
          qrDiv.style.border = 'none';
        }
      }, 500);

      setScannerActive(true);
      setScannerError('');
    } catch (err) {
      console.error('Camera error:', err);
      setScannerActive(false);

      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setScannerError('Camera permission denied. Please allow camera access in your browser settings and try again.');
      } else if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
        setScannerError('No camera found on this device.');
      } else if (err?.name === 'NotReadableError' || err?.name === 'TrackStartError') {
        setScannerError('Camera is already in use by another application. Close other apps using the camera and try again.');
      } else if (err?.name === 'OverconstrainedError') {
        setScannerError('Camera constraints not satisfied. Trying with default camera...');
        try {
          await html5QrCodeRef.current.start(
            { facingMode: 'user' },
            { fps: 10, qrbox: 250 },
            (decodedText) => handleScanResult(decodedText),
            () => {}
          );

          window.setTimeout(() => {
            const video = document.querySelector('#qr-reader video');
            if (video) {
              video.style.width = '100%';
              video.style.height = 'auto';
              video.style.minHeight = '250px';
              video.style.display = 'block';
              video.style.objectFit = 'cover';
            }

            const qrDiv = document.getElementById('qr-reader');
            if (qrDiv) {
              qrDiv.style.width = '100%';
              qrDiv.style.border = 'none';
            }
          }, 500);

          setScannerActive(true);
          setScannerError('');
        } catch (retryErr) {
          setScannerActive(false);
          setScannerError('Could not start camera: ' + retryErr.message);
        }
      } else {
        setScannerError('Could not start camera: ' + (err?.message || 'Unknown error'));
      }
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        const state = html5QrCodeRef.current.getState();
        if (state === 2) {
          await html5QrCodeRef.current.stop();
        }
      } catch (err) {
        console.error('Stop scanner error:', err);
      } finally {
        html5QrCodeRef.current = null;
      }
    }
    setScannerActive(false);
  };

  useEffect(() => {
    resetResultPanel();
    setManualId('');
    setScannerError('');
  }, [selectedEventId]);

  useEffect(() => {
    const loadAttendees = async () => {
      if (!selectedEventId) return;
      try {
        const tickets = await checkinService.getTicketsByEvent(selectedEventId);
        setAttendeesData(tickets);
      } catch (err) {
        console.error('Failed to load attendees', err);
        setScannerError('Failed to load attendees for this event');
      }
    };
    loadAttendees();
  }, [selectedEventId]);

  useEffect(() => {
    const latest = [...checkedInAttendees]
      .sort((a, b) => {
        const aTime = a.checkedInTime || '00:00';
        const bTime = b.checkedInTime || '00:00';
        return bTime.localeCompare(aTime);
      })
      .slice(0, 10);
    setRecentCheckIns(latest);
  }, [checkedInAttendees]);

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        try {
          html5QrCodeRef.current.stop().catch(() => {});
        } catch (_e) {
          // ignore
        }
      }
    };
  }, []);

  const renderResultPanel = () => {
    if (resultState === 'idle') {
      return (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
          <ScanLine className="mb-3 h-12 w-12 text-gray-300" />
          <p className="text-lg font-semibold text-gray-500">Waiting for scan...</p>
          <p className="mt-2 max-w-xs text-sm text-gray-400">
            Scan a QR code or enter a booking ID manually
          </p>
        </div>
      );
    }

    if (resultState === 'success') {
      return (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
          <h3 className="mt-3 text-2xl font-bold text-green-800">Checked In Successfully!</h3>
          <div className="mt-4 space-y-2 text-sm text-green-900">
            <p className="text-base font-bold text-[#1A1A2E]">{resultData?.name}</p>
            <div>
              <Badge variant="success">{resultData?.ticketType}</Badge>
            </div>
            <p>
              <span className="font-semibold">Event:</span> {selectedEvent?.title}
            </p>
            <p>
              <span className="font-semibold">Check-in Time:</span> {resultData?.checkedInTime}
            </p>
            <p>
              <span className="font-semibold">Booking ID:</span> {resultData?.bookingId}
            </p>
          </div>
        </div>
      );
    }

    if (resultState === 'already') {
      return (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <AlertTriangle className="h-12 w-12 text-amber-600" />
          <h3 className="mt-3 text-2xl font-bold text-amber-800">Already Checked In</h3>
          <div className="mt-4 space-y-2 text-sm text-amber-900">
            <p className="text-base font-bold text-[#1A1A2E]">{resultData?.name}</p>
            <p>
              <span className="font-semibold">Original Check-in Time:</span> {resultData?.checkedInTime}
            </p>
            <p>
              <span className="font-semibold">Booking ID:</span> {resultData?.bookingId}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <XCircle className="h-12 w-12 text-red-600" />
        <h3 className="mt-3 text-2xl font-bold text-red-800">Invalid Ticket</h3>
        <p className="mt-4 text-sm text-red-900">
          This QR code is not valid or does not belong to this event
        </p>
        <p className="mt-2 text-sm text-red-900">
          <span className="font-semibold">Booking ID:</span> {resultData?.bookingId || 'N/A'}
        </p>
      </div>
    );
  };

  const handleRefreshRecent = () => {
    setAttendeesData((prev) => [...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-[#1A1A2E]">Check-in Scanner</h2>
        <p className="mt-1 text-sm text-gray-500">Scan QR codes to check in attendees</p>
      </div>

      {/* Section 1 - Event Selector */}
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <label className="mb-2 block text-sm font-semibold text-gray-600">Select Event</label>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#E8441A] md:w-[380px]"
        >
          <option value="" disabled>
            {eventsLoading ? 'Loading events...' : 'Select an event'}
          </option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
        {selectedEvent && (
          <div className="mt-3 rounded-xl bg-[#F8F9FA] p-4 text-sm text-gray-600">
            <p className="font-semibold text-[#1A1A2E]">{selectedEvent.title}</p>
            <p className="mt-1">
              {formatDate(selectedEvent.date)} | {selectedEvent.location}
            </p>
          </div>
        )}
      </section>

      {/* Section 2 - Live Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Total Registered',
            value: totalRegistered,
            icon: Users,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
          },
          {
            label: 'Checked In',
            value: checkedInCount,
            icon: UserCheck,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
          },
          {
            label: 'Remaining',
            value: remaining,
            icon: Clock,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
          },
          {
            label: 'Attendance Rate %',
            value: `${attendanceRate}%`,
            icon: TrendingUp,
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
          },
        ].map(({ label, value, icon: Icon, iconBg, iconColor }) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-500">{label}</p>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-[#1A1A2E]">{value}</p>
          </div>
        ))}
      </section>

      {/* Section 3 - Scanner and Result */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Left Column - QR Scanner */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-[#1A1A2E]">QR Scanner</h3>

          <div className="mt-5 flex justify-center">
            <div
              className="w-full border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden bg-black relative"
              style={{ minHeight: '300px' }}
            >
              {/* Idle placeholder - shown when scanner not active */}
              {!scannerActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
                  <QrCode size={48} className="text-gray-300 mb-3" />
                  <p className="font-semibold text-gray-600">Ready to Scan</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Click Start Scanner to activate camera
                  </p>
                </div>
              )}

              {/* QR reader div - always in DOM, shown when active */}
              <div
                id="qr-reader"
                style={{
                  display: scannerActive ? 'block' : 'none',
                  width: '100%',
                  minHeight: '300px',
                }}
              ></div>
            </div>
          </div>

          {!scannerActive && (
            <p className="mt-2 text-center text-xs text-gray-400">
              Make sure to allow camera access when prompted by the browser.
              Use HTTPS or localhost for camera to work.
            </p>
          )}

          {scannerError && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-600 text-sm">{scannerError}</p>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            {!scannerActive ? (
              <button
                onClick={startScanner}
                className="flex items-center gap-2 bg-[#E8441A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C73A15] transition-all duration-200"
              >
                <QrCode size={20} />
                Start Scanner
              </button>
            ) : (
              <button
                onClick={stopScanner}
                className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all duration-200"
              >
                <X size={20} />
                Stop Scanner
              </button>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                stopScanner();
                resetResultPanel();
              }}
            >
              Reset State
            </Button>
          </div>

          <div className="my-6 text-center text-xs font-semibold tracking-[0.2em] text-gray-400">
            --- OR ENTER MANUALLY ---
          </div>

          <form onSubmit={handleManualSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Input
              className="flex-1"
              label="Booking ID"
              placeholder="Enter Booking ID"
              value={manualId}
              onChange={(e) => setManualId(e.target.value.toUpperCase())}
            />
            <div className="flex gap-2 sm:pb-0.5">
              <Button type="submit" variant="secondary">
                Check In
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setManualId('');
                  resetResultPanel();
                }}
              >
                Clear
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column - Result Panel */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-[#1A1A2E]">Result Panel</h3>
          <div className="mt-4">{renderResultPanel()}</div>
        </div>
      </section>

      {/* Section 4 - Recent Check-ins */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#1A1A2E]">Recent Check-ins</h3>
          <button
            onClick={handleRefreshRecent}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-[#1A1A2E]"
            title="Refresh"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
        </div>

        {recentCheckIns.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
            No check-ins yet for this event
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {recentCheckIns.map((attendee) => (
              <div
                key={attendee.id}
                className="flex flex-col gap-3 rounded-2xl border border-green-100 bg-green-50/60 p-4 md:flex-row md:items-center"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A2E] text-sm font-bold text-white">
                  {attendee.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[#1A1A2E]">{attendee.name}</p>
                  <p className="truncate text-sm text-gray-500">{attendee.email}</p>
                </div>

                <Badge variant="success">{attendee.ticketType}</Badge>

                <div className="inline-flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{attendee.checkedInTime || '-'}</span>
                </div>

                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CheckInScanner;