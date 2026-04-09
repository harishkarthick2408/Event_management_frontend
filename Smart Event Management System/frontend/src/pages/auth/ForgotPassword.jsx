import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Lock, CheckCircle, Zap } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { authService } from '../../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const validate = () => {
    if (!email) { setError('Email is required'); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      // Countdown for resend
      let countdown = 60;
      setResendTimer(countdown);
      const timer = setInterval(() => {
        countdown--;
        setResendTimer(countdown);
        if (countdown <= 0) clearInterval(timer);
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      let countdown = 60;
      setResendTimer(countdown);
      const timer = setInterval(() => {
        countdown--;
        setResendTimer(countdown);
        if (countdown <= 0) clearInterval(timer);
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Back link */}
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#E8441A] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#E8441A] flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-[#1A1A2E]">EventPro</span>
          </div>

          {!sent ? (
            <>
              {/* Lock Icon */}
              <div className="w-16 h-16 bg-[#E8441A]/10 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-[#E8441A]" />
              </div>

              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">Forgot your password?</h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                No worries! Enter your email address and we'll send you a link to reset your password.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  error={error && !email ? error : ''}
                  leftIcon={Mail}
                  required
                />
                <Button type="submit" variant="primary" fullWidth loading={loading}>
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center">
              {/* Animated checkmark */}
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
              </div>

              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">Check your email</h2>
              <p className="text-gray-500 text-sm mb-2">We sent a reset link to</p>
              <p className="font-semibold text-[#1A1A2E] mb-6">{email}</p>
              <p className="text-gray-400 text-xs mb-8 leading-relaxed">
                The link will expire in 24 hours. If you don't see the email, check your spam folder.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                  className="w-full text-sm text-[#E8441A] hover:underline disabled:text-gray-400 disabled:no-underline"
                >
                  {resendTimer > 0
                    ? `Resend email in ${resendTimer}s`
                    : 'Didn\'t receive it? Resend'}
                </button>
                <Link to="/login">
                  <Button variant="primary" fullWidth>Back to Login</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
