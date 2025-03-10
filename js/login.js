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

  $("#generateTimesheet").click(function () {
    $("#loader-middle").show();
    $("#generateTimesheet").hide();
    setTimeout(() => {
      var tableContainer = $("#tableContainer");
      tableContainer.empty(); // Pulisce eventuali dati precedenti

      var year = 2025,
        month = 0; // Gennaio (mese parte da 0)
      var daysInMonth = new Date(year, month + 1, 0).getDate(); // Ottieni giorni del mese

      // Crea la tabella
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

      for (var day = 1; day <= daysInMonth; day++) {
        var dateString = `${day.toString().padStart(2, "0")}/01/2025`;

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

        // Colonna Note (ora con larghezza maggiore)
        var noteInput = $("<input>")
          .attr("type", "text")
          .addClass("note-input"); // Aggiunto il class per le note
        row.append($("<td>").append(noteInput));

        // Colonna Stato (con valore di default "lavorativo")
        var statusSelect = $("<select>").addClass("status-select");
        statusSelect.append($("<option>").val("lavorativo").text("Lavorativo"));
        statusSelect.append($("<option>").val("ferie").text("Ferie"));
        statusSelect.append($("<option>").val("malattia").text("Malattia"));
        row.append($("<td>").append(statusSelect));

        tbody.append(row);
      }

      table.append(tbody);
      var scrollableTable = $("<div>")
        .addClass("scrollable-table")
        .append(table);
      tableContainer.append(scrollableTable);

      // Disabilita il pulsante per evitare rigenerazioni multiple
      $("#generateTimesheet").show();
      $("#generateTimesheet").prop("disabled", true);
      $("#loader-middle").hide();
    }, 5000);
  });

  $("#home").click(function () {
    $("#containerGenerateTimesheet").hide();
  });
});
