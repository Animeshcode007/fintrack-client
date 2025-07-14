// client/src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const SignupPage = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // State for loading and error feedback
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hooks for navigation and authentication context
  const { loadUser } = useAuth();
  const navigate = useNavigate();

  // Destructure for easier access in the form
  const { name, email, password } = formData;

  // A single handler to update the form state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form submission logic
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear previous errors
    setLoading(true);

    try {
      // Make the API call to the registration endpoint
      const res = await api.post('/auth/register', { name, email, password });
      
      // The backend returns a token upon successful registration
      const { token } = res.data;

      // --- Automatic Login Flow ---
      // 1. Store the new token in localStorage
      localStorage.setItem('token', token);

      // 2. Trigger the AuthContext to load the user's data with the new token.
      // This will set isAuthenticated to true and fetch user details.
      await loadUser();

      // 3. Navigate the now-authenticated user to their dashboard
      navigate('/dashboard');

    } catch (err) {
      // Handle errors from the API
      let errorMessage = 'Registration failed. Please try again.';
      if (err.response && err.response.data) {
        // Use the specific error message from the backend if available
        // This could be "User already exists" or a validation error.
        const apiError = err.response.data;
        if (apiError.errors && apiError.errors.length > 0) {
          // Handle validation errors array
          errorMessage = apiError.errors[0].msg;
        } else if (apiError.msg) {
          // Handle single message error
          errorMessage = apiError.msg;
        }
      }
      setError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* This outer div is where you would use a React Bits "Card" component */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center">Create Your Account</h1>
        
        {/* Display error message if it exists */}
        {error && <p className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-md">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            {/* Replace <label> and <input> with your React Bits components */}
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              value={name}
              onChange={handleChange}
              required 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              value={email}
              onChange={handleChange}
              required 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
           <div>
            <label htmlFor="password" className="text-sm font-medium">Password (min 6 characters)</label>
            <input 
              id="password" 
              name="password" 
              type="password"
              value={password}
              onChange={handleChange}
              required
              minLength="6"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          {/* Replace <button> with your React Bits "Button" component */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;