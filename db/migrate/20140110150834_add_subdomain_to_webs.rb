class AddSubdomainToWebs < ActiveRecord::Migration
  def change
    add_column :webs, :subdomain, :string, default: ''
    add_index :webs, :subdomain
  end
end
