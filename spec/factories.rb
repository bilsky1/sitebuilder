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
    sequence(:name) { |n| "Testing web #{n}"}
    user
  end

end