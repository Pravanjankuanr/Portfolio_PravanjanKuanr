from __future__ import annotations
import json
import threading
import os
from email.mime.text import MIMEText
import smtplib
from pathlib import Path
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, send_from_directory
from datetime import datetime

# Google Sheets
import gspread
from google.oauth2.service_account import Credentials

# Email
from flask_mail import Mail, Message

BASE_DIR = Path(__file__).resolve().parent
PROJECTS_PATH = BASE_DIR / 'projects.json'

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-change-me')


# -------------------- Google Sheets Setup --------------------
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

# Get credentials (Render → from env, Local → from file)
if os.environ.get("GOOGLE_CREDENTIALS"):
    # Running on Render (use env variable)
    creds_dict = json.loads(os.environ["GOOGLE_CREDENTIALS"])
    creds = Credentials.from_service_account_info(creds_dict, scopes=SCOPES)
else:
    # Running locally (use file)
    creds = Credentials.from_service_account_file("instance/credentials.json", scopes=SCOPES)

# Authorize client *after* creds is created
client = gspread.authorize(creds)

# Replace with your actual Google Sheet ID
SHEET_ID = "1cPNlCLSnxR4eoqrUx23aCNclcjROd4JybB1SSHNS008"
sheet = client.open_by_key(SHEET_ID).sheet1


# -------------------- Email Setup --------------------
email_cfg = {
    "MAIL_SERVER": os.environ.get("MAIL_SERVER"),
    "MAIL_PORT": int(os.environ.get("MAIL_PORT", 587)),
    "MAIL_USE_TLS": os.environ.get("MAIL_USE_TLS", "true").lower() == "true",
    "MAIL_USERNAME": os.environ.get("MAIL_USERNAME"),
    "MAIL_PASSWORD": os.environ.get("MAIL_PASSWORD"),
}

app.config.update(email_cfg)
app.config["MAIL_DEFAULT_SENDER"] = ("Portfolio Contact", email_cfg["MAIL_USERNAME"])

mail = Mail(app)

# -------------------- Routes --------------------

@app.route('/')
def home():
    with open(PROJECTS_PATH, 'r', encoding='utf-8') as f:
        projects = json.load(f)
    featured = [p for p in projects if p.get('featured')]
    return render_template('index.html', projects=featured)

@app.route("/docs")
def docs():
    return render_template("docs.html")

@app.route("/docs/sql")
def sql_tutorials():
    return render_template("sql_tutorials.html")

@app.route("/docs/insuranceapp")
def insurance_app():
    return render_template("insurance_app.html")

@app.route("/docs/git")
def git_tutorials():
    return render_template("git_tutorials.html")

@app.route('/projects')
def projects():
    with open(PROJECTS_PATH, 'r', encoding='utf-8') as f:
        projects = json.load(f)
    return render_template('projects.html', projects=projects)

@app.route('/api/projects')
def api_projects():
    with open(PROJECTS_PATH, 'r', encoding='utf-8') as f:
        projects = json.load(f)
    return jsonify(projects)

def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        mobile = request.form.get('mobile', '').strip()
        subject = request.form.get('subject', '').strip()
        message = request.form.get('message', '').strip()
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Save to Google Sheets
        sheet.append_row([now, name, email, mobile, subject, message])

        try:
            # Email to you
            msg = Message(
                "Someone Reached Out Through Your Portfolio",
                recipients=[app.config["MAIL_USERNAME"]]
            )
            msg.html = render_template(
                "email/admin_notification.html",
                name=name, email=email, mobile=mobile, subject=subject,
                message=message, now=now, current_year=datetime.now().year
            )

            # Auto reply
            auto_reply = Message(
                "✅ Thanks for contacting me!",
                recipients=[email]
            )
            auto_reply.html = render_template(
                "email/auto_reply.html",
                name=name
            )

            threading.Thread(target=send_async_email, args=(app, msg)).start()
            threading.Thread(target=send_async_email, args=(app, auto_reply)).start()

            flash("✅ Your message has been sent successfully!", "success")

        except Exception as e:
            print("Email Failed:", e)
            flash("⚠️ Message saved, but failed to send email. Try again later.", "error")

        return redirect(url_for('contact'))

    return render_template('contact.html')

# Simple file server for resume
@app.route('/resume')
def resume():
    resume_path = BASE_DIR / 'static' / 'resume.pdf'
    if resume_path.exists():
        return send_from_directory(resume_path.parent, resume_path.name)
    return redirect(url_for('home'))

# -------------------- Error handlers --------------------
@app.errorhandler(404)
def not_found(e):
    return render_template('base.html', title='Not Found',
                           content_html='<div class="py-24 text-center"><h1>404</h1><p>Page not found.</p></div>'), 404

@app.errorhandler(500)
def server_error(e):
    return render_template('base.html', title='Server Error',
                           content_html='<div class="py-24 text-center"><h1>500</h1><p>Something went wrong.</p></div>'), 500

if __name__ == '__main__':
    app.run(debug=True)