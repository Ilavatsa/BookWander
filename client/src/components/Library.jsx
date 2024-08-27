import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Library = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Fetch books from the API when the component mounts
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/api/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Library</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <h2>{book.title}</h2>
            <p>Author: {book.author}</p>
            <p>Genre: {book.genre}</p>
            <a href={book.downloadLink} download>
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Library;
