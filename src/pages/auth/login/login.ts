import "../../../main";
import { loginUser, redirectByRole } from "../../../utils/auth";
import { validateCredentials } from "../../../utils/validation";

const form = document.querySelector<HTMLFormElement>("#form");
const inputEmail = document.querySelector<HTMLInputElement>("#email");
const inputPassword = document.querySelector<HTMLInputElement>("#password");
const message = document.querySelector<HTMLParagraphElement>("#message");

if (!form || !inputEmail || !inputPassword || !message) {
  throw new Error("No se encontraron los elementos necesarios del login");
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

  const user = await loginUser(email, password);

  if (!user) {
    message.textContent = "Credenciales inválidas.";
    return;
  }

  message.textContent = "";
  redirectByRole(user);
});
