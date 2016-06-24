class DropTableOfAdmins < ActiveRecord::Migration
  def up
    drop_table :admins
  end

  def down
    create_table :admins do |t|
      t.string :name
      t.string :password_digest

      t.timestamps null: false
    end
  end
end
