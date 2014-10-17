require 'csv'

class ZipcodesController < ApplicationController
  before_action :set_zipcode, only: [:show, :edit, :update, :destroy]

  # GET /zipcodes
  # GET /zipcodes.json
  def index
    @zipcodes = Zipcode.all
  end

  # GET /zipcodes/1
  # GET /zipcodes/1.json
  def show
  end

  def loadzipdb
    Zipcode.import_data(params[:import_csv][:csv].read)
    
    redirect_to :action => "index"
  end

  def resetzipdb
    Zipcode.delete_all
    
    redirect_to :action => "index"
  end

  # GET /zipcodes/new
  def new
    @zipcode = Zipcode.new
  end

  # GET /zipcodes/1/edit
  def edit
  end

  # POST /zipcodes
  # POST /zipcodes.json
  def create
    @zipcode = Zipcode.new(zipcode_params)

    respond_to do |format|
      if @zipcode.save
        format.html { redirect_to @zipcode, notice: 'Zipcode was successfully created.' }
        format.json { render action: 'show', status: :created, location: @zipcode }
      else
        format.html { render action: 'new' }
        format.json { render json: @zipcode.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /zipcodes/1
  # PATCH/PUT /zipcodes/1.json
  def update
    respond_to do |format|
      if @zipcode.update(zipcode_params)
        format.html { redirect_to @zipcode, notice: 'Zipcode was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @zipcode.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /zipcodes/1
  # DELETE /zipcodes/1.json
  def destroy
    @zipcode.destroy
    respond_to do |format|
      format.html { redirect_to zipcodes_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_zipcode
      @zipcode = Zipcode.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def zipcode_params
      params.require(:zipcode).permit(:code, :lat, :long)
    end
end
