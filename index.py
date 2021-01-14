#index.py
from flask import render_template, session
from flask_classful import FlaskView, route
from models.postdb import Postdb
  
class Index(FlaskView):
  
  @route('/')
  def index(self):
    session['pageToken'] = []
    self.postdb = Postdb()
    vdict = self.postdb.get_post()
    return render_template('index.html', data=vdict)

  @route('/load/')
  def load_post(self):
    self.postdb = Postdb()
    vdict = self.postdb.get_post()
    return render_template('index.html', data=vdict)