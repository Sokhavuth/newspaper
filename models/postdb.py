#models/post.py
import config, copy, lib, requests
from flask import render_template
from flask_classful import FlaskView, route

class Postdb():

  def get_post(self, id=''):
    vdict = copy.deepcopy(config.vdict)

    if id:
      URL = "https://www.googleapis.com/blogger/v3/blogs/"+vdict['blog-id']+"/posts/"+id
      PARAMS = {"key":vdict['api-key']}
      r = requests.get(url = URL, params = PARAMS)
      data = r.json() 
      vdict['post'] = data
    
    self.vlib = lib.Lib()
    vdict['date'] = self.vlib.set_date()
    vdict['id'] = id
    
    return vdict