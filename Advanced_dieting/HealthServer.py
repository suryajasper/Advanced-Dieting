from flask import Flask, escape, request, render_template, make_response
from UserDatabase import UserDatabase
app = Flask(__name__)

usr_db = None

LOGIN = 'login.html'
HEALTHDATA = 'healthData.html'
INDEX = 'index.html'

def initialize_vars():
	global usr_db
	usr_db = UserDatabase()

@app.route('/login', methods=['POST', 'GET'])
def login():
   if request.method == 'POST':
      if (usr_db.login(request.form['user'], request.form['pass'])):
         resp = make_response(render_template(HEALTHDATA))
         resp.set_cookie('user', request.form['user'])
         resp.set_cookie('pass', request.form['pass'])
         return resp
      else:
         return render_template(LOGIN, error='wrong login')
   else:
      return render_template(LOGIN)

app.route('/index')
def mainBlob():
   return render_template(INDEX)

if __name__ == '__main__':
   initialize_vars()
   app.run()