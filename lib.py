#lib.py
import json
from pytz import timezone
from datetime import datetime 
from bs4 import BeautifulSoup

class Lib():
  def get_timezone(self):
    khtz = timezone('Asia/Phnom_Penh')
    date = datetime.now().astimezone(tz=khtz).strftime('%d/%m/%Y')
    time = datetime.now().astimezone(tz=khtz).strftime('%H:%M:%S')
    return (date, time)

  def get_thumbs(self, items, index, type=None):
    item_contents = [BeautifulSoup(item[index], "html.parser") for item in items]
    
    images = []

    for item_content in item_contents:
      image = item_content.find('img')
      if not image:
        if type == "user":
          new_tag = item_content.new_tag('img', src="/static/images/userthumb.png")
        elif type == "movie":
          new_tag = item_content.new_tag('img', src="/static/images/nomovie.jpg")
        else:
          new_tag = item_content.new_tag('img', src="/static/images/no-image.png")

        images.append(new_tag)
      else:
        images.append(image)

    thumbs = []
    for image in images:
      src = (image['src']).split(' ')
      thumbs.append(src[0])

    return thumbs

  def get_video_data(self, items, index):
    item_contents = [str(BeautifulSoup(item[index], "html.parser")) for item in items]
    
    return item_contents
    