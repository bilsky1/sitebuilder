class User < ActiveRecord::Base
  before_save{ self.email = email.downcase }
  before_save :create_remember_token, :create_verification_token

  #validations
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i
  validates :name, presence: true, length: { maximum: 50 }
  validates :email, presence: true,
            format: { with: VALID_EMAIL_REGEX },
            uniqueness: { case_sensitive: false }

  #password confirmation
  has_secure_password
  validates :password_confirmation, presence:true
  validates :password, length: { minimum: 6 }  #presence is automatically validate in has_secure_password

  def verify
    self.state = 1
    self.save(:validate=>false)
  end

  def User.new_remember_token
    SecureRandom.urlsafe_base64
  end

  def User.new_verification_token
    SecureRandom.base64(15).tr('+/=', '0aZ').strip.delete("\n")
  end

  def User.encrypt(token)
    Digest::SHA1.hexdigest(token.to_s)
  end

  private

    def create_remember_token
      self.remember_token = User.encrypt(User.new_remember_token)
    end

    def create_verification_token
      self.verification_token = User.encrypt(User.new_verification_token)
    end

end
