import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookPage from './pages/BookPage'; // Import your BookPage component
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LibraryPage from './pages/LibraryPage';
import UserProfile from './components/UserProfile';
import FirstPage from './pages/FirstPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/books" element={<BookPage />} />
                <Route path="/library" element={<LibraryPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path='/userprofile' element={<UserProfile />} />
                <Route path='/firstpage' element={<FirstPage />} />
            </Routes>
        </Router>
    );
};

export default App;

