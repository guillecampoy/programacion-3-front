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
    submitBtn.textContent = "Ingresando…";
  }

  try {
    const user = await loginUser(email, password);

    if (!user) {
      message.className = "form-message form-message-error";
      message.textContent = "Credenciales inválidas.";
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Ingresar";
      }
      return;
    }

    redirectByRole(user);
  } catch {
    message.className = "form-message form-message-error";
    message.textContent = "Error de conexión. Intentá de nuevo.";
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Ingresar";
    }
  }
});
