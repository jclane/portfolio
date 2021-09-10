from flask import Flask, render_template, request, flash
from flask_mail import Mail
from forms import ContactForm


app = Flask(__name__)
mail = Mail()

app.secret_key = "#development_key!"

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
          return 'Form posted.'
    elif request.method == 'GET':
        return render_template('contact.html', page_nfo=page_nfo, form=form)