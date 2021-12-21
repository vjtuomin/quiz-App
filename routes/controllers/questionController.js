import * as questionService from "../../services/questionService.js";
import { validasaur } from "../../deps.js";
/**
 * validation rules for questions
 */
const qValidationRules = {
  title: [validasaur.required, validasaur.minLength(1)],
  question: [validasaur.required, validasaur.minLength(1)],
};
/**
 * validation rules for answer options
 */
const oValidationRules = {
  optionText: [validasaur.required, validasaur.minLength(1)],
};

const getQuestionData = async (request) => {
  const data = {
    title: "",
    question: "",
    validationErrors: [],
  };
  if (request) {
    const body = request.body({ type: "form" });
    const params = await body.value;

    data.title = params.get("title");
    data.question = params.get("question_text");
  }
  return data;
};

const getOptionData = async (request) => {
  const data = {
    optionText: "",
    iscorrect: false,
    validationErrors: [],
  };
  if (request) {
    const body = request.body({ type: "form" });
    const params = await body.value;
    data.optionText = params.get("option_text");
    data.iscorrect = params.get("is_correct");
    if (!data.iscorrect) {
      data.iscorrect = false;
    }
  }
  return data;
};
/**
 * validates the question and add it to the datbase
 */
const addQuestion = async ({ request, response, render, user }) => {
  const data = await getQuestionData(request);
  //validation
  const [passes, errors] = await validasaur.validate(
    data,
    qValidationRules,
  );
  if (!passes) {
    console.log(errors);
    //shows the validation errors to the user
    render("questions.eta", {
      title: data.title,
      question: data.question,
      validationErrors: errors,
      questions: await questionService.findQuestions(user.id),
    });
  } else {
    await questionService.addQuestion(
      user.id,
      data.title,
      data.question,
    );

    response.redirect("/questions");
  }
};
/**
 * validates the answer option and adds it to the datbase
 */
const addOption = async ({ params, request, response, render, user }) => {
  const id = params.id;
  const data = await getOptionData(request);
  //validation
  const [passes, errors] = await validasaur.validate(
    data,
    oValidationRules,
  );
  if (!passes) {
    console.log(errors);
    const res = await questionService.findQuestion(user.id, id);
    const options = await questionService.findOptions(id);
    //shows the validation errors to the user
    render("question.eta", {
      question: res.rows[0],
      options: options.rows,
      validationErrors: errors,
    });
  } else {
    await questionService.addOption(
      id,
      data.optionText,
      data.iscorrect,
    );

    response.redirect(`/questions/${id}`);
  }
};

/**
 * shows all questions created by the user
 * @param user
 */
const showQuestions = async ({ render, user }) => {
  const res = await questionService.findQuestions(user.id);

  render("questions.eta", { questions: res });
};

/**
 * Shows question and its answer options
 */
const showQuestion = async ({ params, render, user }) => {
  const id = params.id;

  const res = await questionService.findQuestion(user.id, id);
  const options = await questionService.findOptions(id);

  const data = {
    question: res.rows[0],
    options: options.rows,
  };

  render("question.eta", data);
};

const deleteOption = async ({ params, response }) => {
  const questionId = params.questionid;
  await questionService.deleteOption(params.optionId);
  response.redirect(`/questions/${questionId}`);
};
const deleteQuestion = async ({ params, response }) => {
  const questionId = params.id;
  await questionService.deleteQuestion(questionId);
  response.redirect(`/questions`);
};

const getQuestion = async ({ params, render }) => {
  const res = await questionService.getQuestion(params.id);
  const options = await questionService.findOptions(params.id);
  const data = {
    question: res.rows[0],
    options: options.rows,
  };

  render("quiz.eta", data);
};

/**
 * redirects to random question from DB
 */
const randomQuestion = async ({ response }) => {
  const obj = await questionService.randomId();
  const id = obj.id;
  response.redirect(`/quiz/${id}`);
};

/**
 * gets the correct answer and compares it to the users answer
 * also adds the users answer to DB
 */
const getAnswer = async ({ params, response, user }) => {
  //gets the correct answer for question
  const obj = await questionService.getCorrect(params.questionid);
  const correct = obj.option_text;
  //gets users answer options details from db, not necessary atm
  const res = await questionService.findAnswer(params.optionId);
  const answer = res.option_text;
  if (answer == correct) {
    await questionService.addAnswer(user.id, params.id, params.optionId, true);
    response.redirect(`/quiz/${params.questionid}/correct`);
  } else {
    await questionService.addAnswer(user.id, params.id, params.optionId, false);
    response.redirect(`/quiz/${params.questionid}/incorrect`);
  }
};

const showCorrect = ({ render }) => {
  render("correct.eta");
};

const showIncorrect = async ({ params, render }) => {
  //gets the correct answer to show user
  const obj = await questionService.getCorrect(params.id);
  const correct = obj.option_text;
  const data = {
    correct: correct,
  };
  render("incorrect.eta", data);
};

export {
  addOption,
  addQuestion,
  deleteOption,
  deleteQuestion,
  getAnswer,
  getQuestion,
  randomQuestion,
  showCorrect,
  showIncorrect,
  showQuestion,
  showQuestions,
};
