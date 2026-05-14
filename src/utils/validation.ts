const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&._-]+$/;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 20;

export const validateEmail = (email: string): string | null => {
  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    return "Email y contraseña son requeridos.";
  }

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return "Ingresá un email válido.";
  }

  if (normalizedEmail.length > 254) {
    return "El email es demasiado largo.";
  }

  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Email y contraseña son requeridos.";
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return `La contraseña debe tener entre ${PASSWORD_MIN_LENGTH} y ${PASSWORD_MAX_LENGTH} caracteres.`;
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return `La contraseña debe tener entre ${PASSWORD_MIN_LENGTH} y ${PASSWORD_MAX_LENGTH} caracteres.`;
  }

  if (!PASSWORD_REGEX.test(password)) {
    return "La contraseña debe incluir letras y números, sin espacios.";
  }

  return null;
};

export const validateCredentials = (
  email: string,
  password: string
): string | null => validateEmail(email) ?? validatePassword(password);
