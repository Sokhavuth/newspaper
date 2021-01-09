#models/post.py
import config, copy, requests, lib, json
from flask import render_template, session
from flask_classful import FlaskView, route

class Postdb():

  def get_post(self, token=''):
    vdict = copy.deepcopy(config.vdict)
    self.vlib = lib.Lib()

    query = {'key':vdict['api-key'], 'maxResults':5}
    if token:
      query['pageToken'] = token

    response = requests.get('https://www.googleapis.com/blogger/v3/blogs/'+vdict['blog-id']+'/posts', params=query)
    json = response.json()

    vdict['pageToken'] = json['nextPageToken']
    posts = json['items']
    list = []

    for post in posts:
      id = post['id']
      title = post['title']
      content = post['content']
      video = content.find('__video-id__')
      date = post['published']
      url = post['url']
      author = post['author']['displayName']

      list.append((id, title, content, date, url, author, video))

    vdict['posts'] = list
    vdict['thumbs'] = self.vlib.get_thumbs(list, 2)
    vdict['date'] = self.vlib.set_date()

    return vdict