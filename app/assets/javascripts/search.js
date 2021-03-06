function onClientLoad() {
	gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

function onYouTubeApiLoad() {
	gapi.client.setApiKey('AIzaSyAFxd-832oMCK_33cqsRBBoh7EdYHzV2oM'); //Change to your own Youtube API key here
	$.getScript('https://maps.googleapis.com/maps/api/js?sensor=false&callback=onMapsLoad&key=AIzaSyDrX4G5qqb8QKy7MYCRLmViieJ6oT-DqFw'); // Change to your own Google maps API key here
	homeTopVideos();
}

function onMapsLoad() {
	geocoder = new google.maps.Geocoder();
}

function searchWithIds(prominentIds, advocacyIds){  
  var q = $('#queryFormMajor input[name=query]').val();
  getFreebaseData(q, 'relatedMajor', 'queryFormMajor');
  var category = '';

  //Prominent
  
  var category1 = 'prominent';
  displayLoading(category1);
  searchMultipleChannels(prominentIds, q, category1);
  
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
  twitterSearch(q);
  
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
  
  openCategories('majorCategories','prominent');
}

function searchWithLocal(localids)
{
   var x = document.getElementById("marketselect").selectedIndex;
   var mchoice = document.getElementsByTagName("option")[x].value;
   var locallist =[];
      for (var i = 0; i < localids[0].length; i++){
         if (localids[0][i] == mchoice) {
            if (localids[1][i] != null) {
               locallist.push(localids[1][i]);
            }         
         }
      }
  var category2 = 'local';
  var q;
  if ($('#queryFormLocal input[name=query]').val()) {
   q = $('#queryFormLocal input[name=query]').val();
  }
  else {
   q = '';
  }
  getFreebaseData(q, 'relatedLocal', 'queryFormLocal');
  
  displayLoading(category2);
  searchMultipleChannels(locallist, q, category2);
  
  openCategories('localChannelsCategories','local');
}

function searchWithGeo() {
	var q = $('#queryFormGeo input[name=query]').val();
	getFreebaseData(q, 'relatedGeo', 'queryFormGeo');

	var inputSearchLocation = $('#loc').val();
	var inputSearchRadius = $('#radius').val();
	var category7 = 'geolocation';
	
	if (inputSearchLocation == '' || inputSearchRadius == '')
	{
		$('#' + category7).html('<h4>Enter a location to search</h4>');
	}
	else
	{
		geocoder.geocode({ 'address': inputSearchLocation }, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				//store latitude and longitude from geo coder into vars
				var lat = results[0].geometry.location.lat();
				var lng = results[0].geometry.location.lng();

				displayLoading(category7);
				var dq = q.concat(" news");
				var requestGeo = gapi.client.youtube.search.list({
				  q: dq,
				  part: 'snippet',
				  type: 'video',
				  location: lat+','+lng,
				  locationRadius: inputSearchRadius,
				  maxResults: 50
				});
				requestGeo.execute(function(response) {
				  displayVideos(response.items, category7);
				});
				
			} else {
				$('#' + category7).html('<h4>Location not found</h4>');
			}
		});
	}
	
	openCategories('geotaggedCategories','geolocation');
}

function twitterSearch(q)
{
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
	d.setDate(d.getDate()-1);
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
		   part: 'snippet, statistics'});
		
		request.execute(function(response) {
		  if (typeof response.items == "undefined") alert("undefined");
		  if (typeof response.items != "undefined") {
			response.items.sort(function(a,b){
			  a = parseInt(a.statistics.viewCount);
			  b = parseInt(b.statistics.viewCount);
			  return b-a;
			});
			
			$.each(response.items.slice(0,5), function(index, video) {
				var date = new Date(video.snippet.publishedAt);
				var newSlide = makeHomeSlide(video.snippet.channelTitle,
					date.toDateString(),
					video.id,
					video.snippet.thumbnails.high.url,
					video.snippet.title)
				$('#homeSlides').append(newSlide);
			});
			
			initScrolling();
		  }
		});
	}
}

function makeHomeSlide(channel, time, videoId, imgUrl, title)
{
	var slide = $("<div>", {class: "homeSlide"});
	
	var video = $("<div>", {class: "videoDiv", style: "background-image: url(\'"+imgUrl+"\'); cursor: pointer; cursor: hand;"});
	var desc = $("<div>", {class: "slideDesc"});
	desc.append($("<div>", {class: "videoChannelName", title: channel, text: channel}));
	desc.append($("<div>", {class: "videoDate", text: time}));
	video.append(desc);
	
	video.append($("<div>", {class: "slideTitle", text: title}));
	video.append($("<div>",{class: "playButton"}));
	
	slide.append(video);
	slide.append($("<iframe>", {class: "player", width: "640", height: "390", frameborder: "0", allowfullscreen: true}));
	
	slide.click(function() {
		stopScrolling();
		
		var iframe = $(this).find("iframe")[0];
		var videoDiv = $(this).find(".videoDiv")[0];
		
		if (iframe) iframe.src = 'http://www.youtube.com/embed/' + videoId + '?enablejsapi=1&autoplay=1';
		if (videoDiv) videoDiv.style.display = 'none';
	});

	return slide;
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

function getFreebaseData(query, relatedtermsID, target) {
	var service_url = 'https://www.googleapis.com/freebase/v1/search';
	var params = {
		'key': 'AIzaSyB0Dyk_agM7muZMzeuIsU2IEEJ7tkNeZ-U', // Your Freebase API Key
		'query': query,
		'limit': 5,
		'indent': true
	};
	$.getJSON(service_url + '?callback=?', params, function(response) {		
		if (response.result) {
			$('#'+relatedtermsID).html('Related searches: ');
			$.each(response.result, function(i, result) {
				$('#'+relatedtermsID).append(
					makeRelatedTerm(result.name, target)
				);
			});
		}
	});
}

function makeRelatedTerm(term, targetForm) {
	var relatedTerm = $("<div>", {class: "relatedTerm"});

	var link = $("<a>", {text: term});
	link.click(function() {
		$('#'+targetForm+' input[name=query]').val(term);
		document.getElementById(targetForm).submit();
	});
	relatedTerm.append(link);

	return relatedTerm;
}