import "../../../main";
import "../../../style.css";

import { registerUser } from "../../../utils/auth";
import { navigate, ROUTES } from "../../../utils/navigate";
import { validateRegistration } from "../../../utils/validation";

const form = document.querySelector<HTMLFormElement>("#form");
const inputName = document.querySelector<HTMLInputElement>("#name");
const inputEmail = document.querySelector<HTMLInputElement>("#email");
const inputPassword = document.querySelector<HTMLInputElement>("#password");
const message = document.querySelector<HTMLParagraphElement>("#message");

if (!form || !inputName || !inputEmail || !inputPassword || !message) {
  throw new Error("No se encontraron los elementos necesarios del registro");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = inputName.value.trim();
  const email = inputEmail.value.trim();
  const password = inputPassword.value;

  const validationError = validateRegistration(name, email, password);

  if (validationError) {
    message.textContent = validationError;
    return;
  }

  const error = await registerUser(name, email, password);

  if (error) {
    message.textContent = error;
    return;
  }

  message.textContent = "Usuario registrado correctamente.";
  navigate(ROUTES.storeHome);
});
