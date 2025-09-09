export interface Specialty {
  value: string;
  label: string;
  subSpecialties?: Specialty[];
}
