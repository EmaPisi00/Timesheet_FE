$(document).ready(function () {
  // Seleziona gli elementi <select>
  const $monthsSelect = $("#monthsSelect");
  const $yearsSelect = $("#yearsSelect");

  // Aggiungi i mesi
  for (let i = 0; i < 12; i++) {
    const monthName = new Intl.DateTimeFormat("it-IT", {
      month: "long",
    }).format(new Date(2024, i));

    const $monthOption = $("<option></option>")
      .val(i + 1) // Mese in formato numerico (1-12)
      .text(monthName.charAt(0).toUpperCase() + monthName.slice(1)); // Prima lettera maiuscola

    $monthsSelect.append($monthOption);
  }

  // Aggiungi gli anni
  const currentYear = new Date().getFullYear(); // Anno corrente
  for (let year = currentYear - 1; year <= currentYear + 5; year++) {
    const $yearOption = $("<option></option>")
      .val(year) // Imposta l'anno come valore
      .text(year); // Imposta l'anno come testo visibile

    $yearsSelect.append($yearOption);
  }
});
