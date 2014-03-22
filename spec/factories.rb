FactoryGirl.define do
  factory :user do
    sequence(:name)  { |n| "Person #{n}" }
    sequence(:email) { |n| "person_#{n}@example.com"}
    password "foobar"
    password_confirmation "foobar"

    factory :admin do
      admin true
    end

    state 1

    #for user mailer
    password_reset_token "aaaaaaaaaaaaaaa"

  end

  factory :web do
    sequence(:name) { |n| "TestWeb#{n}"}
    sequence(:subdomain) {|n| "example#{n}"}
    user
  end

  factory :image do
    sequence(:name) { |n| "TestImage#{n}"}
    user
    web
  end

  factory :page do
    sequence(:name) { |n| "ExampleName#{n}"}
    sequence(:content) { |n| "HtmlContent#{n}"}
    sequence(:title) { |n| "Title #{n}"}
    sequence(:meta_keywords) { |n| "Meta keywords #{n}"}
    sequence(:meta_description) { |n| "Meta description#{n}"}
    user
    web
  end
end