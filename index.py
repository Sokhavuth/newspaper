#index.py
from flask import render_template
from flask_classful import FlaskView, route
from models.postdb import Postdb
  
class Index(FlaskView):
  
  @route('/')
  def index(self):
    self.postdb = Postdb()
    vdict = self.postdb.get_post()
    return render_template('index.html', data=vdict)