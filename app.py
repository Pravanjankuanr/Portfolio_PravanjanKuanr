from __future__ import annotations
import json
import os
import sqlite3
from pathlib import Path
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, send_from_directory

BASE_DIR = Path(__file__).resolve().parent
INSTANCE_DIR = BASE_DIR / 'instance'
INSTANCE_DIR.mkdir(exist_ok=True)
DB_PATH = INSTANCE_DIR / 'messages.db'
PROJECTS_PATH = BASE_DIR / 'projects.json'

app = Flask(__name__, instance_path=str(INSTANCE_DIR))
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-change-me')
app.config['DATABASE'] = str(DB_PATH)

# -------------------- Database helpers --------------------

def get_db():
    conn = sqlite3.connect(app.config['DATABASE'])
    conn.row_factory = sqlite3.Row
    return conn

# Create table if not exists
with sqlite3.connect(DB_PATH) as conn:
    conn.execute(
        '''CREATE TABLE IF NOT EXISTS messages (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               name TEXT NOT NULL,
               email TEXT NOT NULL,
               subject TEXT NOT NULL,
               message TEXT NOT NULL,
               created_at DATETIME DEFAULT CURRENT_TIMESTAMP
           )'''
    )
    conn.commit()

# -------------------- Routes --------------------

@app.route('/')
def home():
    # Load profile + featured projects
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
        subject = request.form.get('subject', '').strip()
        message = request.form.get('message', '').strip()

        # Basic validation
        if not name or not email or not subject or not message:
            flash('Please fill in all fields.', 'error')
            return redirect(url_for('contact'))
        if '@' not in email:
            flash('Please provide a valid email.', 'error')
            return redirect(url_for('contact'))

        # Save to SQLite
        conn = get_db()
        conn.execute(
            'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            (name, email, subject, message)
        )
        conn.commit()
        conn.close()

        flash('Thanks! Your message has been sent.', 'success')
        return redirect(url_for('contact'))

    return render_template('contact.html')

# Simple file server for resume (place your resume in /static/resume.pdf)
@app.route('/resume')
def resume():
    resume_path = BASE_DIR / 'static' / 'resume.pdf'
    if resume_path.exists():
        return send_from_directory(resume_path.parent, resume_path.name)
    return redirect(url_for('home'))

# -------------- Error handlers --------------
@app.errorhandler(404)
def not_found(e):
    return render_template('base.html', title='Not Found', content_html='<div class="py-24 text-center"><h1>404</h1><p>Page not found.</p></div>'), 404

@app.errorhandler(500)
def server_error(e):
    return render_template('base.html', title='Server Error', content_html='<div class="py-24 text-center"><h1>500</h1><p>Something went wrong.</p></div>'), 500

if __name__ == '__main__':
    app.run(debug=True)