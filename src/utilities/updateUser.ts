import { MongoClient } from "mongodb";
import { isValidEmail } from "./emailchecker";
import { hash } from "@node-rs/argon2";

export default async function updateDBUser(data) {
  const formData = data;
  const userId: FormDataEntryValue = formData.get("userid");
  const newEmail: FormDataEntryValue = formData.get("email");
  const newUsername: FormDataEntryValue = formData.get("username");
  const newFname: FormDataEntryValue = formData.get("fname");
  const newLname: FormDataEntryValue = formData.get("lname");
  const newPassword: FormDataEntryValue = formData.get("newpassword");

  console.log(
    `========\n\nUsername: ${newUsername}\nPassword: ${newPassword}\nUser ID: ${userId}\nEmail: ${newEmail}\nFirst Name: ${newFname}\nLast Name: ${newLname}\n\n========`
  );

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
    updateData = {
      ...updateData,
      password_hash: newPasswordHash,
    };
  }

  const client = new MongoClient(import.meta.env.MONGODB_CONNECTION);

  let moduleResponse: Object = {
    isSuccessful: true,
    message: "DB Updatd!",
  };

  try {
    const db = client.db("portfoliodb");
    const users = db.collection("User");
    await users.updateOne({ _id: String(userId) }, updateData);
  } catch (e) {
    moduleResponse = {
      isSuccessful: false,
      message: "DB Update Issue.  View console for more info",
    };

    console.error("[DB Update Issue]: ", e);
  } finally {
    await client.close();
  }

  return moduleResponse;
}
