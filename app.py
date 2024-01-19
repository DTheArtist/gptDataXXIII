from flask import Flask, render_template
import markdown2
import json

app = Flask (__name__)

# for Reading & Displaying an HTML Template
@app.route('/') 
def index():
    return render_template('index.html')

# for Displaying PDFs 
@app.route('/about') 
def about():
    with open('static/about.pdf', 'rb') as file:
        pdf = file.read()
    return pdf, 200, {'Content-Type': 'application/pdf'}

# for Printing Raw Text in Quotes
@app.route('/version') 
def version():
    return 'Version 1.0.1 2024.01.18'

# for Reading & Displaying a Document as Plain Text
@app.route('/readme')
def readme():
    with open('README.md', 'r') as file:
        content = file.read()
    return content

 # For a dynamic JSON file, generate or load your JSON data here
@app.route('/conversations')
def conversations():
    with open('static/conversations.json', 'r') as file:
        data = json.load(file)
    return json.dumps(data, indent=4), 200, {'Content-Type': 'application/json'}

# for Reading & Displaying a Text Document as HTML
@app.route('/changelog')
def changelog():
    with open('CHANGELOG.md', 'r') as file:
        content = markdown2.markdown(file.read())
    return content

# for Printing Raw Text in Quotes
@app.route('/signup')
def signup():
    return 'Signup page'

if __name__ == '__main__':
    app.run(debug=True)

