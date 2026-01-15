/**
 * Donation form types
 */

export type DonationFrequency = "eenmalig" | "maandelijks" | "jaarlijks";

export type DonationAmount = 6 | 10 | 15 | "custom";

export type Gender = "man" | "vrouw" | "ander";

export interface PersonalDetails {
  gender?: Gender;
  voornaam?: string;
  tussenvoegsel?: string;
  achternaam?: string;
  email?: string;
  telefoonnummer?: string;
  emailUpdates?: boolean;
}

export interface DonationFormData {
  frequency: DonationFrequency;
  amount: DonationAmount;
  customAmount?: number;
  step: 1 | 2;
  personalDetails?: PersonalDetails;
}

export interface DonationInfo {
  amount: number;
  message: string;
}
