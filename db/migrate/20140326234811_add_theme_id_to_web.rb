class AddThemeIdToWeb < ActiveRecord::Migration
  def change
    add_column :webs, :theme_id, :integer
    add_index :webs, :theme_id
  end
end
