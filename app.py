from __future__ import annotations
import json
import os
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
creds = Credentials.from_service_account_file("credentials.json", scopes=SCOPES)
client = gspread.authorize(creds)

if os.environ.get("GOOGLE_CREDENTIALS"):
    # Running on Render (use env variable)
    creds_dict = json.loads(os.environ["GOOGLE_CREDENTIALS"])
    creds = Credentials.from_service_account_info(creds_dict, scopes=SCOPES)
else:
    # Running locally (use file)
    creds = Credentials.from_service_account_file("credentials.json", scopes=SCOPES)


# Replace with your actual Google Sheet ID
SHEET_ID = "1cPNlCLSnxR4eoqrUx23aCNclcjROd4JybB1SSHNS008"
sheet = client.open_by_key(SHEET_ID).sheet1

# -------------------- Email Setup --------------------
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = "pravanjankuanr09@gmail.com"        # your Gmail
app.config["MAIL_PASSWORD"] = "pfsflydyaclvtakg"           # Gmail App Password
app.config["MAIL_DEFAULT_SENDER"] = ("Portfolio Contact", "pravanjankuanr09@gmail.com")

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

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        mobile = request.form.get('mobile', '').strip()
        subject = request.form.get('subject', '').strip()
        message = request.form.get('message', '').strip()

        # Basic validation
        if not name or not email or not subject or not message:
            flash('Please fill in all fields.', 'error')
            return redirect(url_for('contact'))
        if '@' not in email:
            flash('Please provide a valid email.', 'error')
            return redirect(url_for('contact'))

        # Save to Google Sheets (with Datetime)
        from datetime import datetime
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        sheet.append_row([now, name, email, mobile, subject, message])

        # -------- Customized Email to YOU --------
        msg = Message("Someone Just Reached Out Through Your Portfolio",
                      recipients=["pravanjankuanr09@gmail.com"])  # your mail
        msg.html = f"""
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f7fa; padding: 30px;">
        <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.1); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #38b2ac, #2c7a7b); padding: 20px; text-align: center; color: #fff;">
                <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 25px;">
                <h2 style="color: #2d3748; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #eaeaea; padding-bottom: 8px;">
                    Submitted Details
                </h2>
                
                <p style="font-size: 15px; color: #2d3748; line-height: 1.8;">
                    <b style="color:#111;">Name:</b> {name}<br>
                    <b style="color:#111;">Email:</b> {email}<br>
                    <b style="color:#111;">Mobile:</b> {mobile}<br>
                    <b style="color:#111;">Subject:</b> {subject}
                </p>
                
                <div style="margin-top: 20px; padding: 18px; background: #f7fafc; border-left: 5px solid #38b2ac; border-radius: 8px;">
                    <p style="margin:0; font-size: 15px; color: #2d3748; line-height: 1.8;">
                    {message}
                    </p>
                </div>
                
                <p style="margin-top: 25px; font-size: 13px; color: #718096; text-align: center;">
                    Submitted on <b>{now}</b>
                </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #edf2f7; padding: 15px; text-align: center; font-size: 12px; color: #4a5568;">
                <p style="margin:0;">⚡ This message was sent via your </br><b>Portfolio Contact Form</b>.</p>
                <p style="margin:5px 0 0;">© {now[:4]} Pravanjan Kuanr</p>
            </div>
        </div>
        </div>
        """

        mail.send(msg)

        # -------- Auto-Reply Email to Visitor --------
        auto_reply = Message(
            "✅ Thanks for contacting me!",
            recipients=[email],
            sender=("Pravanjan Kuanr Portfolio", "pravanjankuanr09@gmail.com"))
        auto_reply.html = f"""
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f7fa; padding: 30px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.1); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #38b2ac, #2c7a7b); padding: 20px; text-align: center; color: #fff;">
            <h1 style="margin: 0; font-size: 22px;">🤝 Thank You for Reaching Out!</h1>
            </div>
            
            <!-- Body -->
            <div style="padding: 25px; color: #2d3748; line-height: 1.7;">
            <h3 style="margin-top: 0;">Hi {name},</h3>
            <p>
                I truly appreciate you contacting me through my portfolio website. 
                Your message has been received ✅ and I’ll personally review it and get back to you soon.
            </p>
            
            <div style="margin: 20px 0; padding: 18px; background: #f7fafc; border-left: 5px solid #38b2ac; border-radius: 8px; font-size: 14px; color: #4a5568;">
                ✨ <b>Quick Note:</b> This is an automated confirmation so you know your message reached me safely.
            </div>
            
            <p>
                Best Regards,<br>
                <b style="color:#2c7a7b;">Pravanjan Kuanr</b><br>
                🌐 <a href="https://yourportfolio.com" style="color:#3182ce; text-decoration:none;">Portfolio Website</a>
            </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #718096;">
            <p style="margin:0;">📩 This is an automated reply — please do not respond to this email.</p>
            </div>
        </div>
        </div>
        """

        mail.send(auto_reply)

        flash('✅ Your message has been sent successfully!', 'success')
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