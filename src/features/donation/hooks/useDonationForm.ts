import { useState, useEffect, useCallback } from "react";
import type {
  DonationFormData,
  DonationFrequency,
  DonationAmount,
  PersonalDetails,
  Gender,
} from "../types/donation.types";

const STORAGE_KEY = "donation_form_data";

const DEFAULT_FORM_DATA: DonationFormData = {
  frequency: "maandelijks",
  amount: 10,
  step: 1,
  personalDetails: {},
};

/**
 * Hook for managing donation form state and localStorage persistence
 */
export const useDonationForm = () => {
  const [formData, setFormData] = useState<DonationFormData>(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_FORM_DATA;
      }
    }
    return DEFAULT_FORM_DATA;
  });

  // Save to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const setFrequency = useCallback((frequency: DonationFrequency) => {
    setFormData((prev) => ({ ...prev, frequency }));
  }, []);

  const setAmount = useCallback((amount: DonationAmount) => {
    setFormData((prev) => ({
      ...prev,
      amount,
      // Clear customAmount if not using custom
      customAmount: amount === "custom" ? prev.customAmount : undefined,
    }));
  }, []);

  const setCustomAmount = useCallback((customAmount: number) => {
    setFormData((prev) => ({ ...prev, customAmount }));
  }, []);

  const setStep = useCallback((step: 1 | 2) => {
    setFormData((prev) => ({ ...prev, step }));
  }, []);

  const setPersonalDetails = useCallback((personalDetails: PersonalDetails) => {
    setFormData((prev) => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, ...personalDetails },
    }));
  }, []);

  const setGender = useCallback(
    (gender: Gender) => {
      setPersonalDetails({ gender });
    },
    [setPersonalDetails]
  );

  const getCurrentAmount = useCallback((): number => {
    if (formData.amount === "custom") {
      return formData.customAmount || 0;
    }
    return formData.amount;
  }, [formData]);

  const getFormDataJSON = useCallback((): string => {
    return JSON.stringify(formData, null, 2);
  }, [formData]);

  return {
    formData,
    setFrequency,
    setAmount,
    setCustomAmount,
    setStep,
    setPersonalDetails,
    setGender,
    getCurrentAmount,
    getFormDataJSON,
  };
};
