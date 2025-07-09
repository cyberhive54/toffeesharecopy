import { Link } from 'wouter';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-brand-blue mb-4">ShareWave</h3>
            <p className="text-slate-300 mb-4">
              Secure, private, and instant file sharing powered by peer-to-peer technology. 
              Share files without limits, without storage, without compromising your privacy.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com/sharewave" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Follow us on Twitter"
              >
                <i className="fab fa-twitter text-xl" />
              </a>
              <a 
                href="https://github.com/sharewave/sharewave" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="View source on GitHub"
              >
                <i className="fab fa-github text-xl" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <a href="#security" className="text-slate-300 hover:text-white transition-colors">
                  Security
                </a>
              </li>
              <li>
                <a href="#api" className="text-slate-300 hover:text-white transition-colors">
                  API
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-slate-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-slate-300 hover:text-white transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">© {currentYear} ShareWave. All rights reserved.</p>
          <p className="text-slate-400 text-sm mt-2 md:mt-0">Built with ❤️ for privacy and security</p>
        </div>
      </div>
    </footer>
  );
}
