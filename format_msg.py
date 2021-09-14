from flask_mail import Message
from os import environ

def format_msg(data):
    body = f"From: {data['name']} <{data['email']}>\n\n{data['message']}"
    msg = Message(data["subject"],
                  sender=(f"{data['name']} c/o My Portfolio", data["email"]),
                  recipients=[environ.get("MAIL_TO")],
                  body=body)

    return msg