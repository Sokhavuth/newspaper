#models/pagedb.py
import config, copy, lib, requests
from flask import render_template
from flask_classful import FlaskView, route

class Pagedb():

  def get_page(self, id=''):
    vdict = copy.deepcopy(config.vdict)

    if id:
      URL = "https://www.googleapis.com/blogger/v3/blogs/"+vdict['blog-id']+"/pages/"+id
      PARAMS = {"key":vdict['api-key']}
      r = requests.get(url = URL, params = PARAMS)
      data = r.json() 
      vdict['page'] = data
      vdict['id'] = id
    
    self.vlib = lib.Lib()
    vdict['date'] = self.vlib.set_date()
    
    return vdict