import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const accessToken = "fake-jwt-token"; // Dummy token

const fakeBackend = () => {
  const mock = new MockAdapter(axios, { onNoMatch: "passthrough" });

  // Hardcoded users
  const users = [
    {
      uid: 1,
      username: "admin",
      role: "admin",
      password: "admin",
      email: "admin@shekhai.com",
    },
  ];

  // -----------------------------
  // LOGIN
  // -----------------------------
  mock.onPost("/post-fake-login").reply((config) => {
    const { email, password } = JSON.parse(config.data);
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      return [200, { ...user, accessToken }];
    } else {
      return [401, { message: "Username and password are invalid. Please try again." }];
    }
  });

  // -----------------------------
  // REGISTER (won't persist on production)
  // -----------------------------
  mock.onPost("/post-fake-register").reply((config) => {
    const user = JSON.parse(config.data);
    users.push(user); // Works in memory only
    return [200, user];
  });

  // -----------------------------
  // PROFILE UPDATE
  // -----------------------------
  mock.onPost("/post-fake-profile").reply((config) => {
    const { uid, username } = JSON.parse(config.data);
    const userIndex = users.findIndex((u) => u.uid === uid);
    if (userIndex === -1) return [400, { message: "User not found" }];

    users[userIndex].username = username;
    localStorage.setItem("authUser", JSON.stringify(users[userIndex]));
    return [200, { message: "Profile Updated Successfully" }];
  });

  // -----------------------------
  // FORGOT PASSWORD
  // -----------------------------
  mock.onPost("/fake-forget-pwd").reply(() => {
    return [200, { message: "Check your mail and reset your password." }];
  });
};

export default fakeBackend;
