from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    
    vehicles = db.relationship('Vehicle', order_by='Vehicle.id', back_populates='operator')
    tickets = db.relationship('Ticket', back_populates='user')

    def __init__(self, name, email, password, role):
        self.name = name
        self.email = email
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
        self.role = role

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)
    
    
    
    
class Vehicle(db.Model):
    __tablename__ = 'vehicles'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    license_plate = db.Column(db.String(15), unique=True, nullable=False)
    model = db.Column(db.String(50), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    operator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    mileage = db.Column(db.Integer, nullable=True)  
    route = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    image_url = db.Column(db.String(255), nullable=True)

    operator = db.relationship('User', back_populates='vehicles')
    tickets = db.relationship('Ticket', back_populates='vehicle')

    def __repr__(self):
        return f"<Vehicle {self.license_plate} - {self.model}>"
    
    def to_dict(self):
        """Convert the Vehicle instance to a dictionary."""
        return {
            "id": self.id,
            "license_plate": self.license_plate,
            "model": self.model,
            "capacity": self.capacity,
            "operator_id": self.operator_id,
            "mileage": self.mileage,
            "route": self.route,
            "price": float(self.price),  
            "image_url": self.image_url
        }

User.vehicles = db.relationship('Vehicle', order_by=Vehicle.id, back_populates='operator')

class Ticket(db.Model):
    __tablename__ = 'tickets'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    travel_date = db.Column(db.Date, nullable=False)
    travel_time = db.Column(db.Time, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) 
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'), nullable=False)  

    user = db.relationship('User', back_populates='tickets')
    vehicle = db.relationship('Vehicle', back_populates='tickets')  

    def to_dict(self):
        return {
            'id': self.id,
            'travelDate': self.travel_date.isoformat(),
            'travelTime': self.travel_time.strftime("%H:%M:%S"),
            'email': self.user.email if self.user else None, 
            'vehicleId': self.vehicle_id
        }

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)
    review_text = db.Column(db.String, nullable=True)
    email = db.Column(db.String, nullable=False)  # New field

    def __init__(self, rating, review_text, email):
        self.rating = rating
        self.review_text = review_text
        self.email = email

