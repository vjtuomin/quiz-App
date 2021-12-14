import { executeQuery } from "../database/database.js";

const findFiveUsersWithMostAnswers = async () => {
  const res = await executeQuery(
    `SELECT users.email as email, count(*) as count FROM users
    JOIN question_answers ON users.id = question_answers.user_id
    GROUP BY users.email
    ORDER BY count
    LIMIT 5`,
  );

  return res.rows;
};

const findUsersAnswers = async (id) => {
  const res = await executeQuery(
    `SELECT users.email as email, count(*) as count FROM users
        JOIN question_answers ON users.id = $1
        GROUP BY users.email
        ORDER BY count `,
    id,
  );

  return res.rows;
};

const findUsersCorrectAnswers = async (id) => {
  const res = await executeQuery(
    `SELECT users.email as email, count(*) as count FROM users
        JOIN question_answers ON users.id = $1 AND correct=true
        GROUP BY users.email
        ORDER BY count `,
    id,
  );

  return res.rows;
};

export {
  findFiveUsersWithMostAnswers,
  findUsersAnswers,
  findUsersCorrectAnswers,
};
