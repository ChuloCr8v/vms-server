import * as bcrypt from 'bcryptjs';

export class BcryptCompare {
  static async compare(data: string, hash: string) {
    return await bcrypt.compare(data, hash);
  }
}
