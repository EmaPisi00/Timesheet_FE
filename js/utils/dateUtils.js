$(document).ready(function () {
  // Seleziona gli elementi <select>
  const $monthsSelect = $("#monthsSelect");
  const $yearsSelect = $("#yearsSelect");

  // Aggiungi i mesi
  for (let i = 1; i <= 12; i++) {
    const $monthOption = $("<option></option>")
      .val(i) // Mese numerico (1-12)
      .text(getMonthName(i));

    $monthsSelect.append($monthOption);
  }

  // Aggiungi gli anni
  const currentYear = new Date().getFullYear(); // Anno corrente
  for (let year = currentYear - 1; year <= currentYear + 5; year++) {
    const $yearOption = $("<option></option>").val(year).text(year);

    $yearsSelect.append($yearOption);
  }
});

// Funzione per ottenere il nome del mese dato un numero (1-12)
export function getMonthName(monthNumber) {
  return new Intl.DateTimeFormat("it-IT", { month: "long" })
    .format(new Date(2024, monthNumber - 1)) // Sottraggo 1 perché JavaScript usa mesi 0-11
    .replace(/^\w/, (c) => c.toUpperCase()); // Prima lettera maiuscola
}
