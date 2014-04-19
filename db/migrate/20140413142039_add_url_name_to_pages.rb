class AddUrlNameToPages < ActiveRecord::Migration
  def change
    add_column :pages, :url_name, :string
    add_index :pages, [:url_name]
  end
end
