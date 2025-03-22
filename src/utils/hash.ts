import * as bcrypt from 'bcryptjs';

export class hashData {
  static async hashString(data: string): Promise<string> {
    return await bcrypt.hash(data, 10);
  }
}
