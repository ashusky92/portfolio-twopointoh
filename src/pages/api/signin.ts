import { lucia } from "../../../auth";
import { verify } from "@node-rs/argon2";
import type { APIContext } from "astro";
import { MongoClient } from "mongodb";

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const username = formData.get("username");
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

  const client = new MongoClient(import.meta.env.MONGODB_CONNECTION);

  const db = client.db("portfoliodb");
  const projects = db.collection("User");

  const existingUser = await projects.findOne({ username: username });
  console.log("Existing User Data: ", existingUser);
  await client.close();

  if (!existingUser) {
    return new Response("Incorrect username or password", {
      status: 400,
    });
  }

  const validPassword = await verify(existingUser.password_hash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  if (!validPassword) {
    return new Response("Incorrect username or password", {
      status: 400,
    });
  }

  const session = await lucia.createSession(String(existingUser._id), {});
  console.log("Created Session: ", session);
  const sessionCookie = lucia.createSessionCookie(session.id);
  console.log("Session Cookie: ", sessionCookie);

  const cookieOptions = {
    ...sessionCookie.attributes,
    path: "/",
    secure: false, // Set to true if your site is served over HTTPS
    httpOnly: true,
    sameSite: "Lax",
  };

  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  console.log("Cookie Set: ", context.cookies.get(sessionCookie.name));
  console.log("All Cookies: ", context.cookies);

  return context.redirect("/admin");
}
