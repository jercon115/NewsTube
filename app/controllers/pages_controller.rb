    require 'twitter'
    require 'json'
    require 'net/http'
    require 'uri' 

class PagesController < ApplicationController
  
  def home
    @prominentIds = Channel.where(:category => 'prominent').pluck(:channelid)
    @advocacyIds = Channel.where(:category => 'advocacy').pluck(:channelid)
	@zip = Channel.where(:category => 'local').pluck(:zipcode)
	@id = Channel.where(:category => 'local').pluck(:channelid)
    @localIds = [ @zip, @id ]
  end

  def localchannels
    @prominentIds = Channel.where(:category => 'prominent').pluck(:channelid)
    @advocacyIds = Channel.where(:category => 'advocacy').pluck(:channelid)
	@zip = Channel.where(:category => 'local').pluck(:zipcode)
	@id = Channel.where(:category => 'local').pluck(:channelid)
    @localIds = [ @zip, @id ]
    #zipcode =  params[:zipcode]
    #
    #@localIds = []
    #
    #if (zipcode != nil && zipcode != '')
    #
    #  zip1 = Zipcode.where(:code => zipcode[0,3])
    #  if zip1.present?
    #
    #    latLong1 = [zip1[0].lat.to_f, zip1[0].long.to_f]
    #
    #    Channel.where(:category => 'local').each do |channel|
    #      zip2 = Zipcode.where(:code => channel.zipcode[0,3])
    #      if zip2.present?
    #        latLong2 = [zip2[0].lat.to_f, zip2[0].long.to_f]
    #
    #        distance = Zipcode.distance(latLong1, latLong2)
    #
    #        if (distance < 160)  #this is in kilometers
    #          @localIds << channel.channelid
    #        end
    #      end
    #    end
    #  end
    #end
  end

  def twitter
	#please use your own api keys here 
	client = Twitter::REST::Client.new do |config|
	  config.consumer_key        = 'ChH4jjRPwOn4l9ptn9q6ZZ2De'
	  config.consumer_secret     = '1AgZCRJBtRQiXrCJNEjfRZsRC4dqVO6dj54VF4YvMFqT5M2fww'
	  config.access_token        = '2837796245-TvfIANDk55Ek0iWSkdSlMiRofFCvOBz9GEqN1Xl'
	  config.access_token_secret = 'ebK4ChVc866ZEqW2IrF4IwpVwAKK7wvzJGHDtan3ZdfHB'
	end
    query = params[:query] 
    searcharr = client.search(query +" youtube -rt", :result_type => "recent").take(40).collect do |status|
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
    @twitter = idstring
  end

end
