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
		f.write(usr)
		f.close()
		return True