class CreateChannels < ActiveRecord::Migration
  def change
    create_table :channels do |t|
      t.string :name
      t.string :category
      t.string :marketcode
      t.string :channelid

      t.timestamps
    end
  end
end
