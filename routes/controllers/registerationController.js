import { bcrypt } from "../../deps.js";
import * as userService from "../../services/userService.js";
import { validasaur } from "../../deps.js";
const validationRules = {
  email: [validasaur.required, validasaur.isEmail],
  password: [validasaur.required, validasaur.minLength(4)],
};
const getData = async (request) => {
  const data = {
    email: "",
    password: "",
    validationErrors: {},
  };

  if (request) {
    const body = request.body({ type: "form" });
    const params = await body.value;
    data.password = params.get("password");
    data.email = params.get("email");
  }

  return data;
};

const registerUser = async ({ request, response, render }) => {
  //get user input
  const data = await getData(request);
  //validate
  const [passes, errors] = await validasaur.validate(data, validationRules);
  const user = await userService.findUserByEmail(data.email);
  //checks if there is a user with same email already
  if (user.length != 0) {
    data.validationErrors = {
      email: { used: "Email already in use" },
    };
    render("register.eta", { validationErrors: data.validationErrors });
  } else if (!passes) {
    data.validationErrors = errors;
    render("register.eta", data);
  } else {
    await userService.addUser(
      data.email,
      await bcrypt.hash(data.password),
    );

    response.redirect("/auth/login");
  }
};

const showRegistrationForm = ({ render }) => {
  render("register.eta");
};

export { registerUser, showRegistrationForm };
