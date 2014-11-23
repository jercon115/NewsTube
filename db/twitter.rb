require 'twitter'
require 'json'
require 'net/http'
require 'uri'

Twitter.configure do |config|
	config.consumer_key = 'ChH4jjRPwOn4l9ptn9q6ZZ2De'
	config.consumer_secret = '1AgZCRJBtRQiXrCJNEjfRZsRC4dqVO6dj54VF4YvMFqT5M2fww'
	config.oauth_token = '2837796245-TvfIANDk55Ek0iWSkdSlMiRofFCvOBz9GEqN1Xl'
	config.oauth_token_secret = 'ebK4ChVc866ZEqW2IrF4IwpVwAKK7wvzJGHDtan3ZdfHB'
end
str = "global warming obama" + " youtube -rt"
searcharr = Twitter.search("global warming obama" + " youtube -rt", :count => 15, :result_type => "recent").results.map do |status|
  "#{status.full_text}"
end


arr = Array.new
for $i in 0..searcharr.length-1
	array= searcharr[$i].split(" ")
	link=array.grep(/http/)
	arr[$i]=link
end

id = Array.new
$idcount=0
final = Array.new
$k =0 
for $i in 0..arr.length-1
	for $j in 0..1
		if arr[$i][$j] ==nil
			next
		end 

		if arr[$i][$j].include?('t.co') == true and arr[$i][$j].start_with?('http')==true
			string = arr[$i][$j]
			if string.start_with?('https') == true
				newstring = string[0..22]
			else  
				newstring = string[0..21]
			end
			final[$k] = newstring
			$k += 1
		end 
	end
end

extended = Array.new
for $count in 0..final.length-1
	if final[$count] == nil
		next
	end
	newstring = final[$count]
			if newstring.start_with?('http://www.youtube')
				newstring= newstring[31..41]
				if id.include?(newstring) == false
					id[$idcount]=newstring
					$idcount+=1
				end
				next
			elsif newstring.start_with?('https://www.youtube')
				newstring=newstring[32..42]
				if id.include?(newstring) == false
					id[$idcount]=newstring
					$idcount+=1
				end
				next
			end
newstring = Net::HTTP.get_response(URI.parse(final[$count]))['location']
extended[$count]= newstring
end


extended2 = Array.new
for $count in 0..extended.length-1
	if extended[$count] == nil
		next
	end
	newstring = extended[$count]
			if newstring.start_with?('http://www.youtube')
				newstring= newstring[31..41]
				if id.include?(newstring) == false
				id[$idcount]=newstring
				$idcount+=1
				end
				next
			elsif newstring.start_with?('https://www.youtube')
				newstring=newstring[32..42]
				if id.include?(newstring) == false
				id[$idcount]=newstring
				$idcount+=1
				end
				next
			end
newstring = Net::HTTP.get_response(URI.parse(extended[$count]))['location']
extended2[$count]= newstring
end

extended3 = Array.new
for $count in 0..extended2.length-1
	if extended2[$count] == nil
		next
	end
	newstring = extended2[$count]
			if newstring.start_with?('http://www.youtube')
				newstring= newstring[31..41]
				if id.include?(newstring) == false
				id[$idcount]=newstring
				$idcount+=1
				end
				next
			elsif newstring.start_with?('https://www.youtube')
				newstring=newstring[32..42]
				if id.include?(newstring) == false
				id[$idcount]=newstring
				$idcount+=1
				end
				next
			end
newstring = Net::HTTP.get_response(URI.parse(extended2[$count]))['location']
extended3[$count]= newstring
end

idstring = id[1]
for $count in 2..id.length-1
	idstring = idstring + "," + id[$count];
end