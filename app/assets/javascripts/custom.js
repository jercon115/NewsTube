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

function openCategories(section, firstCategory)
{
	var isOnLandingPage = $('#'+section+' #landingPage').val();
	if (isOnLandingPage == 'true')
	{
		$('#'+section+'.categories').fadeIn('slow');
		$('#'+section+' #landingPage').val('false');

		if(firstCategory) toggleCategory(firstCategory);
	}
}

function handleTopVid(selectedVid) {
	$(".topVid").css("display","inline");
	// Pause all videos
	$(".topVid").each(function() {
		this.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
	});
	
	//$('#' + selectedVid).css("display","inline");
}

function initScrolling() {
	scrollHomeSlides(1);
	var homeSlideshow = document.getElementById("homeSlideshow");
	if (!homeSlideshow.interval){
		homeSlideshow.interval = setInterval(function(){
			var slide = $('#homeSlideshow').data('slide');
			
			if (slide < 5) {
				scrollNext();
			} else {
				scrollHomeSlides(1);
			}
        },10000);
	}
}

function onPlayerStateChange(event) {
	stopScrolling();
}

function stopScrolling() {
	var homeSlideshow = document.getElementById("homeSlideshow");
	if (homeSlideshow.interval) clearInterval(homeSlideshow.interval);
}

function resetHomeSlides() {
	$(".homeSlide").each(function() {
		var iframe = $(this).find("iframe")[0];
		var videoDiv = $(this).find(".videoDiv")[0];
		
		if (iframe) iframe.src = '';
		if (videoDiv) videoDiv.style.display = 'block';
	});
}

function scrollHomeSlides(slide) {
	resetHomeSlides();

	$('#homeSlideshow').data('slide',slide);
    $('#homeSlideshow').animate({
        scrollLeft: slide*640
    }, 600);
	
	var next = document.getElementById("nextSlideButton");
	var prev = document.getElementById("prevSlideButton");
	
	if (slide == 5) {next.disabled = true;}
	else {
		if (next.disabled) next.disabled = false;
	}
	if (slide == 1) {prev.disabled = true;}
	else {
		if (prev.disabled) prev.disabled = false;
	}
}

function scrollNext() {
	if ($('#homeSlideshow').is(':animated')) return;

	var slide = $('#homeSlideshow').data('slide');
	if (slide < 5) slide++;
	
	scrollHomeSlides(slide);
}

function scrollPrev() {
	if ($('#homeSlideshow').is(':animated')) return;

	var slide = $('#homeSlideshow').data('slide');
	if(slide > 1) slide--;
	
	scrollHomeSlides(slide);
}

function selectTab(doc, tab) {
	$('.tab').removeClass('selected');
	$(doc).addClass('selected');
	
    $('#searchSection').animate({
        scrollLeft: tab*960
    }, 600);
}
