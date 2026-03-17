import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getPasswordStrength } from '../../utils/helpers';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'attendee', terms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = getPasswordStrength(form.password);

  const updateField = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }));
    setAuthError('');
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.terms) e.terms = 'You must accept the terms to continue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await register({ name: form.name, email: form.email, password: form.password, role: form.role });
      if (user.role === 'admin' || user.role === 'organizer') navigate('/admin');
      else navigate('/events');
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460] flex-col justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-72 h-72 bg-[#E8441A]/20 rounded-full top-1/4 -left-16 blur-3xl" />
          <div className="absolute w-48 h-48 bg-[#F5A623]/15 rounded-full bottom-1/4 right-0 blur-2xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[#E8441A] flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl">EventPro</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Join 10,000+<br /><span className="text-[#E8441A]">Event Creators</span>
          </h2>
          <p className="text-gray-400 leading-relaxed mb-10">
            Whether you're hosting your first meetup or managing a large conference, EventPro gives you everything you need.
          </p>
          {/* Testimonial */}
          <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
            <p className="text-white/80 text-sm italic leading-relaxed mb-4">
              "EventPro helped us sell out our 500-seat conference in just 3 days! The check-in scanner alone saved us hours of manual work."
            </p>
            <div className="flex items-center gap-3">
              <img src="https://picsum.photos/seed/t2/40/40" alt="Shruti" className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-white text-sm font-semibold">Shruti Menon</p>
                <p className="text-gray-400 text-xs">Event Manager, Nasscom</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#E8441A] flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-[#1A1A2E]">EventPro</span>
          </div>

          <h2 className="text-3xl font-bold text-[#1A1A2E] mb-2">Create your account</h2>
          <p className="text-gray-500 mb-6">Start managing events in minutes</p>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {authError}
            </div>
          )}

          {/* Role Selector */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-[#1A1A2E] mb-2 block">I am joining as</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'attendee', label: '🙋 Attendee', desc: 'Discover & attend events' },
                { value: 'organizer', label: '🎪 Organiser', desc: 'Create & manage events' },
              ].map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateField('role', value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                    form.role === value
                      ? 'border-[#E8441A] bg-[#E8441A]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="text-sm font-bold text-[#1A1A2E]">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" placeholder="Arjun Sharma" value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              error={errors.name} leftIcon={User} required />
            <Input label="Email Address" type="email" placeholder="you@example.com"
              value={form.email} onChange={(e) => updateField('email', e.target.value)}
              error={errors.email} leftIcon={Mail} required />
            <div>
              <Input label="Password" type="password" placeholder="Create a strong password"
                value={form.password} onChange={(e) => updateField('password', e.target.value)}
                error={errors.password} leftIcon={Lock} required />
              {/* Password Strength Indicator */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.score}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${
                      passwordStrength.label === 'Strong' ? 'text-green-600' :
                      passwordStrength.label === 'Good' ? 'text-blue-600' :
                      passwordStrength.label === 'Fair' ? 'text-yellow-600' : 'text-red-600'
                    }`}>{passwordStrength.label}</span>
                  </div>
                </div>
              )}
            </div>
            <Input label="Confirm Password" type="password" placeholder="Repeat your password"
              value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)}
              error={errors.confirmPassword} leftIcon={Lock} required />

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={form.terms}
                  onChange={(e) => updateField('terms', e.target.checked)}
                  className="mt-0.5 rounded border-gray-300 text-[#E8441A] focus:ring-[#E8441A]" />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link to="/" className="text-[#E8441A] hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/" className="text-[#E8441A] hover:underline">Privacy Policy</Link>
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms}</p>}
            </div>

            <Button type="submit" variant="primary" fullWidth loading={loading} rightIcon={ArrowRight}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#E8441A] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
