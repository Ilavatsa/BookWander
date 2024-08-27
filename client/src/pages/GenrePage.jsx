import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const GenrePage = () => {
    const { id } = useParams();
    const [books, setBooks] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/genres/${id}/books`)
        .then(response => {
            setBooks(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the books!', error);
        });
    }, [id]);

    return (
        <div>
            <h1>Books in this Genre</h1>
            <ul>
                {books.map(book => (
                    <li key={book.id}>{book.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default GenrePage;
