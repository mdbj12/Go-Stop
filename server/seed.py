from app import app
from models import db, User

import click

with app.app_context():

    user_options = 0
    while user_options != 2:
        click.echo('(1) Create new UserID')
        click.echo('(2) Quit Program ... ')
        user_options = int(input())

        if user_options == 1:
            @click.command()
            @click.option('--username', prompt='Enter Username: ')
            @click.option('--email', prompt='Enter Email: ')
            @click.option('--password', prompt='Enter Password: ')

            def create_user(username, email, password):
                new_user = User(
                    username = username,
                    email = email,
                    password = password
                )

                db.session.add(new_user)
                db.session.commit()

                click.echo('Creating User ... ')

            if __name__ == '__main__':
                create_user.main(standalone_mode=False)

        else:
            click.echo('Quitting Program ... ')