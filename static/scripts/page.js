// static/scripts/page.js
class Page{
  
  toKhDate(date){
    var dt = new Date(date);
    var d = dt.getDate();
    var m = dt.getMonth()+1;
    var y = dt.getFullYear();
    var khDate = d+'/'+m+'/'+y;
    return khDate;
  }

}//end class

const page = new Page();