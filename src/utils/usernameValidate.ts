export default function validateUsername(username: string) {
  const trimmedUsername = username.trim();
  const usernameRegex = /^[a-zA-Z0-9_ ]{3,20}$/;
  const isValid = usernameRegex.test(trimmedUsername);
  const hasConsecutiveSpaces = /\s{2,}/.test(trimmedUsername);

  return {
    isValid: isValid && !hasConsecutiveSpaces,
    error:
      isValid && !hasConsecutiveSpaces
        ? null
        : "Username must be 3-20 characters long and can contain letters, numbers, underscores, and single spaces (no consecutive spaces allowed).",
  };
}
