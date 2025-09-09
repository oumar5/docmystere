export interface Specialty {
  value: string;
  label: string;
  subSpecialties?: Specialty[];
}

export const specialties: Specialty[] = [
  {
    value: 'chirurgie',
    label: 'Chirurgie',
    subSpecialties: [
      { value: 'orl', label: 'ORL' },
      { value: 'orthopedie', label: 'Orthopédie' },
      { value: 'viscerale', label: 'Viscérale' },
      { value: 'urologie', label: 'Urologie' },
    ],
  },
  {
    value: 'cardiologie',
    label: 'Cardiologie',
    subSpecialties: [
      { value: 'rythmologie', label: 'Rythmologie' },
      {
        value: 'cardiologie-interventionnelle',
        label: 'Cardiologie interventionnelle',
      },
    ],
  },
  { value: 'dermatologie', label: 'Dermatologie' },
  { value: 'neurologie', label: 'Neurologie' },
  { value: 'pediatrie', label: 'Pédiatrie' },
  { value: 'gastro-enterologie', label: 'Gastro-entérologie' },
  { value: 'pneumologie', label: 'Pneumologie' },
  { value: 'endocrinologie', label: 'Endocrinologie' },
  { value: 'infectiologie', label: 'Infectiologie' },
];
