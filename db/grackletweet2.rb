require 'rubygems'
require 'grackle'
require 'json'
require 'highline/import'

$client = Grackle::Client.new(:outh => {
	:type => :oauth,
	:consumer_key = 'ChH4jjRPwOn4l9ptn9q6ZZ2De',
	:consumer_secret = '1AgZCRJBtRQiXrCJNEjfRZsRC4dqVO6dj54VF4YvMFqT5M2fww',
	:token = '2837796245-TvfIANDk55Ek0iWSkdSlMiRofFCvOBz9GEqN1Xl',
	:token_secret = 'ebK4ChVc866ZEqW2IrF4IwpVwAKK7wvzJGHDtan3ZdfHB'
	})
	
class Twitter
	def getJsonData
		@json = $client.users.show? :screen_name => 'senlutomchen' #http://twitter.com/users/show.json?screen_name=senlutomchen
	end

	def parseIt
		puts @json.name
		puts @json.location
		puts @json.decription 
	end
end