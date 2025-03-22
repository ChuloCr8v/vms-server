export class verificationLink {
  static link(token: string, email: string) {
    return `${process.env.BASE_URL}/verify?token=${token}&email=${encodeURIComponent(email)}`;
  }
}
