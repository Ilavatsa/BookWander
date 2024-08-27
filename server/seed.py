#!/usr/bin/env python3

from app import app
from faker import Faker
import datetime
from models import db, User, Vehicle, Ticket, Review
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

with app.app_context():
    fake = Faker()
    print("Starting seed...")
    
    # Delete all records/rows in the tables
    User.query.delete()
    Vehicle.query.delete()
    Ticket.query.delete()
    Review.query.delete()
    
    # Seed Users
    users = [
        User(name=fake.name(), email=fake.email(), password=bcrypt.generate_password_hash(fake.password()).decode('utf-8'), role='passenger'),
        User(name=fake.name(), email=fake.email(), password=bcrypt.generate_password_hash(fake.password()).decode('utf-8'), role='operator')
    ]
    db.session.add_all(users)
    db.session.commit()

    # Seed Vehicles
    vehicles = [
        Vehicle(license_plate=fake.license_plate(), model='Bus', capacity=fake.random_int(min=20, max=50), operator_id=users[3].id, mileage=fake.random_int(min=10000, max=200000), route=fake.city(), price=fake.random_number(digits=2)),
        Vehicle(license_plate=fake.license_plate(), model='Minivan', capacity=fake.random_int(min=10, max=15), operator_id=users[3].id, mileage=fake.random_int(min=10000, max=200000), route=fake.city(), price=fake.random_number(digits=2)),
    ]
    db.session.add_all(vehicles)
    db.session.commit()

    # Seed Tickets
    tickets = [
        Ticket(user_id=users[0].id, vehicle_id=vehicles[0].id, route=vehicles[0].route, schedule='08:00', purchase_date=datetime.date.today(), price=fake.random_number(digits=2)),
        Ticket(user_id=users[0].id, vehicle_id=vehicles[1].id, route=vehicles[1].route, schedule='09:00', purchase_date=datetime.date.today() - datetime.timedelta(days=1), price=fake.random_number(digits=2)),
    ]
    db.session.add_all(tickets)
    db.session.commit()

    # Seed Reviews
    reviews = [
        Review(user_id=users[0].id, reviewed_user_id=users[1].id, rating=5, comments='Great driver!'),
        Review(user_id=users[0].id, reviewed_user_id=users[2].id, rating=4, comments='Helpful conductor.'),
    ]
    db.session.add_all(reviews)
    db.session.commit()

    print("Database seeded successfully!")