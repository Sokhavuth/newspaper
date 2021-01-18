// static/scripts/page.js
class Post{
  
  toKhDate(date){
    var dt = new Date(date);
    var d = dt.getDate();
    var m = dt.getMonth()+1;
    var y = dt.getFullYear();
    var khDate = d+'/'+m+'/'+y;
    return khDate;
  }

}//end class

const page = new Post();