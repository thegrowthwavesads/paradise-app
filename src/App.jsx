import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, ADMIN_EMAIL } from './firebase';
import { Loader2 } from 'lucide-react';

// Import components
import Login from './components/Auth/Login';
import CustomerDashboard from './components/Customer/CustomerDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';

const App = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setUser(user);
        setIsAdmin(user.email === ADMIN_EMAIL);
      } else if (user && user.email === ADMIN_EMAIL) {
        // Admin doesn't need email verification
        setUser(user);
        setIsAdmin(true);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin" size={48} style={{color: '#eb3030'}} />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (isAdmin) {
    return <AdminDashboard user={user} />;
  }

  return <CustomerDashboard user={user} />;
};

export default App;
