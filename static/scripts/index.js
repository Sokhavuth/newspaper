//static/scritps/index.js
class Index{
  constructor(){
    this.pageToken = [];
  }

  load_items(token){
    $('#nav-home').attr('src', '/static/images/loading.gif');
    if(token == "previous")
      var url = '/navigate/'+index.pageToken[(index.pageToken).length-1];
    else if(token == 'next')
      var url = '/navigate/'
    $.get(url, function(data, status){
      if(status === "success"){
        (index.pageToken).append(data['pageToken']);
        index.listingPosts(data);
      }else{
        alert('Fail to connect to server.');
      }
    });
  }
  listingPosts(data){
    var html = '';
    
    for(var v=0; v<data['posts'].length; v++){
      html += `<div class="post-outer">`;
      html += `<div class="post">`;
      html += `<a href="/post/${ data['posts'][v][0] } /"><img src="${ data['thumbs'][v] }" /></a>`;
      html += `<a href="/post/${ data['posts'][v][0] } /"><p>${ data['posts'][v][1] }</p></a>`;
      if(data['posts'][v][6] != -1){
        html += `<a href="/post/${ data['posts'][v][0] } /"><img class="play-icon" src="/static/images/play.png" /></a>`;
      }
      html += `</div>`;
      html += `</div>`;
    }
    
    $('#panel').html(html);
    $('#nav-home').attr('src', '/static/images/home.png');
    
  }
}//end class

const index = new Index();