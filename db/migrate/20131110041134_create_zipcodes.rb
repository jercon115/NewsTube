class CreateZipcodes < ActiveRecord::Migration
  def change
    create_table :zipcodes do |t|
      t.string :code
      t.string :lat
      t.string :long

      t.timestamps
    end
  end
end
