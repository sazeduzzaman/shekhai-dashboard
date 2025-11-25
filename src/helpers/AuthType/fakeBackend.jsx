import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import accessToken from "../jwt-token-access/accessToken";

let users = [
  {
    uid: 1,
    username: "admin",
    role: "admin",
    password: "admin",
    email: "admin@shekhai.com",
  },
];

const fakeBackend = () => {
  // Run only in development
  if (process.env.NODE_ENV !== "development") return;

  const mock = new MockAdapter(axios, { onNoMatch: "passthrough" });

  // REGISTER
  mock.onPost("/post-fake-register").reply((config) => {
    const user = JSON.parse(config.data);
    users.push(user);
    return [200, user];
  });

  // LOGIN
  mock.onPost("/post-fake-login").reply((config) => {
    const { email, password } = JSON.parse(config.data);
    const validUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (validUser) {
      return [200, { ...validUser, accessToken }];
    } else {
      return [
        400,
        {
          message:
            "Username and password are invalid. Please enter correct username and password",
        },
      ];
    }
  });

  // PROFILE UPDATE
  mock.onPost("/post-fake-profile").reply((config) => {
    const { uid, username } = JSON.parse(config.data);
    const userIndex = users.findIndex((u) => u.uid === uid);

    if (userIndex === -1) return [400, { message: "User not found" }];

    users[userIndex].username = username;
    localStorage.setItem("authUser", JSON.stringify(users[userIndex]));
    return [200, { message: "Profile Updated Successfully" }];
  });

  // FORGET PASSWORD
  mock.onPost("/fake-forget-pwd").reply(() => {
    return [200, { message: "Check your mail and reset your password." }];
  });
};

export default fakeBackend;
