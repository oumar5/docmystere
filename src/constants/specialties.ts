export const specialties = [
    { value: "chirurgie", label: "Chirurgie" },
    { value: "cardiologie", label: "Cardiologie" },
    { value: "dermatologie", label: "Dermatologie" },
    { value: "neurologie", label: "Neurologie" },
    { value: "pediatrie", label: "Pédiatrie" },
  ];

  export const subSpecialties: Record<string, { value: string; label: string }[]> = {
    chirurgie: [
      { value: "orl", label: "ORL" },
      { value: "orthopedie", label: "Orthopédie" },
      { value: "viscerale", label: "Viscérale" },
    ],
  };
