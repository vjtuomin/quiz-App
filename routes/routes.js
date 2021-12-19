import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as questionController from "./controllers/questionController.js";
import * as registerationController from "./controllers/registerationController.js";
import * as loginController from "./controllers/loginController.js";
import * as statisticsController from "./controllers/statisticsController.js";
import * as questionApi from "./apis/questionApi.js";

const router = new Router();

router.get("/", mainController.showMain);
router.get("/questions", questionController.showQuestions);
router.post("/questions", questionController.addQuestion);
router.get("/questions/:id", questionController.showQuestion);
router.post("/questions/:id/options", questionController.addOption);
router.post("/questions/:id/delete", questionController.deleteQuestion);
router.post(
  "/questions/:questionid/options/:optionId/delete",
  questionController.deleteOption,
);
router.get("/auth/register", registerationController.showRegistrationForm);
router.post("/auth/register", registerationController.registerUser);
router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.processLogin);
router.get("/quiz", questionController.randomQuestion);
router.get("/quiz/:id", questionController.getQuestion);
router.post(
  "/quiz/:questionid/options/:optionId",
  questionController.getAnswer,
);
router.get(
  "/quiz/:id/correct",
  questionController.showCorrect,
);
router.get(
  "/quiz/:id/incorrect",
  questionController.showIncorrect,
);
router.get("/statistics", statisticsController.showStatistics);
router.get("/api/questions/random", questionApi.randomQuestion);
router.post("/api/questions/answer", questionApi.getAnswer);

export { router };
