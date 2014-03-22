class CreatePages < ActiveRecord::Migration
  def change
    create_table :pages do |t|
      t.integer :web_id
      t.string :name
      t.text :content
      t.string :title
      t.string :meta_keywords
      t.string :meta_description

      t.timestamps
    end
    add_index :pages, [:web_id]
  end
end
