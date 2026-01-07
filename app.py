import os
from dotenv import load_dotenv
from flask import Flask, render_template, request, flash, json
from flask_mail import Mail
from pathlib import Path

from format_msg import format_msg
from forms import ContactForm, WeatherAppForm
from weather import get_weather


configs_folder = os.path.expanduser("~/configs")
load_dotenv(os.path.join(configs_folder, ".env"))

app = Flask(__name__)
app.app_context()
app.config['MAIL_SERVER'] = os.environ.get("MAIL_SERVER")
app.config['MAIL_PORT'] = os.environ.get("MAIL_PORT")
app.config['MAIL_USERNAME'] = os.environ.get("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.environ.get("MAIL_PASSWORD")
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['RECAPTCHA_PUBLIC_KEY'] = os.environ.get("RECAPTCHA_PUBLIC_KEY")
app.config['RECAPTCHA_API_SERVER'] = os.environ.get("RECAPTCHA_API_SERVER")
app.config['RECAPTCHA_PRIVATE_KEY'] = os.environ.get("RECAPTCHA_PRIVATE_KEY")
app.secret_key = os.environ.get("APP_SECRET_KEY")

mail = Mail(app)

@app.route("/", methods=["GET"])
def index():
    page_nfo = {
      "title": "Welcome",
      "description": "Portfolio of Justin Lane",
      "css": "./static/css/index.css",
      "scripts": ["./static/js/slider.js"]
    }
    path = Path("./static/json/projects.json")
    with open(path, "r") as f:
        projects = json.load(f)

    return render_template("index.html", page_nfo=page_nfo, projects=projects)

@app.route("/contact", methods=["GET", "POST"])
def contact():
    page_nfo = {
      "title": "Contact Form",
      "description": "Example contact form created by Justin Lane",
      "css": "./static/css/contact.css"
    }
    form = ContactForm()
    if request.method == "POST":
        if form.validate() == False:
          flash(form.errors, "error")
          return render_template("contact.html", page_nfo=page_nfo, form=form)
        else:
          msg = format_msg(form.data)
          mail.send(msg)
          flash({"success":"Message sent!"})
          return render_template("contact.html", page_nfo=page_nfo, form=form)
    elif request.method == "GET":
        return render_template('contact.html', page_nfo=page_nfo, form=form)

@app.route("/weather", methods=["GET", "POST"])
def weather():
    page_nfo = {
      "title": "Simple Weather App",
      "description": "Example API based weather app created by Justin Lane"
    }
    form = WeatherAppForm()
    if request.method == "POST":
        units = "units=imperial&" if form.temp_units.data == "f"  else "units=metric&"
        weather = get_weather(str(form.zipcode.data), units)
        return render_template("weather.html", page_nfo=page_nfo, form=form, weather=weather)
    else:
        return render_template("weather.html", page_nfo=page_nfo, form=form)

