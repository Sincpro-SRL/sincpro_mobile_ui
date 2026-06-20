import type {
  WizardContextValue,
  WizardProviderProps,
  WizardStepId,
} from "@sincpro/mobile-ui/views/Wizard/Wizard.context";
import { useWizard, WizardProvider } from "@sincpro/mobile-ui/views/Wizard/Wizard.context";
import type { FC, ReactNode } from "react";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";

export interface WizardStepGuard {
  canEnter?: () => boolean | Promise<boolean>;
  onEnterFailed?: () => void;
}

export interface WizardStepLifecycle {
  onEnter?: () => void | Promise<void>;
  onExit?: () => void | Promise<void>;
}

export interface WizardStepProps extends WizardStepGuard, WizardStepLifecycle {
  name: WizardStepId;
  children: ReactNode | ((context: WizardContextValue) => ReactNode);
}

export interface WizardGuardProps extends WizardStepGuard {
  children: ReactNode;
}

export interface WizardGoProps {
  step: WizardStepId;
  children: ReactNode;
  onPress?: () => void;
}

export interface WizardBackProps {
  children?: ReactNode;
  onPress?: () => void;
}

const WizardRoot: FC<WizardProviderProps> = (props) => {
  return <WizardProvider {...props} />;
};

const WizardStep: FC<WizardStepProps> = ({
  name,
  children,
  canEnter,
  onEnterFailed,
  onEnter,
  onExit,
}) => {
  const wizard = useWizard();

  useEffect(() => {
    if (wizard.currentStep === name) {
      const checkAndEnter = async () => {
        if (canEnter) {
          const allowed = await canEnter();
          if (!allowed) {
            onEnterFailed?.();
            wizard.back();
            return;
          }
        }
        await onEnter?.();
      };

      void checkAndEnter();
    }

    return () => {
      if (wizard.currentStep === name) {
        void onExit?.();
      }
    };
  }, [wizard.currentStep, name, canEnter, onEnterFailed, onEnter, onExit, wizard]);

  if (wizard.currentStep !== name) {
    return null;
  }

  if (typeof children === "function") {
    return <>{children(wizard)}</>;
  }

  return <>{children}</>;
};

const WizardGuard: FC<WizardGuardProps> = ({ children, canEnter, onEnterFailed }) => {
  const wizard = useWizard();

  useEffect(() => {
    const checkGuard = async () => {
      if (canEnter) {
        const allowed = await canEnter();
        if (!allowed) {
          onEnterFailed?.();
          wizard.back();
        }
      }
    };

    void checkGuard();
  }, [canEnter, onEnterFailed, wizard]);

  return <>{children}</>;
};

const WizardGo: FC<WizardGoProps> = ({ step, children, onPress }) => {
  const wizard = useWizard();

  const handlePress = () => {
    onPress?.();
    wizard.goToStep(step);
  };

  if (typeof children === "function") {
    return <>{(children as any)(handlePress)}</>;
  }

  return <TouchableOpacity onPress={handlePress}>{children}</TouchableOpacity>;
};

const WizardBack: FC<WizardBackProps> = ({ children, onPress }) => {
  const wizard = useWizard();

  const handlePress = () => {
    onPress?.();
    wizard.back();
  };

  if (!children) {
    return null;
  }

  if (typeof children === "function") {
    return <>{(children as any)(handlePress)}</>;
  }

  return <TouchableOpacity onPress={handlePress}>{children}</TouchableOpacity>;
};

export const Wizard = {
  Root: WizardRoot,
  Step: WizardStep,
  Guard: WizardGuard,
  Go: WizardGo,
  Back: WizardBack,
};
