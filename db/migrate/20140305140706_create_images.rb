class CreateImages < ActiveRecord::Migration
  def change
    create_table :images do |t|
      t.integer :page_id
      t.text :name

      t.timestamps
    end
    add_index :images, [:page_id]
  end
end
