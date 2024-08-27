import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BookPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);

    useEffect(() => {
        // Fetch the book details from your API
        fetch(`/api/books/${id}`)
            .then(response => response.json())
            .then(data => setBook(data))
            .catch(error => console.error('Error fetching book:', error));
    }, [id]);

    const handleAddToLibrary = () => {
        // Add book to user's library via your API
        fetch('/api/library', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookId: id })
        })
        .then(() => alert('Book added to library!'))
        .catch(error => console.error('Error adding book to library:', error));
    };

    const handleDeleteFromLibrary = () => {
        // Remove book from user's library via your API
        fetch(`/api/library/${id}`, { method: 'DELETE' })
            .then(() => alert('Book removed from library!'))
            .catch(error => console.error('Error removing book from library:', error));
    };

    if (!book) return <div>Loading...</div>;

    return (
        <div>
            <h1>{book.title}</h1>
            <p>{book.description}</p>
            <button onClick={handleAddToLibrary}>Add to Library</button>
            <button onClick={handleDeleteFromLibrary}>Remove from Library</button>
        </div>
    );
};

export default BookPage;
