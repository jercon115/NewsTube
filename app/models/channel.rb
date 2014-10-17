class Channel < ActiveRecord::Base
	def self.import_data(csv)    
	    CSV.parse(csv) do |row|
	        Channel.create(:name => row[0], :category => row[1], :zipcode => row[2], :channelid => row[3])
	    end
	end

	def self.to_csv
    CSV.generate do |csv|
      all.each do |channel|
        csv << channel.attributes.values_at("name", "category", "zipcode", "channelid")
      end
    end
  end
end
