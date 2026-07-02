import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/api/auth/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {      
      setUser(res.data.user);
    })
    .catch(err => {
      console.error('Error fetching user info:', err);
    });
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.userName}</p>
      {/* Display other user info */}
    </div>
  );
}

export default Dashboard;