import { hideItem, showItem, disableLinks, enableLinks } from "./utils.js";

import { getMonthName } from "./dateUtils.js";

export const generateTimesheet = (year, month) => {
  // Mostra il loader
  showItem("#loader-middle");

  // nasconde il pulsante "Genera"
  hideItem("#generateTimesheet");
  hideItem("#colSelectMonth");
  hideItem("#colSelectYear");

  // DISABILITO I LINK O PULSANTI
  disableLinks();

  // INSERISCO TUTTO IN TIMEOUT PER RITARDARE LA GENERAZIONE DEL TIMESHEET
  setTimeout(() => {
    // Svuota e rimuovi eventuali tabelle precedenti
    var tableContainer = $("#tableContainer");
    tableContainer.empty(); // Pulisce qualsiasi tabella esistente

    // Determina il numero di giorni nel mese
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    // Crea la tabella nuova
    var table = $("<table>").addClass("table table-bordered");
    var thead = $("<thead>");
    var headerRow = $("<tr>");
    headerRow.append("<th>Giorno</th>");
    headerRow.append("<th>Orario Entrata</th>");
    headerRow.append("<th>Orario Uscita</th>");
    headerRow.append("<th>Note</th>");
    headerRow.append("<th>Stato</th>");
    thead.append(headerRow);
    table.append(thead);

    var tbody = $("<tbody>");

    // Ciclo per generare una riga per ogni giorno del mese
    for (var day = 1; day <= daysInMonth; day++) {
      var dateString = `${day.toString().padStart(2, "0")}/${(month + 1)
        .toString()
        .padStart(2, "0")}/${year}`;

      var row = $("<tr>");

      // Colonna Giorno
      row.append("<td>" + dateString + "</td>");

      // Colonna Orario Entrata
      var startTimeSelect = $("<select>");
      for (var h = 0; h < 24; h++) {
        var hour = h.toString().padStart(2, "0") + ":00";
        startTimeSelect.append($("<option>").val(hour).text(hour));
      }
      row.append($("<td>").append(startTimeSelect));

      // Colonna Orario Uscita
      var endTimeSelect = $("<select>");
      for (var h = 0; h < 24; h++) {
        var hour = h.toString().padStart(2, "0") + ":00";
        endTimeSelect.append($("<option>").val(hour).text(hour));
      }
      row.append($("<td>").append(endTimeSelect));

      // Colonna Note
      var noteInput = $("<input>").attr("type", "text").addClass("note-input");
      row.append($("<td>").append(noteInput));

      // Colonna Stato
      var statusSelect = $("<select>").addClass("status-select");
      statusSelect.append($("<option>").val("lavorativo").text("Lavorativo"));
      statusSelect.append($("<option>").val("ferie").text("Ferie"));
      statusSelect.append($("<option>").val("malattia").text("Malattia"));
      row.append($("<td>").append(statusSelect));

      tbody.append(row);
    }

    // METTO IN APPEND IL "TBODY" APPENA CREATO DINAMICAMENTE
    table.append(tbody);

    // Crea un div scrollabile per la tabella
    var scrollableTable = $("<div>")
      .addClass("scrollable-table") // Aggiunto mt-4 per margine superiore
      .append(table);

    // Aggiungi la tabella scrollabile al container
    tableContainer.append(scrollableTable);

    // Riabilita il pulsante di generazione del timesheet
    showItem("#generateTimesheet");
    showItem("#colSelectMonth");
    showItem("#colSelectYear");

    // MOSTRO IL TITOLO DELLA PAGINA CON MESE + ANNO
    showItem("#titleTimesheet");
    $("#titleTimesheet").append(
      "Timesheet Mese di " + getMonthName(month) + " " + year
    );

    // NASCONDO IL LOADER MOSTRATO AL CENTRO DELLA PAGINA
    hideItem("#loader-middle");

    // METTO UN MARGIN-TOP SU UN DIV CHE CONTIENE LE SELECT DI ANNO E MESE E DEL BUTTON
    $("#containerTitleSelect").css("margin-top", "5%");

    // RIABILITO I BUTTON DOPO CHE SI E' GENERATA LA TABELLA
    enableLinks();
  }, 5000); // Timeout di 5 secondi
};
