import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:5000/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setUsers(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the users!', error);
        });
    }, []);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Manage Users</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.username} - {user.role} - {user.is_admin ? 'Admin' : 'User'}
                    </li>
                ))}
            </ul>
            {/* Add components to manage books and genres */}
        </div>
    );
}

export default AdminDashboard;
