import * as userService from "../../services/userService.js";
import { bcrypt } from "../../deps.js";

const processLogin = async ({ request, response, state, render }) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  const userFromDatabase = await userService.findUserByEmail(
    params.get("email"),
  );
  if (userFromDatabase.length != 1) {
    const errors = {
      email: { used: "Email or password incorrect" },
    };
    render("login.eta", { validationErrors: errors });
    return;
  }

  const user = userFromDatabase[0];
  const passwordMatches = await bcrypt.compare(
    params.get("password"),
    user.password,
  );

  if (!passwordMatches) {
    const errors = {
      email: { used: "Email or password incorrect" },
    };
    render("login.eta", { validationErrors: errors });
    return;
  }

  await state.session.set("user", user);
  response.redirect("/questions");
};

const showLoginForm = ({ render }) => {
  render("login.eta");
};

export { processLogin, showLoginForm };
