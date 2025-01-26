import * as bcrypt from "bcrypt";

export const hashData = async (data: string): Promise<string> => {
  return bcrypt.hash(data, 5);
}