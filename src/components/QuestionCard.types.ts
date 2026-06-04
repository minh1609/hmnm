import type { Question } from '@/types';

export type { Question };

export interface QuestionCardProps {
    question: Question;
    currentIndex: number;
    totalCount: number;
    onAnswer: (optionIndex: number) => void;
}
