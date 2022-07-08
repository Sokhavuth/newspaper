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

  def set_date(self):
    KhmerDays = ['ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍', 'អាទិត្យ']
    KhmerMonths = ['មករា', 'កុម្ភៈ', 'មិនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ']
    khtz = timezone('Asia/Phnom_Penh')
    date = datetime.now().astimezone(tz=khtz)
    day = self.toKhNum(date.day)
    week_day = KhmerDays[date.weekday()]
    month = KhmerMonths[date.month-1]
    year = self.toKhNum(date.year)

    date_string = ('ថ្ងៃ '+week_day+' ទី '+day+' ខែ '+month+' ឆ្នាំ '+year)
    return date_string

  def get_video_data(self, items, index):
    item_contents = [str(BeautifulSoup(item[index], "html.parser")) for item in items]
    
    return item_contents

  def toKhNum(self, number):
    khNum = {'0':'០', '1':'១', '2':'២', '3':'៣', '4':'៤', '5':'៥', '6':'៦', '7':'៧', '8':'៨', '9':'៩'}
    stringNum = str(number)
    khString = ''
 
    for v in stringNum:
      khString += khNum[v]
  
    return khString