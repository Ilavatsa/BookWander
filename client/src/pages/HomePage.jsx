import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Assuming you have separated your styles

const HomePage = () => {
    return (
        <div className="homepage">
            <h1>Welcome to the Online Bookstore</h1>
            <p>Your gateway to a world of books and stories.</p>
            
            <div className="homepage-links">
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    );
};

export default HomePage;


