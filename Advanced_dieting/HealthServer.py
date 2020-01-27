from flask import Flask, escape, request, render_template, make_response, url_for, redirect, jsonify
from UserDatabase import UserDatabase
app = Flask(__name__)

usr_db = None

LOGIN = 'login.html'
HEALTHDATA = 'healthData.html'
INDEX = 'mainPage.html'
SIGNUP = 'signup.html'
CHARTS = 'charts.html'

def initialize_vars():
	global usr_db
	usr_db = UserDatabase()

@app.route('/')
def frontPage():
   return (redirect(url_for('login')))

@app.route('/login', methods=['POST', 'GET'])
def login():
   if request.method == 'POST':
      if (usr_db.login(request.form['user'], request.form['pass'])):
         usr = request.form['user']
         if (usr_db.check_is_prefs_set(usr)):
            resp = redirect(url_for('mainPage'))
         else:
            resp = make_response(render_template(HEALTHDATA))
         resp.set_cookie('user', request.form['user'])
         resp.set_cookie('pass', request.form['pass'])
         return resp
      else:
         return render_template(LOGIN, error='wrong login')
   else:
      return render_template(LOGIN)

@app.route('/signup', methods=['POST', 'GET'])
def signup():
   if request.method == 'POST':
      ilist = [request.form['pass'], request.form['gender'], request.form['age'], request.form['height'], request.form['weight']]
      usr_db.add_user(request.form['user'], ilist)
      return (redirect(url_for('login')))
   else:
      return render_template(SIGNUP)

@app.route('/mainPage')
def mainPage():
   return render_template(INDEX)

@app.route("/eatHistory", methods=['POST', 'GET'])
def eat_history():
   usr = request.cookies['user']
   if request.method == 'POST':
      json = request.get_json(force=True)
      print(request, json)
      usr_db.log_food(usr, json)
      return('good')
   else:
      return (jsonify(usr_db.get_eat_history(usr)))

@app.route('/userPreferences', methods=['POST', 'GET'])
def usr_pref():
   usr = request.cookies['user']
   if request.method == 'POST':
      j = {'Diabetes': request.form['disease']}
      usr_db.set_usr_prefs(usr, j)
      return redirect(url_for("mainPage"))
   else:
      return jsonify(usr_db.get_usr_prefs())


@app.route('/charts')
def graphs():
   return render_template(CHARTS)

if __name__ == '__main__':
   initialize_vars()
   app.run()