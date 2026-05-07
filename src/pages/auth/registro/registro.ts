import "../../../main";
import { registerUser } from "../../../utils/auth";
import { navigate, ROUTES } from "../../../utils/navigate";
import { validateCredentials } from "../../../utils/validation";

const form = document.querySelector<HTMLFormElement>("#form");
const inputEmail = document.querySelector<HTMLInputElement>("#email");
const inputPassword = document.querySelector<HTMLInputElement>("#password");
const message = document.querySelector<HTMLParagraphElement>("#message");

if (!form || !inputEmail || !inputPassword || !message) {
  throw new Error("No se encontraron los elementos necesarios del registro");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = inputEmail.value.trim();
  const password = inputPassword.value;

  const validationError = validateCredentials(email, password);

  if (validationError) {
    message.textContent = validationError;
    return;
  }

  const error = await registerUser(email, password);

  if (error) {
    message.textContent = error;
    return;
  }

  message.textContent = "Usuario registrado correctamente.";
  navigate(ROUTES.login);
});
