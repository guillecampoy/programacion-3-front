import type { Rol } from "./Rol";

export interface IUser {
  id: string;
  name?: string;
  email: string;
  role: Rol;
}
