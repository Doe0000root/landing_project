import { LogOut, User } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: any) => void;
  user: any;
  onLogout: () => void;
}

export default function Navigation({ currentPage, onNavigate, user, onLogout }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('landing')}
              className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition"
            >
              InsureGuard
            </button>
            <div className="hidden md:flex gap-8">
              <button onClick={() => onNavigate('landing')} className="text-gray-600 hover:text-gray-900">
                Home
              </button>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                About
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Contact
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Blog
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">Profile</span>
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <LogOut size={20} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
