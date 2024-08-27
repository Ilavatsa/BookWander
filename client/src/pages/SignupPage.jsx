import React, { useState } from 'react';
import './Signup.css'

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        console.log('User created successfully', data);
        alert('Signup successful!');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup">
      <h2>Sign up</h2>
    <form onSubmit={handleSubmit} className='Sign'>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        required
      >
        <option value="user">Reader</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
    </form>
    </div>
  );
};

export default SignupForm;

