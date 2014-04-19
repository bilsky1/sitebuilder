class CreateNavigations < ActiveRecord::Migration
  def change
    create_table :navigations do |t|
      t.integer :web_id
      t.integer :page_id
      t.integer :page_position

      t.timestamps
    end

    add_index :navigations, :web_id
    add_index :navigations, :page_id
    add_index :navigations, [:web_id, :page_id], unique: true
  end
end
