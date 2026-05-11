export const Rol = {
  Client: "client",
  Admin: "admin",
} as const;

export type Rol = (typeof Rol)[keyof typeof Rol];
