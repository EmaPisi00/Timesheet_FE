import {
  hideItem,
  showItem,
  disableLinks,
  enableLinks,
  isEmpty,
  showToast,
} from "../../utils/utils.js";
import { getMonthName } from "../../utils/date-utils.js";
import { OptionStatusDayArray } from "../../utils/constant.js";

export const generateTimesheet = (year, month, request) => {
  // Prendo dall'oggetto della richiesta solo la lista delle presenze
  let daysData = request.presenceList;

  // Mostra il loader
  showItem("#loader-middle");

  // Nasconde tutti i button o altro durante il caricamento
  hideItemsBeforeLoadTable();

  // Disabilito i link o pulsanti
  disableLinks();

  // Inserisco un timeout per ritardare la generazione
  setTimeout(() => {
    const tableContainer = $("#tableContainer");
    tableContainer.empty(); // Pulisce qualsiasi tabella esistente

    // Determina il numero di giorni nel mese
    const daysInMonth = new Date(year, month, 0).getDate();

    // Creazione della tabella senza Bootstrap
    const table = $("<table>");

    const thead = $("<thead>").css({
      backgroundColor: "#f0f0f0", // Intestazione grigia chiara
      color: "black", // Testo grigio scuro
      textAlign: "center",
    });
    const headerRow = $("<tr>");
    headerRow.append("<th style='padding: 12px 15px;'>Giorno</th>");
    headerRow.append("<th style='padding: 12px 15px;'>Orario Entrata</th>");
    headerRow.append("<th style='padding: 12px 15px;'>Orario Uscita</th>");
    headerRow.append("<th style='padding: 12px 15px;'>Note</th>");
    headerRow.append("<th style='padding: 12px 15px;'>Stato</th>");
    thead.append(headerRow);
    table.append(thead);

    const tbody = $("<tbody>");

    // Ciclo per generare una riga per ogni giorno del mese
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${day} ${getMonthName(month)} ${year}`;

      // Trova i dati per il giorno corrente
      const dayData = daysData.find(
        (d) =>
          d.workDay ===
          `${year}-${month.toString().padStart(2, "0")}-${day
            .toString()
            .padStart(2, "0")}`
      );

      const row = $("<tr>").css({
        textAlign: "center",
        verticalAlign: "middle",
      });

      // Colonna Giorno
      row.append(`<td><strong>${dateString}</strong></td>`);

      // Colonna Orario Entrata
      const startTimeSelect = $("<select>").addClass("form-select").css({
        padding: "5px",
        fontSize: "14px",
        width: "100px",
      });
      for (let h = 0; h < 24; h++) {
        const hour = `${h.toString().padStart(2, "0")}:00`;
        startTimeSelect.append($("<option>").val(hour).text(hour));
      }
      // Imposta il valore di entrata
      if (dayData) {
        const formattedEntryTime = dayData.entryTime.substring(0, 5);
        startTimeSelect.val(formattedEntryTime);
      }

      row.append($("<td>").append(startTimeSelect));

      // Colonna Orario Uscita
      const endTimeSelect = $("<select>").addClass("form-select").css({
        padding: "5px",
        fontSize: "14px",
        width: "100px",
      });
      for (let h = 0; h < 24; h++) {
        const hour = `${h.toString().padStart(2, "0")}:00`;
        endTimeSelect.append($("<option>").val(hour).text(hour));
      }
      // Imposta il valore di uscita
      if (dayData) {
        const formattedExitTime = dayData.exitTime.substring(0, 5);
        endTimeSelect.val(formattedExitTime);
      }

      row.append($("<td>").append(endTimeSelect));

      // Colonna Note
      const noteInput = $("<input>")
        .attr("type", "text")
        .addClass("form-control note-input")
        .attr("placeholder", "Aggiungi una nota...")
        .on("click", function () {
          // Rendi l'input modificabile se cliccato
          $(this).prop("readonly", false); // Rendi l'input editabile
        });

      // Aggiungi il campo note al <td>
      row.append($("<td>").append(noteInput));

      // Se esiste una descrizione, la imposti come valore del campo input
      if (!isEmpty(dayData.description)) {
        noteInput.val(dayData.description).prop("readonly", true); // Imposta il valore, rendendo l'input non modificabile
      }

      // Colonna Stato
      const statusSelect = $("<select>").addClass("form-select status-select");

      // Aggiungi le opzioni tradotte dall'enum
      OptionStatusDayArray.forEach((option) => {
        const optionElement = $("<option>")
          .val(option.value)
          .text(option.label);

        // Se l'opzione corrisponde al valore di `dayData.statusDayEnum`, imposta `selected`
        if (option.value === dayData.statusDayEnum) {
          optionElement.prop("selected", true);
        }

        statusSelect.append(optionElement); // Aggiungi l'opzione
      });

      row.append($("<td>").append(statusSelect));

      // Logica di colorazione
      if (dayData) {
        const entryHour = parseInt(dayData.entryTime.split(":")[0]);
        const exitHour = parseInt(dayData.exitTime.split(":")[0]);
        const entryMinutes = parseInt(dayData.entryTime.split(":")[1]);
        const exitMinutes = parseInt(dayData.exitTime.split(":")[1]);

        const entryTimeInMinutes = entryHour * 60 + entryMinutes;
        const exitTimeInMinutes = exitHour * 60 + exitMinutes;
        const workedMinutes = exitTimeInMinutes - entryTimeInMinutes;
        const workedHours = workedMinutes / 60;

        // Calcolo della differenza in ore
        if (workedHours >= 8) {
          row.css("background-color", "#f9f9f9"); // Righe lavorative: grigio chiaro
        } else if (workedHours >= 8) {
          row.css("background-color", "#007bff").css("color", "white"); // Blu per straordinari
        } else if (workedHours >= 4 && workedHours < 8) {
          row.css("background-color", "#ffeb3b"); // Giallo per permesso
        } else if (workedHours < 4 || exitTimeInMinutes <= entryTimeInMinutes) {
          row.css("background-color", "#f44336").css("color", "white"); // Rosso per uscita anomala
        }
      }

      // Colora di rosso per sabato e domenica
      const date = new Date(`${year}-${month}-${day}`);
      if (date.getDay() === 6 || date.getDay() === 0) {
        // Sabato o Domenica
        row.css("background-color", "#f44336").css("color", "white"); // Rosso per sabato/domenica
      }

      tbody.append(row);
    }

    // Append il tbody alla tabella
    table.append(tbody);

    // Div scrollabile per la tabella
    const scrollableTable = $("<div>")
      .addClass("scrollable-table")
      .append(table);

    // Aggiungi la tabella al container
    tableContainer.append(scrollableTable);

    // Riabilita i pulsanti e mostra il titolo
    showItemsAfterLoadTable();

    // Mostro il titolo del timesheet con mese + anno
    $("#titleTimesheet")
      .text(`Timesheet Mese di ${getMonthName(month)} ${year}`)
      .show();

    // Nascondo il loader
    hideItem("#loader-middle");

    // Aggiungo margine-top per evitare che il titolo venga spinto troppo in alto
    $("#containerTitleSelect").css("margin-top", "40%");

    // Riabilito i bottoni dopo la generazione della tabella
    enableLinks();

    // Setto nuovamente le select su default
    $("#monthsSelect").prop("selectedIndex", 0);
    $("#yearsSelect").prop("selectedIndex", 0);

    // Mostra il Toast di successo
    showToast("Timesheet caricato con successo!", "bg-success");

    // Aggiungi la funzionalità per modifiche live
    $(document).on("change", ".form-select", function () {
      const row = $(this).closest("tr");
      updateRowColor(row);
    });
  }, 2000);
};

// Funzione per estrarre i dati dalla tabella
export const extractPresenceData = (year, month) => {
  let presenceList = [];

  $("#tableContainer table tbody tr").each(function () {
    const row = $(this);
    const day = row.find("td:first").text().split(" ")[0]; // Estrai il giorno dal primo td
    const workDay = `${year}-${month
      .toString()
      .padStart(2, "0")}-${day.padStart(2, "0")}`;

    const entryTime = row.find("td:eq(1) select").val() + ":00"; // Prendi il valore della select ingresso
    const exitTime = row.find("td:eq(2) select").val() + ":00"; // Prendi il valore della select uscita
    const description = row.find("td:eq(3) input").val() || null; // Prendi il valore dell'input note
    const statusDayEnum = row.find("td:eq(4) select").val(); // Prendi il valore della select stato

    let presenceDto = {
      description: description,
      entryTime: entryTime,
      exitTime: exitTime,
      holiday: statusDayEnum === "HOLIDAY",
      illnessed: statusDayEnum === "ILLNESS",
      smartWorking: statusDayEnum === "SMART_WORKING",
      statusDayEnum: statusDayEnum,
      statusHoursEnum: "NORMAL_WORKING", // Modifica se necessario
      workDay: workDay,
    };

    presenceList.push(presenceDto);
  });

  return presenceList;
};

// Funzione per aggiornare il colore della riga in base ai valori selezionati
const updateRowColor = (row) => {
  const startTime = row.find(".form-select").eq(0).val(); // Orario entrata
  const endTime = row.find(".form-select").eq(1).val(); // Orario uscita
  const status = row.find(".form-select").eq(2).val(); // Stato

  const entryHour = parseInt(startTime.split(":")[0]);
  const exitHour = parseInt(endTime.split(":")[0]);
  const entryMinutes = parseInt(startTime.split(":")[1]);
  const exitMinutes = parseInt(endTime.split(":")[1]);

  const entryTimeInMinutes = entryHour * 60 + entryMinutes;
  const exitTimeInMinutes = exitHour * 60 + exitMinutes;
  const workedMinutes = exitTimeInMinutes - entryTimeInMinutes;
  const workedHours = workedMinutes / 60;

  // Log di debug per vedere i valori
  console.log(`Entry: ${startTime}, Exit: ${endTime}`);
  console.log(
    `Entry Time (in minutes): ${entryTimeInMinutes}, Exit Time (in minutes): ${exitTimeInMinutes}`
  );
  console.log(`Worked Minutes: ${workedMinutes}, Worked Hours: ${workedHours}`);

  if (entryHour === 9) {
    row.css("background-color", "#white"); // Verde chiaro per un giorno lavorativo
  } else if (workedHours > 9) {
    row.css("background-color", "#007bff").css("color", "white"); // Blu per straordinari
  } else if (workedHours >= 4 && workedHours < 8) {
    row.css("background-color", "#ffeb3b"); // Giallo per permesso
  } else if (workedHours < 4 || exitTimeInMinutes <= entryTimeInMinutes) {
    row.css("background-color", "#f44336").css("color", "white"); // Rosso per uscita anomala
  }

  // Log per sabato/domenica
  const date = new Date(row.find("td").first().text());
  if (date.getDay() === 6 || date.getDay() === 0) {
    // Sabato o Domenica
    row.css("background-color", "#f44336").css("color", "white"); // Rosso per sabato/domenica
    console.log("Sabato o Domenica");
  }
};

function showItemsAfterLoadTable() {
  showItem("#generateTimesheet");
  showItem("#colSelectMonth");
  showItem("#colSelectYear");
  showItem("#tableContainer");
  showItem("#buttonLegend");
  showItem("#legendContainer");
  showItem("#saveTimesheet");
}

function hideItemsBeforeLoadTable() {
  hideItem("#generateTimesheet");
  hideItem("#colSelectMonth");
  hideItem("#colSelectYear");
  hideItem("#titleTimesheet");
  hideItem("#tableContainer");
  hideItem("#buttonLegend");
  hideItem("#legendContainer");
  hideItem("#saveTimesheet");
}
