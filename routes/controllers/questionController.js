import * as questionService from "../../services/questionService.js";
import { validasaur } from "../../deps.js";

const qValidationRules = {
  title: [validasaur.required, validasaur.minLength(1)],
  question: [validasaur.required, validasaur.minLength(1)],
};

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
    data.question = params.get("question");
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
  }
  return data;
};

const addQuestion = async ({ request, response, render, user }) => {
  const data = await getQuestionData(request);
  const [passes, errors] = await validasaur.validate(
    data,
    qValidationRules,
  );
  if (!passes) {
    console.log(errors);

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

const addOption = async ({ params, request, response, render, user }) => {
  const id = params.id;
  const data = await getOptionData(request);

  const [passes, errors] = await validasaur.validate(
    data,
    oValidationRules,
  );
  if (!passes) {
    console.log(errors);
    const res = await questionService.findQuestion(user.id, id);
    const options = await questionService.findOptions(id);
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

const showQuestions = async ({ render, user }) => {
  const res = await questionService.findQuestions(user.id);

  render("questions.eta", { questions: res });
};
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
  response.redirect(`/questions/`);
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
const randomQuestion = async ({ response }) => {
  const obj = await questionService.randomId();
  const id = obj.id;
  response.redirect(`/quiz/${id}`);
};
const getAnswer = async ({ params, render, user }) => {
  const obj = await questionService.getCorrect(params.questionid);
  const correct = obj.option_text;
  const res = await questionService.findAnswer(params.optionId);
  const answer = res.option_text;
  if (answer == correct) {
    const data = {
      result: "correct",
    };
    await questionService.addAnswer(user.id, params.id, params.optionId, true);
    render("answer.eta", data);
  } else {
    const data = {
      result: "incorrect",
      correct: correct,
    };
    await questionService.addAnswer(user.id, params.id, params.optionId, false);
    render("answer.eta", data);
  }
};

export {
  addOption,
  addQuestion,
  deleteOption,
  deleteQuestion,
  getAnswer,
  getQuestion,
  randomQuestion,
  showQuestion,
  showQuestions,
};
