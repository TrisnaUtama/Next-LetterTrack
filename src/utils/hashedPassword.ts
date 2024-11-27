import bcrypt from "bcryptjs";

export default async function hashPassword(
  plainPassword: string
): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt); 
  return hashedPassword;
}
