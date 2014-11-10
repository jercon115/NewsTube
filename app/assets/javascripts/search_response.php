<?php

if(!empty($_GET['q'])){
	$search_terms=htmlspecialchars($_GET['q']);		

	//Create an OAuth Connection
	require 'app_tokens.php';
	require 'tmhOAuth.php';
	$connection = new thmOauth(array(
		'consumer_key' => 'ChH4jjRPwOn4l9ptn9q6ZZ2De',
		'consumer_secret' => '1AgZCRJBtRQiXrCJNEjfRZsRC4dqVO6dj54VF4YvMFqT5M2fww',
		'user_token' =>'2837796245-TvfIANDk55Ek0iWSkdSlMiRofFCvOBz9GEqN1Xl',
		'user_secret' => 'ebK4ChVc866ZEqW2IrF4IwpVwAKK7wvzJGHDtan3ZdfHB'
		));

	$http_code = $connection->request('GET',$connection->url('1.1/search/tweets'), 
	array('q' => $search_terms,
	'count' => 100,
	'lang' => 'en',
	'type' => 'recent'));

	// Search was successful
	if ($http_code == 200) {
	// Extract the tweets from the API response
	$response = json_decode($connection->response['response'],true);
	$tweet_data = $response['statuses']; 
	// Accumulate tweets from search results
	$tweet_stream = '';
	foreach($tweet_data as $tweet) {
	// Ignore retweets
	if (isset($tweet['retweeted_status'])) {
	continue;
	}
	// Add this tweet's text to the results
	$tweet_stream .= $tweet['text'] . '<br/><br/>';
	}
	// Send the result tweets back to the Ajax request
	print $tweet_stream;
	// Handle errors from API request
	} else {
	if ($http_code == 429) {
	print 'Error: Twitter API rate limit reached';
	} else {
	print 'Error: Twitter was not able to process that search';Javascript Programming for Twitter API 1.1 13
	}
	}
	} else {
	print 'No search terms found';
	}
?>
