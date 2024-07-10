import type { APIContext } from "astro";
import { isValidEmail } from "../../utilities/emailchecker";
import { hash } from "@node-rs/argon2";

import { MongoClient, ObjectId } from "mongodb";

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const userId: FormDataEntryValue = formData.get("userid");
  const newEmail: FormDataEntryValue = formData.get("email");
  const newUsername: FormDataEntryValue = formData.get("username");
  const newFname: FormDataEntryValue = formData.get("fname");
  const newLname: FormDataEntryValue = formData.get("lname");
  const newPassword: FormDataEntryValue = formData.get("newpassword");

  if (
    typeof newUsername !== "string" ||
    newUsername.length < 3 ||
    newUsername.length > 31 ||
    !/^[a-z0-9_-]+$/.test(newUsername)
  ) {
    return new Response("Invalid username", {
      status: 400,
    });
  }

  if (String(newFname).length < 1) {
    return new Response("First name must have 1 or more characters!", {
      status: 400,
    });
  }

  if (String(newLname).length < 1) {
    return new Response("Last name must have 1 or more characters!", {
      status: 400,
    });
  }

  if (!isValidEmail(String(newEmail))) {
    return new Response("Invalid email format", {
      status: 400,
    });
  }

  let newPasswordHash: string;

  if (newPassword) {
    if (
      typeof newPassword !== "string" ||
      newPassword.length < 6 ||
      newPassword.length > 255
    ) {
      return new Response("Invalid password", {
        status: 400,
      });
    }

    newPasswordHash = await hash(String(newPassword), {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
  }

  let updateData: Object = {
    email: newEmail,
    username: newUsername,
    fname: newFname,
    lname: newLname,
  };

  if (newPasswordHash) {
    console.log("New Password_Hash Detected!");
    updateData = {
      ...updateData,
      password_hash: newPasswordHash,
    };
  }

  const client = new MongoClient(import.meta.env.MONGODB_CONNECTION);

  try {
    const db = client.db("portfoliodb");
    const users = db.collection("User");
    await users.updateOne(
      { _id: String(userId) },
      {
        $set: updateData,
      }
    );
  } finally {
    await client.close();
  }

  return context.redirect("/admin/manage-users");
}
