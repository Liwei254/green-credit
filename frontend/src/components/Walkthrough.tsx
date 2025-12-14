import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { walkthroughSteps } from "../config/walkthroughSteps";
import { walkthroughContent } from "./WalkthroughContent";

interface WalkthroughProps {
  onClose: () => void;
  onConnect: () => void;
  onDemo: () => void;
}

/**
 * Simple analytics abstraction
 * Replace console.log with GA / PostHog / Segment later
 */
const trackEvent = (event: string, data?: Record<string, unknown>) => {
  console.log(`[Analytics] ${event}`, data ?? {});
};

const Walkthrough: React.FC<WalkthroughProps> = ({
  onClose,
  onConnect,
  onDemo,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = walkthroughSteps;

  /* -----------------------------
     Analytics: walkthrough start
  ------------------------------ */
  useEffect(() => {
    trackEvent("walkthrough_started");
  }, []);

  /* -----------------------------
     Analytics: step viewed
  ------------------------------ */
  useEffect(() => {
    trackEvent("walkthrough_step_viewed", {
      stepId: steps[currentStep].id,
      stepIndex: currentStep,
    });
  }, [currentStep, steps]);

  /* -----------------------------
     Navigation handlers
  ------------------------------ */
  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      finish();
    }
  }, [currentStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const finish = useCallback(() => {
    localStorage.setItem("onboardingCompleted", "true");
    trackEvent("walkthrough_completed");
    onClose();
  }, [onClose]);

  const handleAction = (type?: "connect" | "demo") => {
    if (type === "connect") {
      trackEvent("walkthrough_connect_clicked");
      onConnect();
    }
    if (type === "demo") {
      trackEvent("walkthrough_demo_clicked");
      onDemo();
    }
  };

  /* -----------------------------
     Keyboard navigation
  ------------------------------ */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
      if (e.key === "Enter") nextStep();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextStep, prevStep, onClose]);

  /* -----------------------------
     Animations
  ------------------------------ */
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <AnimatePresence>
        <motion.div
          key="walkthrough-modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            {/* Progress Indicator */}
            <div className="flex justify-center mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full mx-1 ${
                    index <= currentStep ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">
              {steps[currentStep].title}
            </h2>

            {/* Animated Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={steps[currentStep].id}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="mb-6 text-gray-600 dark:text-gray-300"
              >
                {walkthroughContent[steps[currentStep].contentKey]}
              </motion.div>
            </AnimatePresence>

            {/* Action Buttons (Connect / Demo) */}
            {steps[currentStep].actions && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                {steps[currentStep].actions?.primary && (
                  <button
                    onClick={() =>
                      handleAction(steps[currentStep].actions?.primary)
                    }
                    className="btn btn-primary"
                  >
                    {steps[currentStep].actions?.primary === "connect"
                      ? "🔗 Connect Wallet"
                      : "🎮 Try Demo Mode"}
                  </button>
                )}

                {steps[currentStep].actions?.secondary && (
                  <button
                    onClick={() =>
                      handleAction(steps[currentStep].actions?.secondary)
                    }
                    className="btn btn-secondary"
                  >
                    {steps[currentStep].actions?.secondary === "connect"
                      ? "🔗 Connect Wallet"
                      : "🎮 Try Demo Mode"}
                  </button>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            {steps[currentStep].showButtons && (
              <div className="flex justify-between">
                {currentStep > 0 ? (
                  <button
                    onClick={prevStep}
                    className="btn btn-secondary"
                  >
                    Previous
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={
                    currentStep === steps.length - 1 ? finish : nextStep
                  }
                  className="btn btn-primary"
                >
                  {currentStep === steps.length - 1 ? "Finish" : "Next"}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Walkthrough;
