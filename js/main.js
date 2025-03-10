import { hideItem, showItem } from "./utils/utils.js";
import { generateTimesheet } from "./utils/tableUtils.js";

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

  // Aggiungi evento per generare il timesheet al clic
  $("#generateTimesheet").click(function () {
    var year = 2025; // Puoi sostituirlo con un valore dinamico
    var month = 0; // Gennaio (mese parte da 0)
    generateTimesheet(year, month); // Chiamata alla funzione per generare la tabella
  });

  $("#home").click(function () {
    hideItem("#containerGenerateTimesheet");
  });

  $("#showTimesheet").click(function () {
    hideItem("#containerGenerateTimesheet");
  });
});
