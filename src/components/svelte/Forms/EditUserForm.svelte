<script>
  import { isValidEmail } from "../../../utilities/emailchecker";

  export let data;
  const { id, email, username, fname, lname } = data;

  let firstName = fname;
  let editFirstName = false;
  let firstNameError = "";

  let lastName = lname;
  let editLastName = false;
  let lastNameError = "";

  let userName = username;
  let editUsername = false;
  let usernameError = "";

  let userEmail = email;
  let editEmail = false;
  let emailError = "";

  let changePassword = false;
  let password = "";
  let confirmPassword = "";
  let passworderror = "";

  const checkUsername = () => {
    if (
      userName.length < 3 ||
      userName.length > 31 ||
      !/^[a-z0-9_-]+$/.test(userName)
    ) {
      usernameError =
        "Username must be between 3 and 31 characters long, and not contain special characters other than underscores and hyphens!";
    } else {
      editUsername = false;
      usernameError = "";
    }
  };

  const checkNewPassword = () => {
    if (password.length < 6 || password.length > 255) {
      passworderror = "Password must be between 6 and 255 characters long!";
    } else {
      if (!(password === confirmPassword)) {
        passworderror = "Password and confirmation password don't match!";
      } else {
        passworderror = "";
        changePassword = false;
      }
    }
  };

  async function handleSubmit(event) {
    const formData = new FormData(event.target);

    const userId = formData.get("userid");
    const newEmail = formData.get("email");
    const newUsername = formData.get("username");
    const newFname = formData.get("fname");
    const newLname = formData.get("lname");

    console.log(
      `========\n\nUsername: ${newUsername}\nUser ID: ${userId}\nEmail: ${newEmail}\nFirst Name: ${newFname}\nLast Name: ${newLname}\n\n========`
    );

    let updateData = {
      email: newEmail,
      username: newUsername,
      fname: newFname,
      lname: newLname,
    };
  }
</script>

<div class="edit-user">
  <div class="edit-user-field email">
    <div class="fieldName">Email</div>
    {#if !editEmail}
      <div class="read-only">
        {userEmail}
      </div>
      <button on:click={() => (editEmail = true)}>Edit</button>
    {:else}
      <div class="edit-field">
        <input type="text" bind:value={userEmail} />
      </div>
      <button
        on:click={() =>
          isValidEmail(userEmail)
            ? (editEmail = false)((emailError = ""))
            : (emailError = "Incorrect email format!")}>Done</button
      >
    {/if}
    {#if emailError}
      <div class="error">{emailError}</div>
    {/if}
  </div>
  <div class="edit-user-field username">
    <div class="fieldName">Username</div>
    {#if !editUsername}
      <div class="read-only">
        {userName}
      </div>

      <button on:click={() => (editUsername = true)}>Edit</button>
    {:else}
      <div class="edit-field">
        <input type="text" bind:value={userName} />
      </div>
      <button on:click={checkUsername}>Done</button>
    {/if}
    {#if usernameError}
      <div class="error">{usernameError}</div>
    {/if}
  </div>
  <div class="edit-user-field firstName">
    <div class="fieldName">First Name</div>
    {#if !editFirstName}
      <div class="read-only">
        {firstName}
      </div>

      <button on:click={() => (editFirstName = true)}>Edit</button>
    {:else}
      <div class="edit-field">
        <input type="text" bind:value={firstName} />
      </div>
      <button
        on:click={() =>
          firstName.length > 0
            ? (editFirstName = false)((firstNameError = ""))
            : (firstNameError =
                "First name must be at least one character long!")}>Done</button
      >
    {/if}
    {#if firstNameError}
      <div class="error">{firstNameError}</div>
    {/if}
  </div>
  <div class="edit-user-field lastName">
    <div class="fieldName">Last Name</div>
    {#if !editLastName}
      <div class="read-only">
        {lastName}
      </div>

      <button on:click={() => (editLastName = true)}>Edit</button>
    {:else}
      <div class="edit-field">
        <input type="text" bind:value={lastName} />
      </div>
      <button
        on:click={() =>
          lastName.length > 0
            ? (lastNameError = "")((editLastName = false))
            : (lastNameError =
                "Last name must be at least one character long!")}>Done</button
      >
    {/if}
    {#if lastNameError}
      <div class="error">{lastNameError}</div>
    {/if}
  </div>
  <div class="edit-password">
    <div class="fieldName">Password</div>
    {#if !changePassword}
      <button class="change-password" on:click={() => (changePassword = true)}
        >Change</button
      >
    {:else}
      <div class="edit-field">
        <input type="password" placeholder="Password" bind:value={password} />
        <input
          type="password"
          placeholder="Confirm Password"
          bind:value={confirmPassword}
        />
      </div>
      <button on:click={checkNewPassword}>Done</button>
      <button
        on:click={() => {
          password = "";
          confirmPassword = "";
          changePassword = false;
          passworderror = "";
        }}>Cancel</button
      >
    {/if}
    {#if passworderror}
      <div class="error">{passworderror}</div>
    {/if}
  </div>
</div>

{#if !(editEmail || editFirstName || editLastName || editUsername || changePassword)}
  <form method="POST" action="/api/update-user">
    <input type="hidden" name="userid" value={id} />
    <input type="hidden" name="email" id="email" bind:value={userEmail} />
    <input type="hidden" name="username" id="username" bind:value={userName} />
    <input type="hidden" name="fname" id="fname" bind:value={firstName} />
    <input type="hidden" name="lname" id="lname" bind:value={lastName} />
    <input type="hidden" name="newpassword" bind:value={password} />

    <button type="submit">Save Updates</button>
  </form>
{/if}

<style lang="scss">
  .edit-user-field.firstName {
    grid-area: firstname;
  }

  .edit-user-field.lastName {
    grid-area: lastname;
  }

  .edit-user-field.username {
    grid-area: username;
  }

  .edit-user-field.email {
    grid-area: email;
  }

  .fieldName {
    font-weight: bold;
    &::after {
      content: ":";
    }
  }

  .edit-password {
    grid-area: password;
    display: flex;
    align-items: center;
    gap: 10px;

    input {
      font-size: 18px;
    }

    button.change-password {
      background-color: var(--secondary-color);
      color: #ffff;
      border: none;
    }
  }

  .edit-user {
    display: grid;
    max-width: 100%;
    gap: 20px;
    grid-template-columns: auto auto;
    grid-template-areas:
      "username email"
      "firstname lastname"
      "password password";
  }

  .edit-user-field {
    display: grid;
    grid-template-columns: auto auto 100px;
    border-bottom: 1px solid #ffff;
  }

  form {
    width: 100%;
  }

  form button[type="submit"] {
    background-color: #63be63;
    border: 2px solid transparent;
    color: #ffff;
    cursor: pointer;
    font-size: 1.75rem;
    margin-top: 20px;
    padding: 10px 0;
    width: 100%;
    transition: all 0.1s ease-in;

    &:hover {
      background-color: var(--primary-background);
      border-color: #63be63;
    }
  }

  .error {
    color: var(--secondary-color);

    &::before {
      content: "ERROR: ";
    }
  }
</style>
