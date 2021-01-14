//static/scritps/index.js
class Index{
  constructor(){
    this.pageTokens = [];
    this.apiKey = 'AIzaSyCDMr6toQGyDRFPChRsbQ2sheSQfTQLVqg';
    this.blogId = '3212243556817590089';
    this.maxResult = 5;
    this.label = false;
  }

  makeApiCall(){
    $('#nav-home').attr('src', '/static/images/loading.gif');
    gapi.client.load('blogger', 'v3', function(){
      var labels = index.label ? 'labels='+index.label:'';
      var maxResults = index.maxResult ? 'maxResults='+index.maxResult:'';
      var myPageToken = index.pageToken ? 'pageToken='+index.pageToken:'';
      var blogId = index.blogId;
      
      var requestPath = 'https://www.googleapis.com/blogger/v3/blogs/'+blogId+'/posts?'+labels+'&'+maxResults+'&'+myPageToken;
      
      var request = gapi.client.request({
        'path': requestPath ,
      });
      
      request.execute(function(response) {      
  /////////////////////////////////////// 
      index.getPostAPI(response);
  ///////////////////////////////////////
      });
  
    });
  }

  createThumb(postContent){
    var div = document.createElement( 'div' );
    div.innerHTML = postContent;
    var img = div.getElementsByTagName("img");
    
    if(img.length>=1) {
      return img[0].src;
    }
    else{
      return ("/static/images/no-image.png");
    }
  }

  getPostAPI(json){
    this.postUrl = [];
    this.postTitle = [];
    this.postDate = [];
    this.postData = [];
    this.postList = [];
    this.postThumb = [];
    this.postId = [];
    this.video = [];
 
    this.totalPost = json.items.length;
    if(this.next)
      this.pageTokens.push(json.nextPageToken);

    this.postList = json.items;
    this.startIndex = 1;
    for(var i =0; i<this.postList.length; i++){
      this.postUrl.push(this.postList[i].url);
      this.postData.push(this.postList[i].content);
      this.postTitle.push(this.postList[i].title);
      this.postThumb.push(this.createThumb(this.postList[i].content));
      this.postDate.push(this.postList[i].published);
      this.postId.push(this.postList[i].id);
      this.video.push(this.postData[i].indexOf('__video-id__'));
    }
    index.listingPosts();
  }

  navPrevious(){
    var length = this.pageTokens.length;
    if(length > 1)
      this.pageTokens.pop();
    length = this.pageTokens.length;
    this.pageToken = this.pageTokens[length-2];
    this.next = false;
    this.makeApiCall();
  }
  
  navHome(){
    this.pageToken = false;
    this.pageTokens = [];
    this.next = true;
    this.makeApiCall();
  }

  navNext(){
    var length = this.pageTokens.length;
    this.pageToken = this.pageTokens[length-1];
    this.next = true;
    this.makeApiCall();
  }

  listingPosts(){
    var html = '';
    
    for(var v=0; v<index['postData'].length; v++){
      html += `<div class="post-outer">`;
      html += `<div class="post">`;
      html += `<a href="/post/${ index['postId'][v] }/"><img src="${ index['postThumb'][v] }" /></a>`;
      html += `<a href="/post/${ index['postId'][v] }/"><p>${ index['postTitle'][v] }</p></a>`;
      if(index['video'][v] != -1){
        html += `<a href="/post/${ index['postId'][v] }/"><img class="play-icon" src="/static/images/play.png" /></a>`;
      }
      html += `</div>`;
      html += `</div>`;
    }
    
    $('#panel').html(html);
    $('#nav-home').attr('src', '/static/images/home.png');
    
  }
}//end class

const index = new Index();

function initAPI() {
  gapi.client.setApiKey(index.apiKey);
  index.next = true;
  index.makeApiCall();
}

gapi.load('client', initAPI);
