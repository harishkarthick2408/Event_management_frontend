import { Link } from 'react-router-dom';
import { Zap, Twitter, Linkedin, Github, Instagram, Mail } from 'lucide-react';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#1A1A2E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#E8441A] flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span>EventPro</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              The all-in-one platform for creating, managing, and analysing unforgettable events. Built for modern organisers.
            </p>
            {/* Newsletter */}
            <div>
              <p className="text-sm font-semibold mb-3">Stay in the loop</p>
              {subscribed ? (
                <p className="text-[#10B981] text-sm font-medium">🎉 Thanks for subscribing!</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#E8441A] transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#E8441A] rounded-xl text-sm font-semibold hover:bg-[#C73A15] transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">Product</h4>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'Events', 'Create Event', 'Analytics'].map(item => (
                <li key={item}>
                  <Link to="/events" className="text-gray-400 text-sm hover:text-white hover:text-[#E8441A] transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">Company</h4>
            <ul className="space-y-3">
              {['About Us', 'Blog', 'Careers', 'Press', 'Partners'].map(item => (
                <li key={item}>
                  <Link to="/" className="text-gray-400 text-sm hover:text-[#E8441A] transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">Support</h4>
            <ul className="space-y-3">
              {['Help Centre', 'Contact Us', 'Privacy Policy', 'Terms of Service', 'Cookies'].map(item => (
                <li key={item}>
                  <Link to="/" className="text-gray-400 text-sm hover:text-[#E8441A] transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 EventPro by Zoho. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[
              { Icon: Twitter, href: 'https://twitter.com' },
              { Icon: Linkedin, href: 'https://linkedin.com' },
              { Icon: Github, href: 'https://github.com' },
              { Icon: Instagram, href: 'https://instagram.com' },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#E8441A] transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
