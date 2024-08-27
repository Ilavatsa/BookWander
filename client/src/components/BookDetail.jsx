import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/books/${id}`)
        .then(response => {
            setBook(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the book details!', error);
        });
    }, [id]);

    if (!book) return <div>Loading...</div>;

    return (
        <div>
            <h1>{book.title}</h1>
            <h2>By {book.author}</h2>
            <h3>Genre: {book.genre}</h3>
            <p>{book.content}</p>
        </div>
    );
}

export default BookDetail;
