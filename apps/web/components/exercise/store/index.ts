import { create } from 'zustand';

interface ExerciseStore {
  isShown: boolean;
  isDescriptionShown: boolean;
  isImageRevealed: boolean;
  setIsShown: (condition: boolean) => void;
  changeIsDescriptionShown: (condition: boolean) => void;
  changeImageRevealed: () => void;
}

export const useExerciseStore = create<ExerciseStore>()((set) => ({
  isShown: false,
  isDescriptionShown: false,
  isImageRevealed: false,
  setIsShown: (condition) => set((state) => ({ isShown: condition })),
  changeIsDescriptionShown: (condition) => set((state) => ({ isDescriptionShown: condition })),
  changeImageRevealed: () => set((state) => ({ isImageRevealed: !state.isImageRevealed })),
}));
