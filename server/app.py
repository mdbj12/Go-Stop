from flask import Flask, request, make_response, jsonify, session
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource

from models import db, User

app = Flask(__name__)
app.config['SECRET_KEY'] = 'fogofwar'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

CORS(app)
migrate = Migrate(app, db)
db.init_app(app)
api = Api(app)

class Users(Resource):
    def get(self):
        users = User.query.all()
        users_dict_list = [user.to_dict() for user in users]
        return make_response(
            users_dict_list, 200
        )
api.add_resource(Users, '/users')

class Signup(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter(User.username == data['username']).first()
        email = User.query.filter(User.email == data['email']).first()
        if user:
            return make_response(
                {'message': 'Username already exists!'},
                406
            )
        if email:
            return make_response(
                {'message': 'Email already registered!'},
                409
            )
        try:
            new_user = User(
                username = data['username'],
                email = data['email'],
                password = data['password']
            )
            db.session.add(new_user)
            db.session.commit()
        except ValueError as e:
            return make_response(
                e.__str__(),
                422
            )
        return make_response(
            new_user.to_dict(),
            201
        )
api.add_resource(Signup, '/signup')

class Login(Resource):
    def post(self):
        user = User.query.filter(
            User.username == request.get_json()['username'],
            User.password == request.get_json()['password']
        ).first()

        session['user_id'] = user.id
        print(user.id)
        print(session)
        return user.to_dict()
api.add_resource(Login, '/login')

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return {'message': '204: No Content'}, 204
api.add_resource(Logout, '/logout')

class UsersById(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response(
                {'error': 'user not found'},
                404
            )
        return make_response(
            user.to_dict(),
            200
        )
    def patch(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response(
                {'error': 'user not found'},
                404
            )
        data = request.get_json()
        for attr in data:
            setattr(user, attr, data[attr])
        db.session.commit()
        return make_response(
            user.to_dict(),
            202
        )
    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response(
                {"error": "user not found"},
                404
            )
        db.session.delete(user)
        db.session.commit()
        return make_response(
            {'message': 'user has been deleted'},
            202
        )
api.add_resource(UsersById, '/users/<int:id>')

if __name__ == '__main__':
    app.run(port=5556, debug=True, host='10.129.2.157')
# change host to your ip address