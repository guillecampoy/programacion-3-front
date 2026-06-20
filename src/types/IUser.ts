import type { Rol } from "./Rol";

export interface IUser {
  id: string;
  email: string;
  role: Rol;
}
