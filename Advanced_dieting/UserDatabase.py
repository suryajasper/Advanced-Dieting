import json

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
		print('yayayay')
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
 