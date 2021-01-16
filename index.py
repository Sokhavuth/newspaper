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

  @route('/post/<id>/')
  def get_single_post(self, id):
    self.postdb = Postdb()
    vdict = self.postdb.get_post(id)
    return render_template('post.html', data=vdict)

  @route('/category/<cat>/')
  def get_post_category(self, cat):
    self.postdb = Postdb()
    vdict = self.postdb.get_post(cat=cat)
    return render_template('index.html', data=vdict)