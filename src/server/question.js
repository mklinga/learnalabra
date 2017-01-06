var uuidV4 = require('uuid/v4');

var userService = require('./user');
var wordService = require('./words');
var sentenceService = require('./sentence');

function getGuessStatsForWord (guesses, word) {
  var wordGuesses = guesses.filter(function (guess) {
    return guess.wordId === word.id;
  });

  var correct = wordGuesses.filter(function (guess) {
    return guess.correct;
  }).length;

  var incorrect = wordGuesses.length - correct;

  var lastGuess = wordGuesses.reduce(function (last, guess) {
    return last > guess.guessed_at ? last : guess.guessed_at;
  }, 0);

  return ({
    correct: correct,
    guesses: wordGuesses,
    incorrect: incorrect,
    lastGuess: lastGuess,
    noGuesses: (wordGuesses.length === 0)
  });
}

function calculateWordProbability (word, guesses) {
  // Probability rules:
  //
  // Calculate random number (0 - 30)
  //
  // If word has never been guessed, return the random number
  // Otherwise, start from 100 + said random number
  //
  // For each correct guess on word, reduce 20
  // For each incorrect guess on word, add 33
  //
  // Add 0.33 points for each day the word has not been asked
  //
  // Final result is max (calculated value, random number (1 - 4))

  var randomNumber = Math.ceil(Math.random() * 30);
  var wordGuesses = getGuessStatsForWord(guesses, word);

  if (wordGuesses.noGuesses) {
    return randomNumber;
  }

  var initialValue = randomNumber + 100; 
  var correctGuessModifier = -(20 * wordGuesses.correct);
  var incorrectGuessModifier = (33 * wordGuesses.incorrect);

  var daysSinceLastGuess = (Date.now() - wordGuesses.lastGuess) / 1000 / 60 / 60 / 24;
  var timeAgoModifier = Math.round(daysSinceLastGuess * 0.33); 
  var calculatedResult = initialValue + correctGuessModifier + incorrectGuessModifier + timeAgoModifier;

  return Math.max(calculatedResult, Math.round(1 + Math.random() * 3));
}

function buildWordProbabilities (words, guesses) {
  return words.map(function (word) {
    return Object.assign(word,
      { probability: calculateWordProbability(word, guesses) }
    );
  });
}

function takeEvenlyFromWeightedList (words) {
  var totalProbability = words.reduce(function(total, word) {
    return total + word.probability;
  }, 0);

  var point = Math.random() * totalProbability;

  var accumulated = 0, index = 0;
  while (true) {
    accumulated += words[index].probability;

    if (accumulated > point || index === (words.length - 1)) {
      return words[index];
    }

    index++;
  }
}

function getSetOfQuestions (userId, language, amount) {
  amount = amount || 5;

  var user = userService.getUser(userId);
  var allWords = wordService.getWords()

  var wordsWithQuestionLanguage = (language === undefined)
    ? allWords
    : allWords.filter(function (word) { return word.lang === language; });

  var weightedWords = buildWordProbabilities(wordsWithQuestionLanguage, user.guesses);
  var questionWords = [];
  for (var i = 0; i < amount; i++) {
    var nextWord = takeEvenlyFromWeightedList(weightedWords);
    questionWords.push(nextWord);

    // Remove the picked words from the pool so we don't get duplicates
    weightedWords = weightedWords.filter(function (weightedWord) {
      return !questionWords.find(function (questionWord) {
        return questionWord.id === weightedWord.id;
      })
    });
  }

  var richQuestionWords = questionWords.map(function (question) {
    var translations = allWords.filter(function (word) {
      return (question.translations.indexOf(word.id) !== -1);
    });

    var relatedSentences = sentenceService.getSentencesByIds(question.sentences || []);
    var guessStatistics = getGuessStatsForWord(user.guesses, question);

    return ({
      id: uuidV4(),
      sentences: relatedSentences,
      statistics: guessStatistics,
      translations: translations,
      word: question
    });
  });

  return richQuestionWords;
}

module.exports = {
  getSetOfQuestions: getSetOfQuestions
};
