var userService = require('./user');
var wordService = require('./words');

function calculateWordProbability (word, guesses) {
  // Probability rules:
  //
  // If word has been guessed at least once, start from 100
  // Otherwise, start from 0
  //
  // For each correct guess on word, reduce 20
  // For each incorrect guess on word, add 25
  // 
  // Add random number to word (0-50)
  // 
  // TODO: Add a value based on last quess timestamp (the further away, the bigger the number)
  //
  // Take n amount of biggest values


  var randomNumber = Math.ceil(Math.random() * 50);

  var wordGuesses = guesses.filter(function (guess) {
    return guess.wordId === word.id;
  });

  if (wordGuesses.length === 0) {
    return randomNumber;
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
