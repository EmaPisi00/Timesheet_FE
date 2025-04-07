$(document).ready(function () {
  const $monthsSelect = $("#monthsSelect");
  const $yearsSelect = $("#yearsSelect");

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Mese corrente (1-12)
  const currentYear = currentDate.getFullYear(); // Anno corrente

  // **1. Aggiungi gli anni disponibili (solo quello attuale e il precedente)**
  const validYears = [currentYear - 1, currentYear];

  validYears.forEach((year) => {
    const $yearOption = $("<option></option>").val(year).text(year);
    $yearsSelect.append($yearOption);
  });

  // **2. Funzione per aggiornare i mesi in base all'anno selezionato**
  function updateMonths() {
    const selectedYear = parseInt($yearsSelect.val(), 10);

    // Svuota la lista dei mesi prima di aggiornarla
    $monthsSelect.empty();

    // Calcola il mese massimo selezionabile (se l'anno è quello attuale, limita ai mesi fino al corrente)
    const maxMonth = selectedYear === currentYear ? currentMonth : 12;

    for (let i = 1; i <= maxMonth; i++) {
      const $monthOption = $("<option></option>").val(i).text(getMonthName(i));

      $monthsSelect.append($monthOption);
    }
  }

  // **4. Quando cambia l'anno, aggiorna i mesi disponibili**
  $yearsSelect.change(updateMonths);
});

// Funzione per ottenere il nome del mese dato un numero (1-12)
export function getMonthName(monthNumber) {
  return new Intl.DateTimeFormat("it-IT", { month: "long" })
    .format(new Date(2024, monthNumber - 1)) // Sottraggo 1 perché JavaScript usa mesi 0-11
    .replace(/^\w/, (c) => c.toUpperCase()); // Prima lettera maiuscola
}
