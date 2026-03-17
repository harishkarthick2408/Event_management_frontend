import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Zap, ArrowRight, Cpu, Calendar, Users, BarChart2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const updateField = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }));
    setAuthError('');
  };

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin' || user.role === 'organizer') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (email, password) => {
    setForm({ email, password });
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin' || user.role === 'organizer') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460] flex-col justify-between p-12 relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-[#E8441A]/20 rounded-full -top-20 -left-20 blur-3xl" />
          <div className="absolute w-64 h-64 bg-[#F5A623]/10 rounded-full bottom-20 right-20 blur-2xl" />
          {[...Array(6)].map((_, i) => (
            <div key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{ top: `${15 + i * 14}%`, right: `${10 + (i % 3) * 8}%` }}
            />
          ))}
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8441A] flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-xl">EventPro</span>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Manage Events<br /><span className="text-[#E8441A]">Like a Pro</span>
          </h1>
          <p className="text-gray-400 leading-relaxed mb-8">
            Create, promote, and analyse events all in one place. Trusted by 10,000+ organisers across India.
          </p>
          {/* Feature List */}
          <div className="space-y-4">
            {[
              { icon: Calendar, label: 'Create & manage unlimited events' },
              { icon: Users, label: 'Smart attendee management & check-in' },
              { icon: BarChart2, label: 'Real-time analytics & reports' },
              { icon: Cpu, label: 'AI-powered event recommendations' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-white/80">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-[#E8441A]" />
                </div>
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[['500+', 'Events'], ['50K+', 'Attendees'], ['4.9★', 'Rating']].map(([num, label]) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-white">{num}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#E8441A] flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-[#1A1A2E]">EventPro</span>
          </div>

          <h2 className="text-3xl font-bold text-[#1A1A2E] mb-2">Welcome back</h2>
          <p className="text-gray-500 mb-8">Sign in to your account to continue</p>

          {/* Auth Error */}
          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {authError}
            </div>
          )}

          {/* Quick Login Hint */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700 space-y-1">
            <p className="font-semibold">Quick Login (Demo):</p>
            <button onClick={() => quickLogin('admin@zoho.com', 'admin123')} className="block hover:underline">
              👨‍💼 Admin: admin@zoho.com / admin123
            </button>
            <button onClick={() => quickLogin('arjun@gmail.com', 'user123')} className="block hover:underline">
              🙋 Attendee: arjun@gmail.com / user123
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email Address" type="email" placeholder="you@example.com"
              value={form.email} onChange={(e) => updateField('email', e.target.value)}
              error={errors.email} leftIcon={Mail} required />
            <Input label="Password" type="password" placeholder="Enter your password"
              value={form.password} onChange={(e) => updateField('password', e.target.value)}
              error={errors.password} leftIcon={Lock} required />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-[#E8441A] focus:ring-[#E8441A]" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-[#E8441A] hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" fullWidth loading={loading} rightIcon={ArrowRight}>
              Sign In
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google Button (UI only) */}
          <button className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#E8441A] font-semibold hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
