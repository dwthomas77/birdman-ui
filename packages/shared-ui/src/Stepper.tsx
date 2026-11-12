export interface StepperProps {
  /** 1-based number of the active step. */
  activeStep: number;
  /** One entry per step; entries may be empty strings. */
  steps: string[];
  className?: string;
}

export default function Stepper({
  activeStep,
  steps,
  className = "",
}: StepperProps) {
  return (
    <ol className={`flex w-full items-start ${className}`.trim()}>
      {steps.map((description, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === activeStep;
        return (
          <li
            key={stepNumber}
            className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center"
            aria-current={isActive ? "step" : undefined}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-400"
              }`}
            >
              {stepNumber}
            </span>
            <span
              className={`px-1 text-xs ${
                isActive ? "text-slate-100" : "text-slate-500"
              }`}
            >
              {description}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
