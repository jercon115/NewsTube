    require 'twitter'
    require 'json'
    require 'net/http'
    require 'uri' 

class LocalsourcesController < ApplicationController
  def findvideos

  end


  def home
    @prominentIds = Channel.where(:category => 'prominent').pluck(:channelid)
    @advocacyIds = Channel.where(:category => 'advocacy').pluck(:channelid)
  end

  def localchannels
    @localIds = Channel.where(:category => 'local').pluck(:channelid)
  end
end

