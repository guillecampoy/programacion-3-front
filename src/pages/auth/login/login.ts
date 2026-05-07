import "../../../main";
import { loginUser, redirectByRole } from "../../../utils/auth";

const form = document.querySelector<HTMLFormElement>("#form");
const inputEmail = document.querySelector<HTMLInputElement>("#email");
const inputPassword = document.querySelector<HTMLInputElement>("#password");
const message = document.querySelector<HTMLParagraphElement>("#message");

if (!form || !inputEmail || !inputPassword || !message) {
  throw new Error("No se encontraron los elementos necesarios del login");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = inputEmail.value.trim();
  const password = inputPassword.value;

  if (!email || !password) {
    message.textContent = "Email y contraseña son requeridos.";
    return;
  }

  const user = loginUser(email, password);

  if (!user) {
    message.textContent = "Credenciales inválidas.";
    return;
  }

  message.textContent = "";
  redirectByRole(user);
});
