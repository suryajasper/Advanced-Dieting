import json
import os.path
from os import path

class UserDatabase:
	def __init__(self):
		self.ufile = 'usrdata.db'

	def login(self,usr, pss):
		f = open(self.ufile, 'r')
		data = f.readlines()
		f.close()
		for i in data:
			if (i.split()[0] == usr):
				if (i.split()[1] == pss):
					return True
				else:
					return False
		return False

	def add_user(self, usr, ilist):
		f = open(self.ufile, 'a')
		for i in ilist:
			usr += ' ' + i
		f.write(usr + '\n')
		f.close()
		f = open(usr + 'eat.db' 'w')
		f.close()
		return True

	def log_food(self, usr, jso):
		f =	open(usr + 'eat.db', 'a')	
		f.write(json.dumps(jso) + '\n')
		f.close()

	def get_eat_history(self, usr):
		f = open(usr + 'eat.db', 'r')
		data = f.readlines()
		f.close()

		foodList = []
		if len(data) >= 30:
			rang = 30
		else:
			rang = len(data)

		for i in range(len(data)- 1, len(data) - rang, -1):
			foodList.append(json.loads(data[i]))

		print(foodList)
		return(foodList)

	def set_usr_prefs(self, usr, prefs):
		print('ssdfsdf')
		f = open(usr + '.prefs', 'w')
		f.write(json.dumps(prefs))
		f.close()

	def check_is_prefs_set(self, usr):
		if (path.exists(usr + '.prefs')):
			return True
		else:
			return False

	def get_usr_prefs(self, usr):
		f = open(usr + '.prefs', 'wr')
		data = f.readlines()
		f.close()

		return (json.loads(data[0]))
 