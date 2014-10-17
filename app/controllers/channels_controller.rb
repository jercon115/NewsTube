require 'net/http'
require 'csv'

class ChannelsController < ApplicationController
  before_action :set_channel, only: [:show, :edit, :update, :destroy]

  # GET /channels
  # GET /channels.json
  def index
    @channels = Channel.order(:name)
    @channel = Channel.new
    respond_to do |format|
      format.html
      format.csv { send_data @channels.to_csv }
    end
  end

  def iderror
  end

  def loadchanneldb
    Channel.import_data(params[:import_csv][:csv].read)
    
    redirect_to :action => "index"
  end

  def resetchanneldb
    Channel.delete_all
    
    redirect_to :action => "index"
  end

  # GET /channels/1
  # GET /channels/1.json
  def show
  end

  # GET /channels/new
  def new
    @channel = Channel.new
  end

  # GET /channels/1/edit
  def edit
  end

  # POST /channels
  # POST /channels.json
  def create
    @channel = Channel.new(channel_params)

    uri = URI('https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=' + @channel.name + '&key=AIzaSyAFxd-832oMCK_33cqsRBBoh7EdYHzV2oM')
    response = JSON.parse(Net::HTTP.get(uri))

    respond_to do |format|
      if response["items"] && response["items"].length > 0
        @channel.channelid = response["items"][0]["id"]

        if @channel.save
          format.html { redirect_to channels_url }
        else
          format.html { render action: 'new' }
          format.json { render json: @channel.errors, status: :unprocessable_entity }
        end
      else
        format.html { render action: 'iderror' }
      end
    end
  end

  # PATCH/PUT /channels/1
  # PATCH/PUT /channels/1.json
  def update
    respond_to do |format|
      if @channel.update(channel_params)
        format.html { redirect_to @channel, notice: 'Channel was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @channel.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /channels/1
  # DELETE /channels/1.json
  def destroy
    @channel.destroy
    respond_to do |format|
      format.html { redirect_to channels_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_channel
      @channel = Channel.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def channel_params
      params.require(:channel).permit(:name, :category, :zipcode, :channelid)
    end
end
