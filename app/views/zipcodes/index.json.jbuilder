json.array!(@zipcodes) do |zipcode|
  json.extract! zipcode, :code, :lat, :long
  json.url zipcode_url(zipcode, format: :json)
end