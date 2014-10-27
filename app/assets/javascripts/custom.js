function initSearch() {
	$.get( 'http://freegeoip.net/json', function( data ) {
      if (data.zipcode != "undefined" && data.zipcode != "")
      {
      	$('#zipcode').val(data.zipcode);
      }
    });
	
	getTopVideos();
}

function toggleCategory(category)
{
	$('#' + category + 'TriWrapper').slideToggle('slow');
	$('#' + category + 'Wrapper').slideToggle('slow');
}

function displayLoading(category)
{
	$('#' + category).html('<h4>Loading videos...</h4><img style="margin-top:30px" src="assets/fancybox_loading.gif"/>');
}

function openCategories()
{
	var isOnLandingPage = $('#landingPage').val();
	if (isOnLandingPage == 'true')
	{
		$( ".header" ).animate({
		    marginTop: 0,
		    height: '100px',
		    borderLeftWidth: "200px"
		  }, 1500);

		$( "#headerContents").fadeOut('slow');
		$( "#headerContents").queue(function() {
			adjustHeaderCSS();
			$( this ).dequeue();
		})
		$("#headerContents").fadeIn('slow');

		$('.categories').fadeIn('slow');

		toggleCategory('prominent');

		$('#landingPage').val('false');
	}
}

function adjustHeaderCSS()
{
	$(".title").css({
	 	fontSize:"50px",
	 	lineHeight: "50px"
	 });

	$(".logo").css({
		position: 'absolute',
		textAlign: "left",
		left: "20px"
	});

	$("#headerImages").css({
		display: 'none'
	});

	$(".queryForm").css({
		display: "inline-block",
		width: "360px",
		textAlign: "center",
		verticalAlign: "top",
		marginTop: "30px",
		marginLeft: "360px",
		marginRight: "360px" 		 
	});

	$(".header").css({
		marginBottom: "0px"
	});
}

function getTopVideos()
{
	var topVideos = gapi.client.youtube.videos.list({
		   part: 'snippet',
		   chart: 'mostPopular',
		   regionCode: 'US',
		   videoCategoryId: '25',
		   maxResults: 5});
	
	$.each(videoList.items.slice(0,0), function(index, video)
	{
		var topHtml = '<div class="description">Top News Videos:</div><br>'
		topHtml += '<iframe width="640" height="390" src="http://www.youtube.com/embed/';
		topHtml += video.id;
		topHtml += 'frameborder="0" allowfullscreen></iframe>';
		$('#topNewsVideos').html(topHtml);	
	});
}
