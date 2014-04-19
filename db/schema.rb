# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140418155529) do

  create_table "ajax_contents", force: true do |t|
    t.text     "content"
    t.text     "content_after"
    t.integer  "page_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "ajax_contents", ["page_id"], name: "index_ajax_contents_on_page_id"

  create_table "ext_services", force: true do |t|
    t.integer  "web_id"
    t.string   "service_type"
    t.text     "service_value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "ext_services", ["web_id"], name: "index_ext_services_on_web_id"

  create_table "images", force: true do |t|
    t.integer  "page_id"
    t.text     "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image"
  end

  create_table "navigations", force: true do |t|
    t.integer  "web_id"
    t.integer  "page_id"
    t.integer  "page_position"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "navigations", ["page_id"], name: "index_navigations_on_page_id"
  add_index "navigations", ["web_id", "page_id"], name: "index_navigations_on_web_id_and_page_id", unique: true
  add_index "navigations", ["web_id"], name: "index_navigations_on_web_id"

  create_table "pages", force: true do |t|
    t.integer  "web_id"
    t.string   "name"
    t.text     "content"
    t.string   "title"
    t.string   "meta_keywords"
    t.string   "meta_description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "url_name"
  end

  add_index "pages", ["name"], name: "index_pages_on_name"
  add_index "pages", ["url_name"], name: "index_pages_on_url_name"
  add_index "pages", ["web_id", "name"], name: "index_pages_on_web_id_and_name", unique: true
  add_index "pages", ["web_id"], name: "index_pages_on_web_id"

  create_table "themes", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "themes", ["name"], name: "index_themes_on_name"

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "password_digest"
    t.string   "remember_token"
    t.boolean  "admin",                  default: false
    t.integer  "state",                  default: 0
    t.string   "verification_token"
    t.string   "password_reset_token"
    t.datetime "password_reset_sent_at"
  end

  add_index "users", ["remember_token"], name: "index_users_on_remember_token"
  add_index "users", ["verification_token"], name: "index_users_on_verification_token"

  create_table "webs", force: true do |t|
    t.string   "name"
    t.integer  "user_id"
    t.string   "header_content"
    t.string   "footer_content"
    t.boolean  "published",      default: false
    t.datetime "published_at",   default: Time.now
    t.string   "favicon"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "subdomain",      default: ""
    t.integer  "theme_id"
    t.string   "bg_color"
  end

  add_index "webs", ["subdomain"], name: "index_webs_on_subdomain"
  add_index "webs", ["theme_id"], name: "index_webs_on_theme_id"
  add_index "webs", ["user_id"], name: "index_webs_on_user_id"

end
