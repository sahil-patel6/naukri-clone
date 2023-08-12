export class API {
  static BASE_URL = "https:naukri.dev/api"
  // AUTH
  static CURRENT_USER_URL = `${this.BASE_URL}/users/currentuser`;
  static SIGNUP_URL = `${this.BASE_URL}/users/signup`;
  static SIGNIN_URL = `${this.BASE_URL}/users/signin`;
  static SIGNOUT_URL = `${this.BASE_URL}/users/signout`;
  static SEND_OTP_URL = `${this.BASE_URL}/users/send-otp`;
  static VERIFY_OTP_URL = `${this.BASE_URL}/users/verify-otp`;
}

