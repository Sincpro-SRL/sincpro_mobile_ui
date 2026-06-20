import { ErrorBoundary } from "@sincpro/mobile-ui/Feedback";
import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export type WizardStepId = string;

export interface WizardContextValue {
  currentStep: WizardStepId;
  stepHistory: WizardStepId[];
  goToStep: (step: WizardStepId) => void;
  back: () => void;
  next: () => void;
  reset: (initialStep?: WizardStepId) => void;
  canGoBack: boolean;
  canGoNext: boolean;
  totalSteps: number;
  currentStepIndex: number;
  progress: number;
}

export interface WizardProviderProps {
  children: ReactNode;
  initialStep: WizardStepId;
  steps?: WizardStepId[];
  onComplete?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  loadingMessage?: string;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({
  children,
  initialStep,
  steps = [],
  onComplete,
  onCancel,
  isLoading = false,
  loadingMessage,
}: WizardProviderProps) {
  const [currentStep, setCurrentStep] = useState<WizardStepId>(initialStep);
  const [stepHistory, setStepHistory] = useState<WizardStepId[]>([initialStep]);

  const goToStep = useCallback((step: WizardStepId) => {
    setStepHistory((prev) => [...prev, step]);
    setCurrentStep(step);
  }, []);

  const back = useCallback(() => {
    setStepHistory((prev) => {
      if (prev.length <= 1) return prev;
      const newHistory = prev.slice(0, -1);
      const previousStep = newHistory[newHistory.length - 1];
      setCurrentStep(previousStep);
      return newHistory;
    });
  }, []);

  const next = useCallback(() => {
    if (steps.length === 0) return;

    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex === -1 || currentIndex === steps.length - 1) {
      onComplete?.();
      return;
    }

    const nextStep = steps[currentIndex + 1];
    goToStep(nextStep);
  }, [currentStep, steps, goToStep, onComplete]);

  const reset = useCallback(
    (step?: WizardStepId) => {
      const targetStep = step ?? initialStep;
      setCurrentStep(targetStep);
      setStepHistory([targetStep]);
    },
    [initialStep],
  );

  const canGoBack = useMemo(() => stepHistory.length > 1, [stepHistory.length]);

  const canGoNext = useMemo(() => {
    if (steps.length === 0) return false;
    const currentIndex = steps.indexOf(currentStep);
    return currentIndex !== -1 && currentIndex < steps.length - 1;
  }, [currentStep, steps]);

  const currentStepIndex = useMemo(() => {
    if (steps.length === 0) return 0;
    return steps.indexOf(currentStep);
  }, [currentStep, steps]);

  const progress = useMemo(() => {
    if (steps.length === 0) return 0;
    return ((currentStepIndex + 1) / steps.length) * 100;
  }, [currentStepIndex, steps.length]);

  const value: WizardContextValue = useMemo(
    () => ({
      currentStep,
      stepHistory,
      goToStep,
      back,
      next,
      reset,
      canGoBack,
      canGoNext,
      totalSteps: steps.length,
      currentStepIndex,
      progress,
    }),
    [
      currentStep,
      stepHistory,
      goToStep,
      back,
      next,
      reset,
      canGoBack,
      canGoNext,
      steps.length,
      currentStepIndex,
      progress,
    ],
  );

  if (isLoading) {
    return (
      <ErrorBoundary>
        <View className="flex-1">
          <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
          <View className="absolute inset-0 bg-black/50 justify-center items-center">
            <View className="bg-bg-card rounded-xl p-6 min-w-[200px] items-center shadow-lg">
              <ActivityIndicator className="text-warning" size="large" />
              {loadingMessage && (
                <Text className="mt-4 text-base text-text-primary text-center">
                  {loadingMessage}
                </Text>
              )}
            </View>
          </View>
        </View>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
    </ErrorBoundary>
  );
}

export function useWizard(): WizardContextValue {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within WizardProvider");
  }
  return context;
}
