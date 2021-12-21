import * as questionService from "../../services/questionService.js";

const randomQuestion = async ({ response }) => {
  const obj = await questionService.randomId();
  const id = obj.id;
  const res = await questionService.getQuestion(id);
  const res2 = await questionService.findOptions(id);
  const question = res.rows[0];
  const options = res2.rows;

  const data = {
    questionId: id,
    questionTitle: question.title,
    questionText: question.question_text,
    answerOptions: { options },
  };
  if (data != null) {
    response.body = data;
  }
  response.body = JSON.parse("{}");
};

const getAnswer = async ({ request, response }) => {
  const body = request.body({ type: "json" });
  const params = await body.value;
  const optionId = params.optionId;
  const obj = await questionService.findAnswer(optionId);
  let bool = obj.is_correct;
  if (bool === null) bool = false;
  response.body = { correct: bool };
};

export { getAnswer, randomQuestion };
