from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from models import db, Book, Library, LibraryBooks

app = Flask(__name__)
app.config.from_object('config.Config')  # Load configuration from config.py
db.init_app(app)

@app.route('/api/books/<int:id>', methods=['GET'])
def get_book(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({'message': 'Book not found'}), 404
    return jsonify({
        'id': book.id,
        'title': book.title,
        'author': book.author,
        'genre': book.genre,
        'description': book.description
    })

@app.route('/api/library', methods=['POST'])
def add_to_library():
    data = request.get_json()
    user_id = data.get('user_id')
    book_id = data.get('book_id')

    if not user_id or not book_id:
        return jsonify({'message': 'User ID and Book ID are required'}), 400

    library = Library.query.filter_by(user_id=user_id).first()
    if not library:
        library = Library(user_id=user_id)
        db.session.add(library)
    
    book = Book.query.get(book_id)
    if not book:
        return jsonify({'message': 'Book not found'}), 404

    if book not in library.books:
        library.books.append(book)
        db.session.commit()

    return jsonify({'message': 'Book added to library'})

@app.route('/api/library/<int:book_id>', methods=['DELETE'])
def remove_from_library(book_id):
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'message': 'User ID is required'}), 400

    library = Library.query.filter_by(user_id=user_id).first()
    if not library:
        return jsonify({'message': 'Library not found'}), 404

    book = Book.query.get(book_id)
    if not book:
        return jsonify({'message': 'Book not found'}), 404

    if book in library.books:
        library.books.remove(book)
        db.session.commit()
    
    return jsonify({'message': 'Book removed from library'})

@app.route('/api/library', methods=['GET'])
def get_library():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'message': 'User ID is required'}), 400

    library = Library.query.filter_by(user_id=user_id).first()
    if not library:
        return jsonify({'message': 'Library not found'}), 404

    books = [{'id': b.id, 'title': b.title, 'author': b.author, 'genre': b.genre} for b in library.books]
    return jsonify(books)

if __name__ == '__main__':
    app.run(debug=True)
