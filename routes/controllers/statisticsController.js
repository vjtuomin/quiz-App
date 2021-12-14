import * as statisticsService from "../../services/statisticsService.js";

const showStatistics = async ({ render, user }) => {
  const usersWithMostAnswers = await statisticsService
    .findFiveUsersWithMostAnswers();
  const usersAnswers = await statisticsService
    .findUsersAnswers(user.id);
  const correctAnswers = await statisticsService
    .findUsersCorrectAnswers(user.id);

  render("statistics.eta", {
    mostAnswers: usersWithMostAnswers,
    answers: usersAnswers,
    rightAnswers: correctAnswers,
  });
};

export { showStatistics };
