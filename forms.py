from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField
from wtforms.validators import InputRequired, Email, ValidationError

class ContactForm(FlaskForm):
    name = StringField("Name", [InputRequired("Please enter your name.")])
    email = StringField("Email", [InputRequired("Please enter your email address."),
                                  Email("Please enter your email address.")])
    subject = StringField("Subject", [InputRequired("Please a subject.")])
    message = TextAreaField("Message", [InputRequired("Please enter a message.")])
    submit = SubmitField("Send")