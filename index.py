#index.py
from flask import render_template, request
from flask_classful import FlaskView, route
from models.postdb import Postdb
from models.pagedb import Pagedb
  
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

  @route('/page/<id>/')
  def get_single_page(self, id):
    self.pagedb = Pagedb()
    vdict = self.pagedb.get_page(id)
    return render_template('page.html', data=vdict)

  @route('/category/<cat>/')
  def get_post_category(self, cat):
    self.postdb = Postdb()
    vdict = self.postdb.get_post(cat=cat)
    return render_template('index.html', data=vdict)

  @route('/search/', methods=['POST'])
  def get_post_search(self):
    self.postdb = Postdb()
    q = request.form['q']
    vdict = self.postdb.get_post(q=q)
    return render_template('search.html', data=vdict)