import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link> | 
      <Link to="/register">Register</Link> | 
      <Link to="/">Login</Link> | 
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

export default Navbar;
