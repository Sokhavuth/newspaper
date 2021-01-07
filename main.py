#main.py
import config
from flask import Flask
from index import Index
 
app = Flask(__name__)

app.secret_key = config.vdict['secret-key']
 
Index.register(app, route_base='/')
 
if __name__ == '__main__':
  app.run(debug=True)