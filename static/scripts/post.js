// static/scripts/post.js
class Post{
  constructor(){
    this.blogId = '3212243556817590089';
    this.postSumNum = 100;
  }

  toKhDate(date){
    var dt = new Date(date);
    var d = dt.getDate();
    var m = dt.getMonth()+1;
    var y = dt.getFullYear();
    var khDate = d+'/'+m+'/'+y;
    return khDate;
  }

  setPostVid(eleId){
    var playlist = document.createElement( 'div' );
    var description = document.createElement( 'div');
    description.className = 'description';
    var post = document.getElementById(eleId);
    var kbplayer = document.getElementById("KBPlayer");
  
    var str = post.getElementsByClassName("__video-id__")[0].getAttribute("data-id");
    playlist.innerHTML = post.getElementsByClassName("__playlist__")[0].getAttribute("data-pl");
    description.innerHTML = post.getElementsByClassName("__description__")[0].innerHTML;
  
    kbplayer.parentElement.insertBefore(description, kbplayer.nextSibling);
    var startIndex = str.indexOf('{');
    var endIndex = str.indexOf('}');
    var vidId = str.slice(startIndex+1,endIndex);

    if(str.indexOf('googledrive') != -1)
      var iframeSrc = 'https://docs.google.com/file/d/'+vidId+'/preview';
    else if(str.indexOf('youtube') != -1)
      var iframeSrc = '//www.youtube.com/embed/'+vidId;
    else if(str.indexOf('ytpl') != -1)
      var iframeSrc = 'https://www.youtube.com/embed/videoseries?list='+vidId;
    else if(str.indexOf('facebookvid') != -1)
      var iframeSrc = 'https://www.facebook.com/watch/?v='+vidId;
    else if(str.indexOf('dailymotion') != -1)
      var iframeSrc = '//www.dailymotion.com/embed/video/'+vidId+'?logo=0&info=0';
    else if(str.indexOf('vimeo') != -1)
      var iframeSrc = '//player.vimeo.com/video/'+vidId;
    else if(str.indexOf('ok') != -1)
      var iframeSrc = '//ok.ru/videoembed/'+vidId;

    if(str.indexOf('facebookvid') != -1)
      var postContent = '<div class="fb-video" data-width="auto" data-autoplay="false" data-allowfullscreen="true" data-href="'+iframeSrc+'"></div>';
    else
      var postContent = '<div id="player-outer"><iframe id="player" src="'+iframeSrc+'" frameborder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen scrolling=NO ></iframe></div';
   
    post.innerHTML = postContent;

    str = playlist.innerHTML;
    if(str.indexOf('pl') != -1){
      var startIndex = str.indexOf('[');
      var endIndex = str.indexOf(']');
      this.pl = str.slice(startIndex+1,endIndex);
     
      var relatedPostUrl = 'https://www.blogger.com/feeds/'+this.blogId+'/posts/default/-/'+this.pl+'?alt=json-in-script&callback=post.getPlaylist&max-results=150&start-index=1';
      $.getScript(relatedPostUrl);   
    }
  }

  getPlaylist(json){
    this.getPost(json);

    var html = '';
    var focusPart = '';

    html = ('<div id="relatedPosts" >');
    for(var i=0;i<this.postList.length; i++){
      html += ('<div class="div-part" id="Part'+i+'" >');
      html += ('<a class="thumb" href="/post/'+this.postId[i]+'/">');
      html += ('<img  src="/static/images/playlist.jpg" />');
      html += ('</a>');
      html += ('<a class="vid-title" href="/post/'+this.postId[i]+'/">'+this.postTitle[i]+'</a>');
      html += ('</div>');
      if(this.postId[i] == POSTID){
        focusPart = 'Part'+i;
      } 
    }  
    html += ('</div>');
  
    $('#KBPlayer').append(html);

    $('#'+focusPart).css('background-color', '#282828');
    $('#'+focusPart+' .vid-title').css('color', 'orange');

    var container = $('#relatedPosts');
    var element = $('#'+focusPart);

    container.animate({
      scrollTop: container.scrollTop = container.scrollTop() + element.offset().top - container.offset().top
    }, {
      duration: 1000,
      specialEasing: {
        width: 'linear',
        height: 'easeOutBounce'
      },
      complete: function (e) {
        //console.log("animation completed");
      }
    });
  }

  getPost(json){
    this.postUrl = [];
    this.postTitle = [];
    this.postThumb = [];
    this.postDate = [];
    this.postContentSum = [];
    this.postId = [];
    this.postData = [];
  
    var postList = json.feed.entry;
  
    this.totalPost = json.feed.openSearch$totalResults.$t;
    this.postList = postList;
    for(var i =0; i<postList.length; i++){
      for (var j = 0; j < postList[i].link.length; j++) {
        if (postList[i].link[j].rel == 'alternate') {
          this.postUrl.push(postList[i].link[j].href);
          break;
        }
      }
      var postContent = postList[i].content.$t;
      this.postData.push(postContent);
      var index = (this.postList[i].id.$t).indexOf("post");
      var postId = (this.postList[i].id.$t).slice(index+5);
      this.postId.push(postId);
      this.postContentSum.push(this.removeHtmlTag(postContent));
      this.postTitle.push(postList[i].title.$t);
      this.postThumb.push(this.createThumb(postContent));
      this.postDate.push(postList[i].published.$t);
    }
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

  removeHtmlTag(strx){
    var div = document.createElement( 'div' );
    div.innerHTML = strx;
    strx = div.innerHTML;
  
    var chop = this.postSumNum;
    if(strx.indexOf("<")!=-1){
      var s = strx.split("<");
      for(var i=0;i<s.length;i++){
        if(s[i].indexOf(">")!=-1){
          s[i] = s[i].substring(s[i].indexOf(">")+1,s[i].length);
      }
    }
    strx = s.join("");
    }
    chop = (chop < strx.length-1) ? chop : strx.length-1;
    while(strx.charAt(chop-1)!=' ' && strx.indexOf(' ',chop)!=-1) 
      chop++;
    strx = strx.substring(0,chop-1);
    return strx+'...';
  }  
    
}//end class

const post = new Post();