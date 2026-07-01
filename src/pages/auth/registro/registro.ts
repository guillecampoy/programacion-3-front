import "../../../main";
import "../../../style.css";

import { registerUser, redirectByRole } from "../../../utils/auth";
import { getUser } from "../../../utils/localStorage";
import { navigate, ROUTES } from "../../../utils/navigate";
import { validateRegistration } from "../../../utils/validation";

const form = document.querySelector<HTMLFormElement>("#form");
const inputName = document.querySelector<HTMLInputElement>("#name");
const inputEmail = document.querySelector<HTMLInputElement>("#email");
const inputPassword = document.querySelector<HTMLInputElement>("#password");
const passwordToggle = document.querySelector<HTMLButtonElement>("#passwordToggle");
const message = document.querySelector<HTMLParagraphElement>("#message");

if (!form || !inputName || !inputEmail || !inputPassword || !passwordToggle || !message) {
  throw new Error("No se encontraron los elementos necesarios del registro");
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

  const name = inputName.value.trim();
  const email = inputEmail.value.trim();
  const password = inputPassword.value;

  message.className = "form-message";

  const validationError = validateRegistration(name, email, password);

  if (validationError) {
    message.className = "form-message form-message-error";
    message.textContent = validationError;
    return;
  }

  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Creando tu cuenta…";
  }

  try {
    const error = await registerUser(name, email, password);

    if (error) {
      message.className = "form-message form-message-error";
      message.textContent = error;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Registrarse";
      }
      return;
    }

    message.textContent = "Tu cuenta fue creada correctamente.";
    navigate(ROUTES.storeHome);
  } catch {
    message.className = "form-message form-message-error";
    message.textContent = "No pudimos conectarnos al servidor para registrarte. Verificá tu conexión y volvé a intentar.";
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Registrarse";
    }
  }
});
