import "../../../main";
import "../../../style.css";

import { getUser } from "../../../utils/localStorage";
import { loginUser, redirectByRole } from "../../../utils/auth";
import { validateCredentials } from "../../../utils/validation";

const form = document.querySelector<HTMLFormElement>("#form");
const inputEmail = document.querySelector<HTMLInputElement>("#email");
const inputPassword = document.querySelector<HTMLInputElement>("#password");
const passwordToggle = document.querySelector<HTMLButtonElement>("#passwordToggle");
const message = document.querySelector<HTMLParagraphElement>("#message");

if (!form || !inputEmail || !inputPassword || !passwordToggle || !message) {
  throw new Error("No se encontraron los elementos necesarios del login");
}

passwordToggle.addEventListener("click", () => {
  const isPassword = inputPassword.type === "password";
  inputPassword.type = isPassword ? "text" : "password";
  passwordToggle.textContent = isPassword ? "Ocultar" : "Mostrar";
  passwordToggle.setAttribute("aria-pressed", String(isPassword));
  passwordToggle.setAttribute("aria-label", isPassword ? "Ocultar contraseña" : "Mostrar contraseña");
});

const currentUser = getUser();

if (currentUser) {
  redirectByRole(currentUser);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = inputEmail.value.trim();
  const password = inputPassword.value;

  const validationError = validateCredentials(email, password);

  if (validationError) {
    message.className = "form-message form-message-error";
    message.textContent = validationError;
    return;
  }

  message.className = "form-message";
  message.textContent = "";

  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Iniciando sesión…";
  }

  try {
    const user = await loginUser(email, password);

    if (!user) {
      message.className = "form-message form-message-error";
      message.textContent = "El email o la contraseña no son correctos. Verificá los datos e intentá de nuevo.";
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Iniciar sesión";
      }
      return;
    }

    redirectByRole(user);
  } catch {
    message.className = "form-message form-message-error";
    message.textContent = "No pudimos conectarnos al servidor. Verificá tu conexión a internet y volvé a intentar.";
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Iniciar sesión";
    }
  }
});
