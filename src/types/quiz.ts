export interface Quiz {
  id: string;
  authorId: string;
  title: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  status: 'draft' | 'published' | 'deleted';
  createdAt: string;
  updatedAt: string;
}
