import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import Todo from './components/todo';

function SignOutComponent() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <button onClick={handleClick}>Sign Out</button>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Sidebar */}
        <nav style={{
          width: '200px',
          backgroundColor: '#2c3e50',
          padding: '20px',
          color: '#fff'
        }}>
          <h2>My App</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: '40px 0' }}>
            <li style={{ margin: '20px 0' }}>
              <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
            </li>
            <li style={{ margin: '20px 0' }}>
              <Link to="/todo" style={{ color: '#fff', textDecoration: 'none' }}>Todo</Link>
            </li>
            <hr style={{ margin: '50px 0' }}></hr>
            <li style={{ margin: '-20px 0' }}>
              <SignOutComponent />
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/todo"
              element={
                <PrivateRoute>
                  <Todo />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;