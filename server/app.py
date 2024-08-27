from flask import Flask, request, jsonify, make_response
from flask_migrate import Migrate
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.exceptions import BadRequest
from models import db, bcrypt, jwt, User, Vehicle,Ticket,Review
from datetime import datetime
from flask_cors import CORS
import os

app = Flask(__name__)


app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_secret_key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///site.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret_key')


db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)
migrate = Migrate(app, db)
CORS(app)


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not all(k in data for k in ('name', 'email', 'password', 'role')):
        return jsonify({"message": "Missing required fields"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        role=data['role']
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201



@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        raise BadRequest("Email and password are required.")

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        
        return jsonify(access_token=access_token, role=user.role,email=user.email), 200

    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/vehicle/register-matatu', methods=['POST'])
def register_matatu():
    data = request.get_json()

    license_plate = data.get('licensePlate')
    model = data.get('model')
    capacity = data.get('capacity')
    route = data.get('route')
    price = data.get('price')
    mileage = data.get('mileage')
    image_url = data.get('image_url')
    operator_id = data.get('operator_id')  

    if not all([license_plate, model, capacity, route, price, operator_id]):
        return jsonify({"message": "Missing required fields"}), 400

    if Vehicle.query.filter_by(license_plate=license_plate).first():
        return jsonify({"message": "Vehicle already registered with this license plate"}), 400

    new_vehicle = Vehicle(
        license_plate=license_plate,
        model=model,
        capacity=capacity,
        operator_id=operator_id,
        mileage=mileage,
        route=route,
        price=price,
        image_url=image_url
    )

    db.session.add(new_vehicle)
    db.session.commit()

    return jsonify({"message": "Matatu registered successfully"}), 201

@app.route('/vehicles', methods=['GET'])
def get_vehicles():
    vehicle_id = request.args.get('id', type=int)

    if vehicle_id is not None:
        vehicle = Vehicle.query.get(vehicle_id)
        if not vehicle:
            return jsonify({"message": "Vehicle not found"}), 404
        return jsonify(vehicle.to_dict()), 200

    vehicles = Vehicle.query.all()
    vehicles_list = [vehicle.to_dict() for vehicle in vehicles]
    return jsonify(vehicles_list), 200


@app.route('/vehicles/<int:vehicle_id>', methods=['PATCH'])
def update_vehicle(vehicle_id):
    data = request.get_json()

    vehicle = Vehicle.query.get(vehicle_id)

    if not vehicle:
        return jsonify({"message": "Vehicle not found"}), 404

    
    if 'mileage' in data:
        try:
            vehicle.mileage = int(data['mileage'])
        except ValueError:
            return jsonify({"message": "Invalid mileage format, must be an integer."}), 400

    if 'route' in data:
        vehicle.route = data['route']

    try:
        db.session.commit()
        return jsonify(vehicle.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred updating the vehicle", "error": str(e)}), 500



@app.route('/vehicles/<int:id>', methods=['DELETE'])
def delete_vehicle(id):
    vehicle = Vehicle.query.get(id)

    if not vehicle:
        return jsonify({"message": "Vehicle not found"}), 404

    
    Ticket.query.filter_by(vehicle_id=id).delete()

    db.session.delete(vehicle)
    db.session.commit()

    return jsonify({"message": "Vehicle deleted successfully"}), 200


@app.route('/tickets', methods=['POST'])
def create_ticket():
    data = request.json
    travel_date_str = data.get('travelDate')
    travel_time_str = data.get('travelTime')
    user_email = data.get('email')
    vehicle_id = data.get('vehicleId')

    try:
        travel_date = datetime.strptime(travel_date_str, "%Y-%m-%d").date()
        travel_time = datetime.strptime(travel_time_str, "%H:%M:%S").time()
    except ValueError as e:
        return jsonify({"message": "Invalid date or time format"}), 400

    
    user = User.query.filter_by(email=user_email).first()
    if user is None:
        return jsonify({"message": "User not found"}), 404

    
    new_ticket = Ticket(
        travel_date=travel_date,
        travel_time=travel_time,
        user_id=user.id,
        vehicle_id=vehicle_id
    )

    db.session.add(new_ticket)
    db.session.commit()

    return jsonify(new_ticket.to_dict()), 201

@app.route('/tickets', methods=['GET'])
def get_tickets():
    email = request.args.get('email')
    vehicle_id = request.args.get('vehicleId', type=int)

    query = Ticket.query.join(User)

    if email is not None:
        query = query.filter(User.email == email)

    if vehicle_id is not None:
        query = query.filter(Ticket.vehicle_id == vehicle_id)

    tickets = query.all()
    tickets_list = [ticket.to_dict() for ticket in tickets]

    return jsonify(tickets_list), 200

@app.route('/tickets/<int:id>', methods=['DELETE'])
def delete_ticket(id):
    ticket = Ticket.query.get(id)

    if not ticket:
        return jsonify({"message": "Ticket not found"}), 404

    db.session.delete(ticket)
    db.session.commit()

    return jsonify({"message": "Ticket deleted successfully"}), 200


@app.route('/reviews', methods=['POST'])
def add_review():
    data = request.get_json()
    if not all(k in data for k in ('rating', 'review_text', 'email')):
        return jsonify({"message": "Missing required fields"}), 400

    try:
        new_review = Review(
            rating=data['rating'],
            review_text=data['review_text'],
            email=data['email']
        )
        db.session.add(new_review)
        db.session.commit()
        return jsonify({"message": "Review added successfully"}), 201
    except Exception as e:
        db.session.rollback()  
        print(f"Error: {e}")  
        return jsonify({"message": "An error occurred"}), 500
    
@app.route('/reviews', methods=['GET'])
def get_reviews():
    try:
        reviews = Review.query.all()
        reviews_data = [
            {
                "id": review.id,
                "rating": review.rating,
                "review_text": review.review_text,
                "email": review.email
            }
            for review in reviews
        ]
        return jsonify({"reviews": reviews_data}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500    
    
@app.route('/vehicles/count', methods=['GET'])
def get_vehicle_count():
    count = Vehicle.query.count()
    return jsonify({'count': count})

@app.route('/reviews/count', methods=['GET'])
def get_review_count():
    count = Review.query.count()
    return jsonify({'count': count})    


if __name__ == "__main__":
    app.run(port=5000, debug=True)