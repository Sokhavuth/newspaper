// static/scripts/post.js
class Post{
  constructor(){
    this.apiKey = 'AIzaSyCDMr6toQGyDRFPChRsbQ2sheSQfTQLVqg';
    this.blogId = '3212243556817590089';
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

    if(str.indexOf('googledrive') != -1){
      var iframeSrc = 'https://docs.google.com/file/d/'+vidId+'/preview';

    }
  
    else if(str.indexOf('youtube') != -1){
      var iframeSrc = '//www.youtube.com/embed/'+vidId;

    }

    else if(str.indexOf('facebookvid') != -1){
      var iframeSrc = 'https://www.facebook.com/watch/?v='+vidId;
    
    }

    else if(str.indexOf('dailymotion') != -1){
      var iframeSrc = '//www.dailymotion.com/embed/video/'+vidId+'?logo=0&info=0';

    }

    else if(str.indexOf('vimeo') != -1){
      var iframeSrc = '//player.vimeo.com/video/'+vidId;

    }

    else if(str.indexOf('ok') != -1){
      var iframeSrc = '//ok.ru/videoembed/'+vidId;

    }


    if(str.indexOf('facebookvid') != -1){
      var postContent = '<p width="100%" id="fb-outer">';
      postContent += '<div class="fb-video" data-width="auto" data-autoplay="false" data-allowfullscreen="true" data-href="'+iframeSrc+'"></div>';
      postContent += '</p>'; 
    }
    
    else{
      var postContent = '<div id="player-outer"><iframe id="player" src="'+iframeSrc+'" frameborder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen scrolling=NO ></iframe></div';
    }
   
    post.innerHTML = postContent;

    var Player = post.getElementsByTagName('iframe');
   
    if(str.indexOf('facebookvid') == -1){
      var vidWidth = Player[0].clientWidth;
      Player[0].height = vidWidth / 16 * 9;
    }
    
  }
    
}//end class

const post = new Post();