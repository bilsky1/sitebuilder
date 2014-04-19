class CreateAjaxContents < ActiveRecord::Migration
  def change
    create_table :ajax_contents do |t|
      t.text :content
      t.text :content_after
      t.integer :page_id

      t.timestamps
    end
    add_index :ajax_contents, :page_id
  end
end
