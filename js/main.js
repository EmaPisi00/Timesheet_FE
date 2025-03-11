import { hideItem, showItem, isEmpty } from "./utils/utils.js";
import { generateTimesheet } from "./utils/tableUtils.js";
import { ajaxCall } from "./service/base-service.js";

// SETTO IL TIMEOUT PER RITARDARE IL CARICAMENTO
setTimeout(() => {
  hideItem("#loader");
  showItem("#content");
}, 2000);

$(document).ready(function () {
  // Gestione del click sul pulsante di login
  $("#loginBtn").click(function (event) {
    event.preventDefault(); // Prevenire il comportamento di default del form

    // Mostra il loader e nasconde il form di login
    showItem("#loader");
    hideItem("#loginCard");

    // Usa setTimeout per fare le modifiche dopo 2 secondi
    setTimeout(() => {
      // Mostra il menu hamburger e la sidebar
      $("#nav-icon").show().addClass("open");
      $("#sidebar").addClass("active").show();

      // Nascondi il loader
      hideItem("#loader");
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

  $("#timesheet").click(function () {
    $("#containerGenerateTimesheet").show();
  });

  // Controlla la selezione al click del pulsante
  $("#generateTimesheet").click(function () {
    // Ottieni i valori selezionati per mese e anno
    var month = parseInt($("#monthsSelect").val(), 10);
    var year = parseInt($("#yearsSelect").val(), 10);

    var isValid = true;

    // Controlla se il mese selezionato è valido
    if (isEmpty(month) || isNaN(month)) {
      isValid = false;
      showItem("#monthError"); // Mostra errore mese
    } else {
      hideItem("#monthError"); // Nascondi errore mese
    }

    // Controlla se l'anno selezionato è valido
    if (isEmpty(year) || isNaN(year)) {
      isValid = false;
      showItem("#yearError"); // Mostra errore anno
    } else {
      hideItem("#yearError"); // Nascondi errore anno
    }

    // Se tutto è valido, genera il timesheet
    if (isValid) {
      generateTimesheet(year, month);
    }
  });

  // Controlla e nasconde gli errori quando l'utente cambia selezione
  $("#monthsSelect, #yearsSelect").change(function () {
    var month = parseInt($("#monthsSelect").val(), 10); // Mese come numero (0-11)
    var year = parseInt($("#yearsSelect").val(), 10);

    // Nascondi gli errori ogni volta che l'utente cambia selezione
    if (!isEmpty(month) && !isNaN(month)) {
      hideItem("#monthError");
    }
    if (!isEmpty(year) && !isNaN(year)) {
      hideItem("#yearError");
    }
  });

  $("#home").click(function () {
    hideItem("#containerGenerateTimesheet");
  });

  $("#showTimesheet").click(function () {
    hideItem("#containerGenerateTimesheet");
  });
});

$(document).ready(function () {
  $('#load').click(function () {
    $.ajax({
      method: "GET",
      url: "http://localhost:8080/api/v1/user",  // URL dell'API
      success: function(response) {
        console.log(response); // Visualizza la risposta in console
        $('#dati-file').html(JSON.stringify(response, null, 2)); // Mostra la risposta in formato leggibile
      },
      error: function(xhr, status, error) {
        console.error("Errore:", error);
        alert("Errore durante la richiesta.");
      }
    });
  });
});
