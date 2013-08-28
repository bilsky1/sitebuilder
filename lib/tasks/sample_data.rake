namespace :db do
  desc "Fill database with sample data"
  task populate: :environment do
    make_users
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
end