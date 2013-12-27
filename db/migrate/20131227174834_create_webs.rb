class CreateWebs < ActiveRecord::Migration
  def change
    create_table :webs do |t|
      t.string :name
      t.integer :user_id
      t.string :header_content
      t.string :footer_content
      t.boolean :published, default: false
      t.datetime :published_at
      t.string :favicon_src

      t.timestamps
    end
    add_index :webs, [:user_id]
  end
end
