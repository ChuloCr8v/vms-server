import { hashData } from './hash';

export class OTPService {
  static generateOTP() {
    const otp = Math.floor(Math.random() * 10000).toString();
    const hashedOTP = hashData.hashString(otp);

    return { otp, hashedOTP };
  }
}
