import "../../../main";
import "../../../style.css";

import logoImage from "../../../assets/food-store/logo_bodegon.png";
import { logout } from "../../../utils/auth";
import { getUser } from "../../../utils/localStorage";

const buttonLogout = document.querySelector<HTMLButtonElement>("#logoutButton");
const loggedUserName = document.querySelector<HTMLSpanElement>("#loggedUserName");
const logo = document.querySelector<HTMLImageElement>("#storeLogo");

if (!buttonLogout || !loggedUserName || !logo) {
  throw new Error("No se encontraron los elementos necesarios de pedidos");
}

buttonLogout.addEventListener("click", () => {
  logout();
});

logo.src = logoImage;
loggedUserName.textContent = getUser()?.name ?? getUser()?.email ?? "";
