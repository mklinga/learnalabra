export interface User {
  id: number;
  name: string;
  guesses: Array<any>;
};

export interface Word {
  id: number;
  value: string;
  translations: Array<number>;
  sentences: Array<number>;
}

export interface QuestionWord {
  word: Word;
  translations: Array<Word>;
}

export interface QuestionMap {
  [questionWordId: string]: QuestionWord;
}

export interface AnswerMap {
  [questionWordId: string]: Guess;
}

export interface GuessFormMap {
  [questionWordId: string]: string;
}

export interface Guess {
  wordId: number;
  correct: boolean;
  error?: any;
}

export enum GuessError {
  TYPO = 0,
  ACCENT = 1,
  UNRECOGNIZED = 2
}
