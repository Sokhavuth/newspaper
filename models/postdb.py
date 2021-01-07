#models/post.py
import config, copy, requests, lib
from flask import render_template
from flask_classful import FlaskView, route

class Postdb():
  def __init__(self):
    self.get_post()

  def get_post(self):
    vdict = copy.deepcopy(config.vdict)
    vlib = lib.Lib()
    query = {'key':vdict['api-key'], 'maxResults':12}
    response = requests.get('https://www.googleapis.com/blogger/v3/blogs/'+vdict['blog-id']+'/posts', params=query)
    json = response.json()

    vdict['nextPageToken'] = json['nextPageToken']
    if 'prevPageToken' in json:
      vdict['prevPageToken'] = json['prevPageToken']

    posts = json['items']
    list = []

    for post in posts:
      id = post['id']
      title = post['title']
      content = post['content']
      date = post['published']
      url = post['url']
      author = post['author']['displayName']

      list.append((id, title, content, date, url, author))

    vdict['posts'] = list
    vdict['thumbs'] = vlib.get_thumbs(list, 2)

    return vdict