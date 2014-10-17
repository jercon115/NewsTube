require 'rubygems'
require 'grackle'
require 'json'
require 'highline/import'

$client = Grackle::Client.new(:outh => {
	:type => :oauth,
	:consumer_key => 'tJO12Hz2jQGHYEZZNWuEg',
	:consumer_secret => 'u6izuQhp6e27MYAF8HeNMttZIClDlynD15nEUwrHSE',
	:token => '868988989-SM0X85NmAzJPhVPLKUEj9SS2Ab3mBIbW7qLFpQIE',
	:token_secret => 'rVRqjYtBSLWEtX1aZrqa9P21CAMk92GfUsCC1wL8PY7Ht'
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