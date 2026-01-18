import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { MapPin, Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if email is verified (except for admin)
      if (!userCredential.user.emailVerified && email !== ADMIN_EMAIL) {
        setError('Please verify your email before logging in. Check your inbox.');
        await auth.signOut();
        setLoading(false);
        return;
      }
      
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Invalid email or password');
      console.error('Login error:', err);
    }
  };

  const handleSignUp = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        role: 'customer',
        createdAt: new Date().toISOString()
      });
      
      // Send verification email
      await sendEmailVerification(userCredential.user);
      
      // Sign out user until they verify
      await auth.signOut();
      
      setVerificationSent(true);
      setLoading(false);
      setError('');
    } catch (err) {
      setLoading(false);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already exists. Please login instead.');
      } else {
        setError('Failed to create account. Please try again.');
      }
      console.error('Signup error:', err);
    }
  };

  const handleSubmit = () => {
    if (isSignUp) {
      handleSignUp();
    } else {
      handleLogin();
    }
  };

  // Verification sent screen
  if (verificationSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{backgroundColor: '#eb3030'}}>
              <Mail className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-light text-gray-800 mb-2">Verify Your Email</h1>
            <p className="text-gray-500 text-sm">We've sent you a verification link</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              <p className="font-medium mb-2">✅ Account created successfully!</p>
              <p>Please check your email inbox and click the verification link to activate your account.</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <p className="font-medium mb-2">📧 Check your email:</p>
              <p className="mb-2 font-semibold">{email}</p>
              <p className="text-xs">Didn't receive it? Check your spam folder.</p>
            </div>
            
            <button
              onClick={() => {
                setVerificationSent(false);
                setIsSignUp(false);
                setEmail('');
                setPassword('');
              }}
              className="w-full py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-white"
              style={{backgroundColor: '#eb3030'}}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Login/Signup screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{backgroundColor: '#eb3030'}}>
            <MapPin className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-light text-gray-800 mb-2">Paradise Tours</h1>
          <p className="text-gray-500 text-sm">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="text-gray-400" size={20} />
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-400" size={20} />
              </div>
              <input
                type="password"
                placeholder={isSignUp ? "Create a password (min 6 characters)" : "Enter your password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && email && password.length >= 6) {
                    handleSubmit();
                  }
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={loading || !email || password.length < 6}
            className="w-full py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            style={{backgroundColor: '#eb3030'}}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>{isSignUp ? 'Creating Account...' : 'Logging in...'}</span>
              </>
            ) : (
              <span>{isSignUp ? 'Create Account' : 'Login'}</span>
            )}
          </button>
          
          <div className="text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-sm hover:underline"
              style={{color: '#eb3030'}}
              disabled={loading}
            >
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
