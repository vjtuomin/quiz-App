import { executeQuery } from "../database/database.js";

const addQuestion = async (userId, title, question) => {
  await executeQuery(
    "INSERT INTO questions (user_id,  title, question_text) VALUES ($1, $2, $3)",
    userId,
    title,
    question,
  );
};

const addOption = async (questionId, text, isCorrect) => {
  await executeQuery(
    "INSERT INTO question_answer_options (question_id,  option_text, is_correct) VALUES ($1, $2, $3)",
    questionId,
    text,
    isCorrect,
  );
};

const addAnswer = async (userId, questionId, optionId, isCorrect) => {
  await executeQuery(
    "INSERT INTO question_answers (user_id, question_id,  question_answer_option_id, correct) VALUES ($1, $2, $3, $4)",
    userId,
    questionId,
    optionId,
    isCorrect,
  );
};
/**
 * @param  userId
 * @returns all questions created by the user
 */
const findQuestions = async (userId) => {
  const res = await executeQuery(
    "SELECT * FROM questions WHERE user_id=$1",
    userId,
  );
  return res.rows;
};

const findQuestion = async (userId, id) => {
  const res = await executeQuery(
    "SELECT * FROM questions WHERE user_id=$1 AND id = $2",
    userId,
    id,
  );
  return res;
};
const getQuestion = async (id) => {
  const res = await executeQuery(
    "SELECT * FROM questions WHERE id=$1 ",
    id,
  );
  return res;
};
/**
 * @param  id question id
 * @returns all the answer options for the question
 */
const findOptions = async (id) => {
  const res = await executeQuery(
    "SELECT * FROM question_answer_options WHERE question_id=$1 ",
    id,
  );
  return res;
};
/**
 * returns questions answers without is_correct field
 * @param  id question id
 * @returns
 */
const findOptionsNoAnswer = async (id) => {
  const res = await executeQuery(
    "SELECT id,option_text FROM question_answer_options WHERE question_id=$1 ",
    id,
  );
  return res;
};
/**
 * deletes all answers with the option id and the option from DB
 * @param  id
 */
const deleteOption = async (id) => {
  await executeQuery(
    "DELETE FROM question_answers WHERE question_answer_option_id=$1 ",
    id,
  );

  await executeQuery(
    "DELETE FROM question_answer_options WHERE id=$1 ",
    id,
  );
};

const deleteQuestion = async (id) => {
  await executeQuery(
    "DELETE FROM questions WHERE id=$1 ",
    id,
  );
};
/**
 * @returns random question id from DB
 */
const randomId = async () => {
  const res = await executeQuery(
    "SELECT id FROM questions ORDER BY random() LIMIT 1",
  );
  return res.rows[0];
};
/**
 * 
 * @param id question id
 * @returns the correct answer to the question
 */
const getCorrect = async (id) => {
  const res = await executeQuery(
    "SELECT * FROM question_answer_options WHERE question_id=$1 AND is_correct=true ",
    id,
  );
  return res.rows[0];
};


const findAnswer = async (id) => {
  const res = await executeQuery(
    "SELECT * FROM question_answer_options WHERE id=$1",
    id,
  );
  return res.rows[0];
};
export {
  addAnswer,
  addOption,
  addQuestion,
  deleteOption,
  deleteQuestion,
  findAnswer,
  findOptions,
  findOptionsNoAnswer,
  findQuestion,
  findQuestions,
  getCorrect,
  getQuestion,
  randomId,
};
