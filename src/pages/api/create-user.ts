// pages/api/signup.ts
import { lucia } from "../../../auth";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";

import type { APIContext } from "astro";
import { MongoClient } from "mongodb";
import { isValidEmail } from "../../utilities/emailchecker";

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const username = formData.get("username");
  const fname = formData.get("fname");
  const lname = formData.get("lname");
  const authlevel = formData.get("authlevel");

  // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
  // keep in mind some database (e.g. mysql) are case insensitive
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return new Response("Invalid username", {
      status: 400,
    });
  }

  const email = formData.get("email");
  if (!isValidEmail(String(email))) {
    return new Response("Invalid email format", {
      status: 400,
    });
  }

  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return new Response("Invalid password", {
      status: 400,
    });
  }

  const userId = generateIdFromEntropySize(10); // 16 characters long
  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const client = new MongoClient(import.meta.env.MONGODB_CONNECTION);
  const db = client.db("portfoliodb");
  const users = db.collection("User");

  // TODO: check if username is already used

  const existingUserData = users.find({ username: username });
  console.log("Sign up - Existing User Data: ", existingUserData);

  await users.insertOne({
    _id: userId,
    username: username,
    password_hash: passwordHash,
    fname: fname,
    lname: lname,
    email: email,
    auth_level: authlevel,
  });

  await client.close();

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return context.redirect("/admin");
}
