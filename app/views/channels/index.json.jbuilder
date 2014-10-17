json.array!(@channels) do |channel|
  json.extract! channel, :name, :category, :zipcode, :channelid
  json.url channel_url(channel, format: :json)
end