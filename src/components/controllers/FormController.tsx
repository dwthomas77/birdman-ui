import React, { useState } from "react";

export type FormApi<T> = {
  setValue: (name: keyof T, value: unknown) => void;
  setErrors: (errors: Record<string, string>) => void;
  setError: (name: string, message: string) => void;
  clearError: (name: string) => void;
  clearAllErrors: () => void;
  resetValues: () => void;
};

type FormChildProps<T> = FormApi<T> & {
  values: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
};

type FormProps<T> = {
  initialValues: T;
  onSubmit: (values: T, formApi: FormApi<T>) => Promise<void> | void;
  children: (form: FormChildProps<T>) => React.ReactNode;
};

export function Form<T extends object>({
  initialValues,
  onSubmit,
  children,
}: FormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = (name: keyof T, value: unknown) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setErrorsState = (nextErrors: Record<string, string>) => {
    setErrors(nextErrors);
  };

  const setError = (name: string, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [name]: message,
    }));
  };

  const clearError = (name: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  const resetValues = () => {
    setValues((prev) => {
      const nextValues = { ...prev } as Record<string, unknown>;
      Object.keys(nextValues).forEach((key) => {
        nextValues[key] = "";
      });
      return nextValues as T;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      await onSubmit(values, {
        setValue,
        setErrors: setErrorsState,
        setError,
        clearError,
        clearAllErrors,
        resetValues,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {children({
        values,
        errors,
        isSubmitting,
        setValue,
        setErrors: setErrorsState,
        setError,
        clearError,
        clearAllErrors,
        resetValues,
      })}
    </form>
  );
}
