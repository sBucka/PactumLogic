import { useState } from "react";

type ValidationRules<T> = {
  [K in keyof T]?: {
    required?: boolean;
    minLength?: number;
    pattern?: RegExp;
    custom?: (value: T[K]) => string | null;
  }[];
};

export const useFormValidation = <T extends Record<string, any>>(
  initialData: T,
  rules: ValidationRules<T>
) => {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validateField = (name: keyof T, value: any): string | null => {
    const fieldRules = rules[name];
    if (!fieldRules) return null;

    for (const rule of fieldRules) {
      if (rule.required && (!value || value.toString().trim() === "")) {
        return `${String(name)} je povinné`;
      }
      if (rule.minLength && value.length < rule.minLength) {
        return `${String(name)} musí mať aspoň ${rule.minLength} znakov`;
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        return `${String(name)} má nesprávny formát`;
      }
      if (rule.custom) {
        const customError = rule.custom(value);
        if (customError) return customError;
      }
    }
    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof T]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const [field, value] of Object.entries(formData)) {
      const error = validateField(field as keyof T, value);
      if (error) {
        newErrors[field as keyof T] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  return {
    formData,
    setFormData,
    errors,
    handleChange,
    validate,
    hasErrors: Object.keys(errors).length > 0,
  };
};
