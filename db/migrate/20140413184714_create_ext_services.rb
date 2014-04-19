class CreateExtServices < ActiveRecord::Migration
  def change
    create_table :ext_services do |t|
      t.integer :web_id
      t.string :service_type
      t.text :service_value

      t.timestamps
    end
    add_index :ext_services, :web_id
  end
end
