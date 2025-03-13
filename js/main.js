import { hideItem, showItem, isEmpty } from "./utils/utils.js";
import { generateTimesheet } from "./utils/table-utils.js";
import userService from "./service/user-service.js";

// SETTO IL TIMEOUT PER RITARDARE IL CARICAMENTO
setTimeout(() => {
  hideItem("#loader");
  showItem("#content");
}, 2000);

$(document).ready(function () {
  // Gestione del click sul pulsante di login
  $("#loginBtn").click(async function (event) {
    event.preventDefault(); // Prevenire il comportamento di default del form

    // Ottieni i valori dai campi di login
    const email = $("#email").val();
    const password = $("#password").val();

    // Mostra il loader e nasconde il form di login
    showItem("#loader");
    hideItem("#loginCard");

    try {
      // Effettua la chiamata al login usando async/await
      const result = await userService.login(email, password); // Usa userService.login, passandogli l'email e la password

      console.log(result);

      // Se il login è riuscito
      if (result.token) {
        // Mostra il menu hamburger e la sidebar dopo il login riuscito
        setTimeout(() => {
          $("#nav-icon").show().addClass("open");
          $("#sidebar").addClass("active").show();

          // Nascondi il loader
          hideItem("#loader");
        }, 2000);
      } else {
        // Se il login fallisce, mostra un messaggio di errore
        alert(result.message);
        // Nascondi il loader e mostra di nuovo il form di login
        hideItem("#loader");
        showItem("#loginCard");
      }
    } catch (error) {
      // Gestisci eventuali errori della chiamata AJAX
      console.error("Errore nel login:", error);
      alert("Si è verificato un errore nel login");
      hideItem("#loader");
      showItem("#loginCard");
    }
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

function login() {
  var username = $("#username").val(); // Assumiamo che ci sia un input con id 'username'
  var password = $("#password").val(); // Assumiamo che ci sia un input con id 'password'

  var data = {
    username: username,
    password: password,
  };

  // Chiamata AJAX per il login
  chiamataAjax(
    "https://tuo-backend.com/api/login", // URL del login
    "POST", // Metodo POST per il login
    data, // Dati da inviare
    null, // Nessun token per la chiamata di login
    function (response) {
      // Successo del login, salva il token
      localStorage.setItem("authToken", response.token);
      console.log("Login riuscito, token:", response.token);

      // Dopo il login, possiamo fare altre chiamate protette
      chiamataApiProtetta();
    },
    function (xhr, status, error) {
      console.log("Errore nel login:", error);
    }
  );
}
