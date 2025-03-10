$(document).ready(function () {
  // Gestione del click sul pulsante di login
  $("#loginBtn").click(function (event) {
    event.preventDefault(); // Prevenire il comportamento di default del form

    // Mostra il loader e nasconde il form di login
    $("#loader").show();
    $("#loginCard").hide();

    // Usa setTimeout per fare le modifiche dopo 2 secondi
    setTimeout(() => {
      // Mostra il menu hamburger e la sidebar
      $("#nav-icon").show().addClass("open");
      $("#sidebar").addClass("active").show();

      // Nascondi il loader
      $("#loader").hide();
    }, 2000);
  });

  // Gestione del click per mostrare/nascondere la password
  $("#eye-icon").click(function () {
    var passwordField = $("#password");
    var eyeIcon = $("#eye-icon");
    if (passwordField.attr("type") === "password") {
      passwordField.attr("type", "text");
      eyeIcon.attr("src", "/assets/images/eye-open.png");
    } else {
      passwordField.attr("type", "password");
      eyeIcon.attr("src", "/assets/images/eye-icon.png");
    }
  });

  // Gestione del click per aprire/chiudere la navbar
  $("#nav-icon").click(function () {
    $(this).toggleClass("open"); // Aggiungi o rimuovi la classe "open"
    $("#sidebar").toggleClass("active"); // Aggiungi o rimuovi la classe "active" per la sidebar
  });

  // Funzione timeout
  setTimeout(() => {
    $(`#loader`).hide(); // Nasconde l'elemento con id hider
    $(`#content`).show(); // Mostra l'elemento con id shower
  }, 2000);

  $("#timesheet").click(function () {
    $("#containerGenerateTimesheet").show();
  });

  // Aggiungi evento per generare il timesheet al clic
  $("#generateTimesheet").click(function () {
    var year = 2025; // Puoi sostituirlo con un valore dinamico
    var month = 0; // Gennaio (mese parte da 0)
    generateTimesheet(year, month); // Chiamata alla funzione per generare la tabella
  });

  $("#home").click(function () {
    $("#containerGenerateTimesheet").hide();
  });

  $("#showTimesheet").click(function () {
    $("#containerGenerateTimesheet").hide();
  });
});

const generateTimesheet = (year, month) => {
  // Mostra il loader e nasconde il pulsante "Genera"
  $("#loader-middle").show();
  $("#generateTimesheet").hide();
  disableLinks(); // Disabilita i pulsanti durante la generazione

  // Aggiungi un timeout per simulare il tempo di generazione (5 secondi in questo caso)
  setTimeout(() => {
    // Svuota e rimuovi eventuali tabelle precedenti
    var tableContainer = $("#tableContainer");
    tableContainer.empty(); // Pulisce qualsiasi tabella esistente

    // Determina il numero di giorni nel mese
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    // Crea la tabella nuova
    var table = $("<table>");
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

    table.append(tbody);
    var scrollableTable = $("<div>").addClass("scrollable-table").append(table);
    tableContainer.append(scrollableTable);

    // Riabilita il pulsante di generazione del timesheet
    $("#generateTimesheet").show();
    $("#generateTimesheet").prop("disabled", false); // Abilita nuovamente il pulsante
    $("#loader-middle").hide(); // Nascondi il loader
    enableLinks(); // Riabilita i link
  }, 5000); // Timeout di 5 secondi
};

// Funzione che disabilita i link e i pulsanti
function disableLinks() {
  // Disabilita tutti i pulsanti e i link
  document.querySelectorAll("a, button").forEach(function (element) {
    element.classList.add("disabled"); // Aggiunge la classe 'disabled'
  });
}

// Funzione che riabilita i link e i pulsanti
function enableLinks() {
  // Abilita tutti i pulsanti e i link
  document.querySelectorAll("a, button").forEach(function (element) {
    element.classList.remove("disabled"); // Rimuove la classe 'disabled'
  });
}
