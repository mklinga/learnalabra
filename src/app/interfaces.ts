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

