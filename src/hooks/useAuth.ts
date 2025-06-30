import { useEffect, useState } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('jwtToken'));

  useEffect(() => {
    const checkToken = () => {
      setIsAuthenticated(!!localStorage.getItem('jwtToken'));
    };
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  return isAuthenticated;
}
