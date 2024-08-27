import React, { useState, useEffect } from 'react';

const LibraryPage = () => {
    const [library, setLibrary] = useState([]);

    useEffect(() => {
        // Fetch the books in user's library from your API
        fetch('/api/library')
            .then(response => response.json())
            .then(data => setLibrary(data))
            .catch(error => console.error('Error fetching library:', error));
    }, []);

    return (
        <div>
            <h1>Your Library</h1>
            <ul>
                {library.map(book => (
                    <li key={book.id}>
                        <h2>{book.title}</h2>
                        <p>{book.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LibraryPage;
