import { hideItem, showItem, disableLinks, enableLinks } from "./utils.js";
import { getMonthName } from "./dateUtils.js";

export const generateTimesheet = (year, month) => {
  // Mostra il loader
  showItem("#loader-middle");

  // Nasconde il pulsante "Genera" e le select
  hideItem("#generateTimesheet");
  hideItem("#colSelectMonth");
  hideItem("#colSelectYear");

  // Disabilito i link o pulsanti
  disableLinks();

  // INSERISCO UN TIMEOUT PER SIMULARE UN RITARDO DI GENERAZIONE
  setTimeout(() => {
    const tableContainer = $("#tableContainer");
    tableContainer.empty(); // Pulisce qualsiasi tabella esistente

    // Determina il numero di giorni nel mese
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Creazione della tabella con classi Bootstrap
    const table = $("<table>").addClass(
      "table table-bordered table-striped table-hover"
    );

    const thead = $("<thead>").addClass("table-primary text-center");
    const headerRow = $("<tr>");
    headerRow.append("<th>Giorno</th>");
    headerRow.append("<th>Orario Entrata</th>");
    headerRow.append("<th>Orario Uscita</th>");
    headerRow.append("<th>Note</th>");
    headerRow.append("<th>Stato</th>");
    thead.append(headerRow);
    table.append(thead);

    const tbody = $("<tbody>");

    // Ciclo per generare una riga per ogni giorno del mese
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${day.toString().padStart(2, "0")}/${(month + 1)
        .toString()
        .padStart(2, "0")}/${year}`;

      const row = $("<tr>").addClass("text-center align-middle");

      // Colonna Giorno
      row.append(`<td><strong>${dateString}</strong></td>`);

      // Colonna Orario Entrata
      const startTimeSelect = $("<select>").addClass("form-select");
      for (let h = 0; h < 24; h++) {
        const hour = `${h.toString().padStart(2, "0")}:00`;
        startTimeSelect.append($("<option>").val(hour).text(hour));
      }
      row.append($("<td>").append(startTimeSelect));

      // Colonna Orario Uscita
      const endTimeSelect = $("<select>").addClass("form-select");
      for (let h = 0; h < 24; h++) {
        const hour = `${h.toString().padStart(2, "0")}:00`;
        endTimeSelect.append($("<option>").val(hour).text(hour));
      }
      row.append($("<td>").append(endTimeSelect));

      // Colonna Note
      const noteInput = $("<input>")
        .attr("type", "text")
        .addClass("form-control note-input")
        .attr("placeholder", "Aggiungi una nota...");
      row.append($("<td>").append(noteInput));

      // Colonna Stato
      const statusSelect = $("<select>").addClass("form-select status-select");
      statusSelect.append($("<option>").val("lavorativo").text("Lavorativo"));
      statusSelect.append($("<option>").val("ferie").text("Ferie"));
      statusSelect.append($("<option>").val("malattia").text("Malattia"));
      row.append($("<td>").append(statusSelect));

      tbody.append(row);
    }

    // Append il tbody alla tabella
    table.append(tbody);

    // Div scrollabile per la tabella con Bootstrap
    const scrollableTable = $("<div>")
      .addClass("scrollable-table mt-4 border rounded p-3 bg-light shadow-sm")
      .append(table);

    // Aggiungi la tabella al container
    tableContainer.append(scrollableTable);

    // Riabilita i pulsanti e mostra il titolo
    showItem("#generateTimesheet");
    showItem("#colSelectMonth");
    showItem("#colSelectYear");

    // Mostro il titolo del timesheet con mese + anno
    $("#titleTimesheet")
      .text(`Timesheet Mese di ${getMonthName(month)} ${year}`)
      .show();

    // Nascondo il loader
    hideItem("#loader-middle");

    // Aggiungo margine-top per evitare che il titolo venga spinto troppo in alto
    $("#containerTitleSelect").css("margin-top", "5%");

    // Riabilito i bottoni dopo la generazione della tabella
    enableLinks();
  }, 2000); // Timeout ridotto a 2 secondi per velocizzare il test
};
