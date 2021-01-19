//static/scritps/search.js
class Search{
  constructor(){
    this.pageToken = false;
    this.apiKey = 'AIzaSyCDMr6toQGyDRFPChRsbQ2sheSQfTQLVqg';
    this.blogId = '3212243556817590089';
    this.q = false;
  }

  makeApiCall(){
    gapi.client.load('blogger', 'v3', function(){
      var q = search.q ? 'q='+search.q+'&':'';
      var postBody = 'fetchBodies=false&'
      var myPageToken = search.pageToken ? 'pageToken='+search.pageToken:'';
      var blogId = search.blogId;
      
      var requestPath = 'https://www.googleapis.com/blogger/v3/blogs/'+blogId+'/posts/search?'+ q + postBody + myPageToken;
      
      var request = gapi.client.request({
        'path': requestPath ,
      });
      
      request.execute(function(response) {      
  /////////////////////////////////////// 
      search.getPostAPI(response);
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
    this.postTitle = [];
    this.postId = [];
 
    this.totalPost = json.items.length;
    search.pageToken = json.nextPageToken;
    this.postList = json.items;
    this.startIndex = 1;
    for(var i =0; i<this.postList.length; i++){
      this.postTitle.push(this.postList[i].title);
      this.postId.push(this.postList[i].id);
    }
    search.listingPosts();
  }


  listingPosts(){
    var html = '';
    for(var v in search['postId'])
      html += `<li><a href="/post/${search.postId[v]}/">${search.postTitle[v]}</a></li>`;
    
    $('#search-result').append(html);
  }
  
}//end class

const search = new Search();

function initAPI() {
  gapi.client.setApiKey(search.apiKey);
  search.makeApiCall();
}
