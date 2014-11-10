function initSearch() {
	$.get( 'http://freegeoip.net/json', function( data ) {
      if (data.zipcode != "undefined" && data.zipcode != "")
      {
      	$('#zipcode').val(data.zipcode);
      }
    });
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

	$(".headerTopVideos").css({
		display: 'none'
	});

	$(".queryForm").css({
		display: "inline-block",
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

function handleTopVid(selectedVid) {
	$(".topVid").css("display","none");
	// Pause all videos
	$('iframe[src*="http://www.youtube.com/embed/"]').each(function(i) {
		this.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
	});
	
	$('#' + selectedVid).css("display","inline");
}
