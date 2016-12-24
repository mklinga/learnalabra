var userService = require('./user');
var wordService = require('./words');

function calculateWordProbability (word, guesses) {
  // Probability rules (0-100):
  // If word has not yet been guessed: 20-25
  // If word has been guessed, start from 100
  // For each correct guess, reduce 20
  // For each incorrect guess, add 25
  // The minimum probability is 2

  var wordGuesses = guesses.filter(function (guess) {
    return guess.wordId === word.id;
  });

  if (wordGuesses.length === 0) {
    return 20 + Math.random() * 5;
  }

  var initialValue = 100; 
  var correctGuesses = wordGuesses.filter(function (guess) {
    return guess.correct;
  });
  var incorrectGuesses = wordGuesses.length - correctGuesses.length;

  return Math.max(initialValue - (20 * correctGuesses.length) + (25 * incorrectGuesses), 2);
}

function buildWordProbabilities (words, guesses) {
  return words
    .map(function (word) {
      return Object.assign(word,
        { probability: calculateWordProbability(word, guesses) }
      );
    })
    .sort(function (a, b) {
      return b.probability - a.probability;
    });
}

function getSetOfQuestions (userId, language, amount) {
  amount = amount || 2;
  language = language || 'es';

  var user = userService.getUser(userId);
  var allWords = wordService.getWords()

  var wordsWithQuestionLanguage = allWords
    .filter(function (word) { return word.lang === language; });

  var weightedWords = buildWordProbabilities(wordsWithQuestionLanguage, user.guesses);
  var questionWords = weightedWords.slice(0, amount);
  var questionWordsWithTranslations = questionWords.map(function (question) {
    var translations = allWords.filter(function (word) {
      return (question.translations.indexOf(word.id) !== -1);
    });
    return ({ question: question, translations: translations });
  });

  // TODO: find translation, sentence
  return questionWordsWithTranslations;
}

module.exports = {
  getSetOfQuestions: getSetOfQuestions
};
