#index.py
import config, copy
from flask import render_template
from flask_classful import FlaskView, route
  
class Index(FlaskView):
  
  @route('/')
  def index(self):
    vdict = copy.deepcopy(config.vdict)
    return render_template('index.html', data=vdict)