class AddBgColorToWebs < ActiveRecord::Migration
  def change
    add_column :webs, :bg_color, :string
  end
end
