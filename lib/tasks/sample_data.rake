namespace :db do
  desc "Fill database with sample data"
  task populate: :environment do
    make_users
    make_webs
    make_pages
  end
end

def make_users
  admin = User.create!(name:     "Branislav Bilsky",
                       email:    "branislav.bilsky@gmail.com",
                       password: "foobar",
                       password_confirmation: "foobar",
                       admin: true,
                       state: 1)
  99.times do |n|
    name  = Faker::Name.name
    email = "example-#{n+1}@railstutorial.org"
    password  = "password"
    User.create!(name:     name,
                 email:    email,
                 password: password,
                 password_confirmation: password,
                 state: 1)
  end

  def make_webs
    users = User.all(limit: 6)
    35.times do |n|
      name = Faker::Lorem.words(3).join(' ')
      subdomain = Faker::Internet.domain_word + n.to_s
      users.each { |user| user.webs.create!(name: name, header_content: "This is repeatitive header", footer_content: "This is repetitive footer", subdomain: subdomain + user.id.to_s) }
    end
  end

  def make_pages
    webs = Web.all(limit: 150)
    3.times do |n|
      name = "Page-#{n+1}"
      webs.each { |web| web.pages.create!(name:name, content:"", title:name, meta_keywords:"test, keywords", meta_description:"test metadescription") }
    end
  end
end