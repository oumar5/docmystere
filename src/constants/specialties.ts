export const specialties = [
    { value: "chirurgie", label: "Chirurgie" },
    { value: "cardiologie", label: "Cardiologie" },
    { value: "dermatologie", label: "Dermatologie" },
    { value: "neurologie", label: "Neurologie" },
    { value: "pediatrie", label: "Pédiatrie" },
    { value: "gastro-enterologie", label: "Gastro-entérologie" },
    { value: "pneumologie", label: "Pneumologie" },
    { value: "endocrinologie", label: "Endocrinologie" },
    { value: "infectiologie", label: "Infectiologie" },
  ];

  export const subSpecialties: Record<string, { value: string; label: string }[]> = {
    chirurgie: [
      { value: "orl", label: "ORL" },
      { value: "orthopedie", label: "Orthopédie" },
      { value: "viscerale", label: "Viscérale" },
      { value: "urologie", label: "Urologie" },
    ],
    cardiologie: [
        { value: "rythmologie", label: "Rythmologie" },
        { value: "cardiologie-interventionnelle", label: "Cardiologie interventionnelle" },
    ]
  };
