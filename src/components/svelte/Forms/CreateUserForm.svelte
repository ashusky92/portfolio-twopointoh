<script>
  import { isValidEmail } from "../../../utilities/emailchecker";

  let firstName;
  let firstNameValid = false;

  let lastName;
  let lastNameValid = false;

  let email;
  let emailValid = false;

  let username;
  let usernameValid = false;

  let password;
  let passwordValid;
  let confirmpassword;
  let passwordsMatch;

  let authlevel = "user";
  let authlevelValid = false;

  const checkFirstName = () => {
    firstNameValid = firstName.length > 0;
    console.log("first name valid - ", firstNameValid);
  };

  const checkLastName = () => {
    lastNameValid = lastName.length > 0;
    console.log("last name valid - ", lastNameValid);
  };

  const checkEmail = () => {
    emailValid = isValidEmail(email);
    console.log("email valid - ", emailValid);
  };

  const checkUsername = () => {
    usernameValid =
      username.length >= 3 &&
      username.length <= 31 &&
      /^[a-z0-9_-]+$/.test(username);
    console.log("username valid - ", usernameValid);
  };

  const checkPassword = () => {
    passwordValid = password.length >= 6 && password.length <= 255;
    console.log("password valid - ", passwordValid);
  };

  const matchingPasswords = () => {
    passwordsMatch = password === confirmpassword;
    console.log("passwords match? ", passwordsMatch);
  };
</script>

<div class="create-user">
  <div>
    <div class="double-col">
      <div>
        <label for="fname">First Name </label>
        <input
          type="text"
          id="fname"
          name="fname"
          on:change={checkFirstName}
          bind:value={firstName}
        />
      </div>
      <div>
        <label for="lname">Last Name </label>
        <input
          type="text"
          id="lname"
          name="lname"
          on:change={checkLastName}
          bind:value={lastName}
        />
      </div>
    </div>
    <div>
      <label for="email">Email </label>
      <input
        type="email"
        id="email"
        name="email"
        on:change={checkEmail}
        bind:value={email}
      />
    </div>
    <div>
      <label for="username">Username</label>
      <input
        id="username"
        name="username"
        on:change={checkUsername}
        bind:value={username}
      />
    </div>
    <div>
      <label for="authlevel">Authorization Level</label>
      <select
        type="text"
        name=""
        id="authlevel"
        on:change={() => {
          authlevelValid = authlevel.length !== "";
          console.log("auth valid - ", authlevelValid);
        }}
        bind:value={authlevel}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    </div>
    <div class="double-col">
      <div>
        <label for="password">Password </label>
        <input
          id="password"
          type="password"
          name="password"
          on:change={checkPassword}
          bind:value={password}
        />
      </div>
      <div>
        <label for="confirm-password">Confirm Password </label>
        <input
          id="confirm-password"
          type="password"
          name="confirmpassword"
          on:keyup={matchingPasswords}
          bind:value={confirmpassword}
        />
      </div>
    </div>
  </div>
  <div class="checklist">
    <ul>
      <li class={firstNameValid ? "complete" : ""}>
        First name is filled out.
      </li>
      <li class={lastNameValid ? "complete" : ""}>Last name is filled out.</li>
      <li class={usernameValid ? "complete" : ""}>
        Username is between 3 and 31 characters long.
      </li>
      <li class={emailValid ? "complete" : ""}>
        Email is in a valid format (email@domain.com).
      </li>

      <li class={passwordValid ? "complete" : ""}>
        Password is between 6 and 255 characters long.
      </li>
      <li class={passwordsMatch ? "complete" : ""}>
        Password and confirmation password match.
      </li>
    </ul>
  </div>
</div>

{#if firstNameValid && lastNameValid && emailValid && passwordValid && passwordsMatch}
  <form method="post" action="/api/create-user">
    <input type="hidden" name="fname" bind:value={firstName} />
    <input type="hidden" name="lname" bind:value={lastName} />
    <input type="hidden" name="email" bind:value={email} />
    <input type="hidden" name="username" bind:value={username} />
    <input type="hidden" name="authlevel" bind:value={authlevel} />
    <input type="hidden" name="password" bind:value={password} />
    <button type="submit">Create User</button>
  </form>
{/if}

<style>
  li.complete {
    color: green;
  }
</style>
