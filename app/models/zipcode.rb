class Zipcode < ActiveRecord::Base
	def self.import_data(csv)    
	    CSV.parse(csv) do |row|
	        Zipcode.create(:code => row[0], :lat => row[1], :long => row[2])
	    end
	end

	def to_rad
		self * Math::PI / 180
	end
	 
	  # http://www.movable-type.co.uk/scripts/latlong.html
	  # loc1 and loc2 are arrays of [latitude, longitude]
	def self.distance loc1, loc2
	     lat1, lon1 = loc1
	     lat2, lon2 = loc2
	     dLat = (lat2-lat1)* Math::PI / 180;
	     dLon = (lon2-lon1)* Math::PI / 180;
	     a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	         Math.cos(lat1* Math::PI / 180) * Math.cos(lat2* Math::PI / 180) *
	         Math.sin(dLon/2) * Math.sin(dLon/2);
	     c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	     d = 6371 * c; # Multiply by 6371 to get Kilometers
	end
end
