#models/post.py
import config, copy, lib
from flask import render_template
from flask_classful import FlaskView, route

class Postdb():

  def get_post(self, token=''):
    vdict = copy.deepcopy(config.vdict)
    
    self.vlib = lib.Lib()
    vdict['date'] = self.vlib.set_date()
    
    return vdict