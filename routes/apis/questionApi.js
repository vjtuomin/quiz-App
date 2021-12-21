import * as questionService from "../../services/questionService.js";

const randomQuestion = async ({ response }) => {
  const obj = await questionService.randomId();
  if (obj != null) {
    const id = obj.id;
    const res = await questionService.getQuestion(id);
    const res2 = await questionService.findOptionsNoAnswer(id);
    const question = res.rows[0];

    const options = [];
    for (let i = 0; i < res2.rows.length; i++) {
      const x = {
        optionId: res2.rows[i].id,
        optionText: res2.rows[i].option_text,
      };
      options.push(x);
    }

    const data = {
      questionId: id,
      questionTitle: question.title,
      questionText: question.question_text,
      answerOptions: options,
    };

    response.body = data;
  } else {
    response.body = {};
  }
};

const getAnswer = async ({ request, response }) => {
  const body = request.body({ type: "json" });
  const params = await body.value;
  const optionId = params.optionId;
  const obj = await questionService.findAnswer(optionId);
  if (obj != null) {
    let bool = obj.is_correct;
    if (bool === null) bool = false;
    response.body = { correct: bool };
  } else {
    response.body = {};
  }
};

export { getAnswer, randomQuestion };
