import type { Question } from '@/types';

export type { Question };

export interface QuestionCardProps {
    questions: Question[];
    loadingAnswer: boolean;
    showYesCelebration: boolean;
    onComplete: () => void;
}
