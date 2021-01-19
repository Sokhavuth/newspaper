//static/scritps/index.js
class Index{
  constructor(){
    this.pageTokens = [];
    this.apiKey = 'AIzaSyCDMr6toQGyDRFPChRsbQ2sheSQfTQLVqg';
    this.blogId = '3212243556817590089';
    this.maxResult = 5;
    this.label = false;
    this.q = false;

    this.kplaylistId = false;
    this.ChannelId =  'UC5BMQOsAB8hKUyHu9KI6yig';
    this.yt_nextPageToken = false;
    this.yt_prevPageToken = false;
    this.kclicked = false;
    this.kPlaylistt = [];
    this.kPlaylist = [];
    this.created = false;

    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    this.kplayerHeight = 0;
  }

  makeApiCall(){
    $('#nav-home').attr('src', '/static/images/loading.gif');
    gapi.client.load('blogger', 'v3', function(){
      var labels = index.label ? 'labels='+index.label+'&':'';
      var maxResults = index.maxResult ? 'maxResults='+index.maxResult:'';
      var myPageToken = index.pageToken ? 'pageToken='+index.pageToken:'';
      var blogId = index.blogId;
      
      var requestPath = 'https://www.googleapis.com/blogger/v3/blogs/'+blogId+'/posts?'+labels+maxResults+'&'+myPageToken;
      
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

  toKhDate(date){
    var dt = new Date(date);
    var d = dt.getDate();
    var m = dt.getMonth()+1;
    var y = dt.getFullYear();
    var khDate = d+'/'+m+'/'+y;
    return khDate;
  }

  listingPosts(){
    var html = '';
    
    for(var v=0; v<index['postData'].length; v++){
      html += `<div class="post-outer">`;
      html += `<div class="post">`;
      html += `<a href="/post/${ index['postId'][v] }/"><img src="${ index['postThumb'][v] }" /></a>`;
      html += `<a href="/post/${ index['postId'][v] }/"><p>${ index['postTitle'][v] }</p></a>`;
      html += `<span>${ this.toKhDate(new Date(index['postDate'][v])) }</span>`;
      if(index['video'][v] != -1){
        html += `<a href="/post/${ index['postId'][v] }/"><img class="play-icon" src="/static/images/play.png" /></a>`;
      }
      html += `</div>`;
      html += `</div>`;
    }
    
    $('#panel').html(html);
    $('#nav-home').attr('src', '/static/images/home.png');
    
  }

  handleClientLoad() {       
    index.loadAPIClientInterfaces();        
  }

  loadAPIClientInterfaces(){
    gapi.client.load('youtube', 'v3', function() {
    index.requestUserPlaylistId();
    });
  }

  requestUserPlaylistId(){
    var request = gapi.client.youtube.playlists.list({
      channelId: this.ChannelId,
      maxResults: 50,
      part: 'contentDetails'
    });
    
    request.execute(function(response) {
      index.playlistId = response.result.items;
      index.requestPlaylists(index.ChannelId);
    });
  }

  requestPlaylists(ChannelId, pageToken) {
    var requestOptions = {
      channelId: ChannelId,
      part: 'snippet',
      maxResults: 50
    };
    if (pageToken) {
      requestOptions.pageToken = pageToken;
    }

    var request = gapi.client.youtube.playlists.list(requestOptions);

    request.execute(function(response) {
      index.yt_nextPageToken = response.result.nextPageToken;  
      index.yt_prevPageToken = response.result.prevPageToken;
      var playlistItems = response.result.items;
      var kPlaylistt = [];
      for (var i = 0; i < playlistItems.length; i++) {
      kPlaylistt.push({'title':playlistItems[i].snippet.title, 'file':playlistItems[i].id, 'image':playlistItems[i].snippet.thumbnails.medium.url});
      }
      index.kPlaylist = [];
      for (var i = 0; i < kPlaylistt.length; i++) {
        index.kPlaylist.push({file:kPlaylistt[i]["file"],title:kPlaylistt[i]["title"],image:kPlaylistt[i]["image"]});
      }
   
      if(!index.created){
        index.createPlayer();
        index.created = true;
      }
  
      index.kdownloadButton = document.getElementById('kdownloadButton');
      index.kdownloadButton.innerHTML = '<input id="kurlField" type="text" name="kurl" value="Get direct link" size="82%" style="display:none;"  />'+'<input type="submit"  onclick="index.konSubmit()" value="ត្រឡប់​លេខរៀងវីដេអូ" />';
      
      const kPlaylist = index.kPlaylist;

      var kPlaylistPanel = document.getElementById('kplaylistPanel'); 
      for (var i = 0; i < kPlaylist.length; i++) {
       if(i==0){
        kPlaylistPanel.innerHTML = '<div id="kVideo'+(i+1)+'" class="kplaylistItem" onclick="index.kloadVideo('+i+')" >'+'<img class="kimgThub" src="'+kPlaylist[i]['image']+'" /><div class="klabel">'+kPlaylist[i]['title']+'</div>'+'</div>';
       }else{
        kPlaylistPanel.innerHTML += '<div id="kVideo'+(i+1)+'" class="kplaylistItem" onclick="index.kloadVideo('+i+')" >'+'<img class="kimgThub" src="'+kPlaylist[i]['image']+'" /><div class="klabel">'+kPlaylist[i]['title']+'</div>'+'</div>';
       }
  
        if(i==0){
          index.kdowloadField = document.getElementById('kurlField');
          index.kdowloadField.value = kPlaylistt[0]['file'];
        }
      }
  
    });
  }

  createPlayer(){
    var kPlayer = document.getElementById('kvid-screen');
    var kplayerWidth = kPlayer.clientWidth;
    index.kplayerHeight = kplayerWidth/16*9;
    index.kplayer = false;
    index.YouTubeIframeAPIReady();
  }

  YouTubeIframeAPIReady() {  
    index.kplayer = new YT.Player('kvid-screen', {
      height: index.kplayerHeight,
      width: '100%',
      height: '100%',
      playerVars: {
       showinfo: 1
      },
      events: {
        'onReady': index.PlayerReady,
        'onStateChange': index.PlayerStateChange
      }
    });
  }

  PlayerReady(event) {
    event.target.cuePlaylist({list:index.kPlaylist[0]['file']});
    index.kclicked = document.getElementById('kVideo1');
    index.kclicked.style.backgroundColor = '#1e1d1d';
  }

  PlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
      //stopVideo();
    }
  }

  kloadVideo(v){
    index.kclicked.style.backgroundColor = '#333131';
    index.kplayer.loadPlaylist({list:index.kPlaylist[v]['file']});
    index.kclicked = document.getElementById('kVideo'+(v+1));
    index.kclicked.style.backgroundColor = '#1e1d1d';
  }

  konSubmit(){
    var playList = index.kplayer.getPlaylist();
    playList.reverse();
    index.kplayer.loadPlaylist(playList);
  }

  nextPageKD(){
    index.requestPlaylists(index.ChannelId, index.yt_nextPageToken);
  }

  home(){
    index.requestPlaylists(index.ChannelId);
  }
  
  previousPageKD(){
    index.requestPlaylists(index.ChannelId, index.yt_prevPageToken);
  }
  
}//end class

const index = new Index();

function initAPI() {
  gapi.client.setApiKey(index.apiKey);
  index.next = true;
  index.makeApiCall();
  index.handleClientLoad()
}

gapi.load('client', initAPI);