// src/auth.ts
import { Lucia } from "lucia";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { Collection, MongoClient } from "mongodb";

const client = new MongoClient(import.meta.env.MONGODB_CONNECTION);
await client.connect();

const db = client.db("portfoliodb");
const User = db.collection("User") as Collection<UserDoc>;
const Session = db.collection("Sessions") as Collection<SessionDoc>;

const adapter = new MongodbAdapter(Session, User);

interface UserDoc {
  _id: string;
  username: string;
  password_hash: string;
  fname: string;
  lname: string;
  email: string;
}

interface SessionDoc {
  _id: string;
  expires_at: Date;
  user_id: string;
}

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      username: attributes.username,
      authLevel: attributes.auth_level,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  username: string;
  password_hash: string;
  fname: string;
  lname: string;
  email: string;
  auth_level: string;
}
