import os
from dotenv import load_dotenv
from flask import Flask, render_template, request, flash
from flask_mail import Mail

from format_msg import format_msg
from forms import ContactForm


project_folder = os.path.expanduser("~/mysite")
load_dotenv(os.path.join(project_folder, ".env"))

app = Flask(__name__)
app.app_context()
app.config['MAIL_SERVER'] = os.environ.get("MAIL_SERVER")
app.config['MAIL_PORT'] = os.environ.get("MAIL_PORT")
app.config['MAIL_USERNAME'] = os.environ.get("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.environ.get("MAIL_PASSWORD")
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.secret_key = os.environ.get("APP_SECRET_KEY")

mail = Mail(app)

@app.route("/", methods=["GET"])
@app.route("/index.html", methods=["GET"])
def index():
    page_nfo = {
      "title": "Welcome",
      "description": "Portfolio of Justin Lane",
      "css": "./css/index.css"
    }
    return render_template("index.html", page_nfo=page_nfo)

@app.route("/contact.html", methods=["GET", "POST"])
def contact():
    page_nfo = {
      "title": "Contact Form",
      "description": "Example contact form created by Justin Lane",
      "css": "./css/contact.css"
    }
    form = ContactForm()
    if request.method == "POST":
        if form.validate() == False:
          flash(form.errors)
          return render_template("contact.html", page_nfo=page_nfo, form=form)
        else:
          msg = format_msg(form.data)
          mail.send(msg)
          return render_template("contact.html", page_nfo=page_nfo, form=form)
    elif request.method == "GET":
        return render_template('contact.html', page_nfo=page_nfo, form=form)