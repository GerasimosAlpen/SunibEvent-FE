import { Link } from 'react-router-dom';
import { SunibLogo } from '../assets';

function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-12 mt-12">
      <div className="mx-auto max-w-7xl px-5 flex flex-col md:flex-row justify-between gap-10">
        
        {/* Left Section - Logo & Copyright */}
        <div className="flex flex-col gap-4 max-w-xs">
          <div className="flex items-center gap-2">
            <img src={SunibLogo} alt="SunibEvent Logo" className="h-10" />
          </div>
          <div className="text-sm text-gray-500 mt-2">
            <p>© 2026 Sunib Student Portal.</p>
          </div>
        </div>

        {/* Right Section - Links */}
        <div className="flex gap-16 md:gap-24 flex-wrap">
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-gray-900">Quick Links</h4>
            <Link to="#" className="text-sm text-gray-500 hover:text-orange-400 transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-orange-400 transition-colors">Terms of Service</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-gray-900">Resources</h4>
            <Link to="#" className="text-sm text-gray-500 hover:text-orange-400 transition-colors">Campus Map</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-orange-400 transition-colors">Help Center</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-gray-900">Connect</h4>
            <Link to="#" className="text-sm text-gray-500 hover:text-orange-400 transition-colors">Contact Us</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-orange-400 transition-colors">Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
