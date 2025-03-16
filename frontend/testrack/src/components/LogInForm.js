import React, { useState } from 'react';
import axios from 'axios';

const LogInForm = ({ handleSignIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const validateForm = () => {
    if (!username || !password) {
      setError('Username and password are required');
      return false;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    let status = isLogin ? 'login' : 'signup';

    try {
        const endpoint = `http://localhost:8000/validate/${username}/${password}/${status}`;
    
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Validation failed");
        }
    
        const data = await response.json();
        console.log("Validation response:", data);
    
        var d = {
            "name": username,
        };
        if (isLogin) {
            d["data"] = data.userData;
        }
        handleSignIn(d);
        return d;
    } catch (error) {
        console.error("Error during validation:", error);
        setError(error.message || 'An error occurred during authentication');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {isLogin ? 'Log In' : 'Sign Up'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        
        {!isLogin && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>
        )}
        
        <div className="mb-6">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <span>Processing...</span>
            ) : isLogin ? (
              'Log In'
            ) : (
              'Sign Up'
            )}
          </button>
        </div>
      </form>
      
      <div className="text-center">
        <button
          onClick={toggleMode}
          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
        >
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
        </button>
      </div>
    </div>
  );
};

export default LogInForm;