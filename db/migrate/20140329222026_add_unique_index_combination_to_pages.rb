class AddUniqueIndexCombinationToPages < ActiveRecord::Migration
  def change
    add_index :pages, [:web_id, :name], unique: true
  end
end
