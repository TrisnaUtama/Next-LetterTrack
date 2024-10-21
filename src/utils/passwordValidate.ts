export default function validatePassword(password: string) {
  const isValid = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  return {
    isValid: isValid && hasNumber && hasSpecialChar,
    error:
      isValid && hasNumber && hasSpecialChar
        ? null
        : "Password must be at least 8 characters long and contain at least one number and one special character.",
  };
}
