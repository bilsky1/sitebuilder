class User < ActiveRecord::Base
  before_save do
    self.email = email.downcase
    generate_token(:remember_token)
    generate_token(:verification_token)
  end

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

  def send_password_reset
    generate_token(:password_reset_token)
    self.password_reset_sent_at = Time.zone.now
    self.save(:validate=>false)
    UserMailer.password_reset(self).deliver
  end

  def send_registration_confirmation
    UserMailer.registration_confirmation(self).deliver
  end

  def User.encrypt(token)
    Digest::SHA1.hexdigest(token.to_s)
  end

  private
    def generate_token(column)
      begin
        self[column] = User.encrypt(SecureRandom.base64(15).tr('+/=', '0aZ').strip.delete("\n"))
      end while User.exists?(column => self[column])
    end

end
