import { DefaultSession, DefaultUser } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: Role;
      bio?: string | null;
      discord?: string | null;
      whatsapp?: string | null;
      telegram?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    username: string;
    role: Role;
    bio?: string | null;
    discord?: string | null;
    whatsapp?: string | null;
    telegram?: string | null;
  }
}
