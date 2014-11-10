function onClientLoad() {
   gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

function searchWithIds(prominentIds, advocacyIds){  
  var q = $('#query').val();
  var category = '';

  //Prominent
  
  var category1 = 'prominent';
  displayLoading(category1);
  searchMultipleChannels(prominentIds, q, category1);

  //Local
  //searchLocal();

  //Documentary
  var category3 = 'documentary';
  displayLoading(category3);
  var dq = q.concat(" documentary");
  var requestDocumentary = gapi.client.youtube.search.list({
         q: dq,
         part: 'snippet',
         maxResults: 50
  });
  requestDocumentary.execute(function(response) {
    displayVideos(response.items, category3);
  });

  //Twitter
  twitterSearch();
  
  //Advocacy
  var category5 = 'advocacy';
  displayLoading(category5);
  searchMultipleChannels(advocacyIds, q, category5);

  //Live broadcasts
  var category6 = 'live';
  displayLoading(category6);
  var dq = q.concat(" news");
  var requestLive = gapi.client.youtube.search.list({
         q: dq,
         part: 'snippet',
		 regionCode: 'US',
		 type: 'video',
		 eventType: 'live',
         maxResults: 50
  });
  requestLive.execute(function(response) {
    displayVideos(response.items, category6, false);
  });
  
  //Geolocation
  searchGeo();
  
  openCategories();
}

function searchLocal()
{
  var q = $('#query').val();
  var category2 = 'local';    

  //var zipcode = $('#zipcode').val();
  var market = document.getElementById('marketselect').selectedIndex;
  alert(document.getElementsByTagName("option")[market].value);
  if (zipcode == '')
  {
    $('#' + category2).html('<h4>Enter a zipcode to search</h4>');
  }
  else
  {
    displayLoading(category2);
    $('#hiddenLocalHelper').load( "/localchannels?zipcode=" + $('#zipcode').val() + " #localChannelIds", function() {
      searchMultipleChannels(JSON.parse($('#localChannelIds').html()), q, category2);
    });
  }
}

function searchGeo()
{
  var q = $('#query').val();
  var category7 = 'geolocation';    

  var location = $('#loc').val();
  var radius = $('#radius').val();
  if (location == '' || radius == '')
  {
    $('#' + category7).html('<h4>Enter a location to search</h4>');
  }
  else
  {
    displayLoading(category7);
	var dq = q.concat(" news");
	var requestGeo = gapi.client.youtube.search.list({
	  q: dq,
	  part: 'snippet',
	  type: 'video',
	  location: location,
	  locationRadius: radius,
	  maxResults: 50
	});
	requestGeo.execute(function(response) {
	  displayVideos(response.items, category7, false);
	});
  }
}

function twitterSearch()
{
  var q = $('#query').val();
  var category4 = 'twitter';
  displayLoading(category4);
  q =encodeURIComponent(q);
  $('#hiddentwitter').load("/twitter?query="+ q +" #twitterID", function() {
    var str = ($('#twitterID').html());
    var requesttwitter = gapi.client.youtube.videos.list({
      part: 'snippet',
      id: str
       });
    requesttwitter.execute(function(response) {
    displayVideos(response.items, category4);
    }); 
  } );

}

function searchMultipleChannels(channelList, q, category) {
  searchMultipleChannelsRecursive(channelList, q, category, []);
}

function searchMultipleChannelsRecursive(channelList, q, category, videoList) {
  if (channelList.length < 1)
  {

    displayVideos(videoList, category);

  } else {  
     var id = channelList.pop();
     var nextRequest = gapi.client.youtube.search.list({
       q: q,
       channelId: id,
       part: 'snippet',
       order: 'date',
       maxResults: 20});

    nextRequest.execute(function(response) {
      if (typeof response.items != "undefined") {
        $.merge(videoList, response.items);
      }

      searchMultipleChannelsRecursive(channelList, q, category, videoList);
    });
  }
}

function displayVideos(videoList, category, sortVideos) {
  if(typeof(sortVideos)==='undefined') sortVideos = true;

  if (videoList == undefined || videoList.length == 0)
  {//No results
    $('#' + category).html('<h4>No videos found</h4>');
  }
  else
  {
	if (sortVideos) {
		videoList.sort(function(a,b){
		  a = new Date(a.snippet.publishedAt);
		  b = new Date(b.snippet.publishedAt);
		  return b-a;
		});
	}

    $('#' + category).html('');
    displayNextVideos(videoList, category);
  }
}

function displayNextVideos(videoList, category)
{
  var numVideosToShow = 20;
  //handle case for twitter
  if(category == 'twitter'){
    $.each(videoList.slice(0,Math.min(numVideosToShow,videoList.length)), function(index, video)
  {
    var date = new Date(video.snippet.publishedAt);
    displayVideo( video.snippet.channelTitle,
                  date.toDateString(),
                  video.id,
                  video.snippet.thumbnails.medium.url,
                  video.snippet.title,
                  category);
  });
  }
  //handle case for rest of the categories
  else{
  $.each(videoList.slice(0,Math.min(numVideosToShow,videoList.length)), function(index, video)
  {
    var date = new Date(video.snippet.publishedAt);
    displayVideo( video.snippet.channelTitle,
                  date.toDateString(),
                  video.id.videoId,
                  video.snippet.thumbnails.medium.url,
                  video.snippet.title,
                  category);
  });
  }
  if (videoList.length > numVideosToShow)
  {

    var moreBtn = $("<button>", {  
                                  id: (category + 'MoreBtn'),
                                  class: 'moreBtn'});
    moreBtn.click(function(){
      $('#' + category + 'MoreBtn').remove();
      displayNextVideos(videoList.slice(numVideosToShow), category);
    });
    $('#' + category).append(moreBtn);
  }
}

function displayVideo(channel, time, videoId, imgUrl, title, category)
{
  var video = $("<div>", {class: "vid"});
  video.append($("<div>", {class: 'videoChannelName', title: channel, text: channel}));
  video.append($("<div>", {class: 'videoDate', text: time}));

  var link = $("<a>", {href: "http://www.youtube.com/watch?v=" + videoId});
  link.append($("<img>", {src: imgUrl}));
  link.click(function() {
    $.fancybox({
        'padding'   : 0,
        'autoScale'   : false,
        'transitionIn'  : 'none',
        'transitionOut' : 'none',
        'title'     : this.title,
        'width'   : 680,
        'height'    : 495,
        'href'      : this.href.replace(new RegExp("watch\\?v=", "i"), 'v/'),
        'type'      : 'swf',
        'swf'     : {
            'wmode'    : 'transparent',
            'allowfullscreen' : 'true'
        }
    });
    return false;
  });
  
  video.append(link);
  video.append(title);

  $('#' + category).append(video);
}

function getTopVideos(prominentIds, advocacyIds)
{
	getTopVideosRecursive(prominentIds.concat(advocacyIds), [])
}

function getTopVideosRecursive(channelList, videoList) {
  if (channelList.length < 1 || videoList.length > 50)
  {

	displayTopVideos(videoList.splice(0,Math.min(50,videoList.length)));

  } else {  
	var id = channelList.pop();
	var d = new Date();
	d.setDate(d.getDate()-2);
	var nextRequest = gapi.client.youtube.search.list({
		channelId: id,
		part: 'snippet',
		order: 'viewCount',
		type: 'video',
		publishedAfter: ISODateString(d),
		maxResults: 1});
		
	nextRequest.execute(function(response) {
		if (typeof response.items != "undefined") {
			$.merge(videoList, response.items);
		}

		getTopVideosRecursive(channelList, videoList);
    });
  }
}

function displayTopVideos(videoList) {
	if (videoList == undefined || videoList.length == 0)
	{//No results
		$('#topNewsVideos').html('<h4>No videos found</h4>');
	}
	else
	{
		var videoIds = "";
		$.each(videoList, function(index, video) {
			videoIds += video.id.videoId;
			if (index < videoList.length-1) videoIds += ',';
		});
		
		var request = gapi.client.youtube.videos.list({
		   id: videoIds,
		   part: 'statistics'});
		
		request.execute(function(response) {
		  if (typeof response.items == "undefined") alert("undefined");
		  if (typeof response.items != "undefined") {
			response.items.sort(function(a,b){
			  a = parseInt(a.statistics.viewCount);
			  b = parseInt(b.statistics.viewCount);
			  return b-a;
			});
			
			var topHtml = '';
			//var mid = Math.floor(response.items.length*1.0/4.0);
			//var start = Math.max(0,mid-2);
			//var end = Math.min(response.items.length,mid+3);
			var count = 1;
			$.each(response.items.slice(0,5), function(index, video) {
				var videoHtml = '<iframe';
				videoHtml += ' id="topVid'+count+'"';
				videoHtml += ' class="topVid" width="640" height="390" src="http://www.youtube.com/embed/';
				videoHtml += video.id;
				videoHtml += '?enablejsapi=1" frameborder="0" allowfullscreen></iframe>';
				
				topHtml += videoHtml;
				count++;
			});
			$('#topNewsVideos').html(topHtml);
			handleTopVid('topVid1');
		  }
		});
	}
}

function ISODateString(d){
 function pad(n){return n<10 ? '0'+n : n}
 return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z';
}