import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Author = ({ isLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = isLogin ? 'http://localhost:5000/login' : 'http://localhost:5000/register';
        axios.post(url, { email, password })
            .then(response => {
                localStorage.setItem('token', response.data.access_token);
                history.push('/');
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    return (
        <div>
            <h1>{isLogin ? 'Login' : 'Register'}</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>
        </div>
    );
}

export default Author;
