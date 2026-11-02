export interface Alternative {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: 'multiple_choice';
  statement: string;
  alternatives: Alternative[];
  correctAlternativeId: string;
}

export interface Quiz {
  id: string;
  authorId: string;
  title: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  questions?: Question[];
  status: 'draft' | 'published' | 'deleted';
  createdAt: string;
  updatedAt: string;
}

export type ActiveQuiz = Quiz & {
  status: 'draft' | 'published';
};
