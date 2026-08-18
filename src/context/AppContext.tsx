import React, { createContext, useContext, useMemo, useState } from 'react';
import { evidenceCases, lieCases, storyCases } from '../data/gameData';

type CaseStatus = 'new' | 'inProgress' | 'solved';

type AppContextValue = {
  finishedOnboarding: boolean;
  setFinishedOnboarding: (value: boolean) => void;
  storyProgress: Record<string, CaseStatus>;
  lieProgress: Record<string, boolean>;
  evidenceProgress: Record<string, boolean>;
  bestClueCatchScore: number;
  currentClueCatchScore: number;
  markStoryInProgress: (id: string) => void;
  markStorySolved: (id: string) => void;
  closeStoryCase: (id: string) => void;
  setLieSolved: (id: string) => void;
  setEvidenceSolved: (id: string) => void;
  setClueCatchResult: (score: number) => void;
  resetProgress: () => void;
};

const initialStoryProgress = storyCases.reduce<Record<string, CaseStatus>>((acc, item, index) => {
  acc[item.id] = index === 0 ? 'solved' : index === 1 ? 'inProgress' : 'new';
  return acc;
}, {});

const initialLieProgress = lieCases.reduce<Record<string, boolean>>((acc, item) => {
  acc[item.id] = false;
  return acc;
}, {});

const initialEvidenceProgress = evidenceCases.reduce<Record<string, boolean>>((acc, item, index) => {
  acc[item.id] = index === 0;
  return acc;
}, {});

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [finishedOnboarding, setFinishedOnboarding] = useState(false);
  const [storyProgress, setStoryProgress] = useState(initialStoryProgress);
  const [lieProgress, setLieProgress] = useState(initialLieProgress);
  const [evidenceProgress, setEvidenceProgress] = useState(initialEvidenceProgress);
  const [bestClueCatchScore, setBestClueCatchScore] = useState(4850);
  const [currentClueCatchScore, setCurrentClueCatchScore] = useState(0);

  const value = useMemo<AppContextValue>(
    () => ({
      finishedOnboarding,
      setFinishedOnboarding,
      storyProgress,
      lieProgress,
      evidenceProgress,
      bestClueCatchScore,
      currentClueCatchScore,
      markStoryInProgress: id => {
        setStoryProgress(prev => ({ ...prev, [id]: prev[id] === 'solved' ? 'solved' : 'inProgress' }));
      },
      markStorySolved: id => {
        setStoryProgress(prev => ({ ...prev, [id]: 'solved' }));
      },
      closeStoryCase: id => {
        setStoryProgress(prev => ({ ...prev, [id]: 'new' }));
      },
      setLieSolved: id => {
        setLieProgress(prev => ({ ...prev, [id]: true }));
      },
      setEvidenceSolved: id => {
        setEvidenceProgress(prev => ({ ...prev, [id]: true }));
      },
      setClueCatchResult: score => {
        setCurrentClueCatchScore(score);
        setBestClueCatchScore(prev => (score > prev ? score : prev));
      },
      resetProgress: () => {
        setStoryProgress(initialStoryProgress);
        setLieProgress(initialLieProgress);
        setEvidenceProgress(initialEvidenceProgress);
        setCurrentClueCatchScore(0);
      },
    }),
    [bestClueCatchScore, currentClueCatchScore, evidenceProgress, finishedOnboarding, lieProgress, storyProgress],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
