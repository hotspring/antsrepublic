FactoryGirl.define do
  factory :user do
    email "MyString"
    name "MyString"
    cell "MyString"
    password "MyString"
    password_confirmation "MyString"
    company "foobar"
    avatar File.open(File.join(Rails.root, 'spec/fixtures/rails.png'))
  end
end
