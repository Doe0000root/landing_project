import { useEffect, useState } from 'react';
import { api } from './lib/api';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import BuyInsurance from './pages/BuyInsurance';

type Page = 'landing' | 'login' | 'register' | 'profile' | 'buy-insurance';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      verifyToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await api.auth.verify(token);
      if (response.user) {
        setUser(response.user);
        setToken(token);
      } else {
        localStorage.removeItem('token');
      }
    } catch {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setCurrentPage('landing');
  };

  const handleLoginSuccess = (user: any, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('token', token);
    setCurrentPage('landing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
      />
      {currentPage === 'landing' && <Landing onNavigate={handleNavigate} user={user} />}
      {currentPage === 'login' && <Login onNavigate={handleNavigate} onSuccess={handleLoginSuccess} />}
      {currentPage === 'register' && <Register onNavigate={handleNavigate} onSuccess={handleLoginSuccess} />}
      {currentPage === 'profile' && user && <Profile onNavigate={handleNavigate} user={user} token={token} />}
      {currentPage === 'buy-insurance' && user && <BuyInsurance onNavigate={handleNavigate} user={user} token={token} />}
    </div>
  );
}

export default App;
