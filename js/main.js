// Import moduli separati
import { hideItem, showItem, generateSecurePassword } from "./utils/utils.js";
import { checkToken, login, logout } from "./implements/auth/auth.js";
import { setupUI, showAuthenticatedUI } from "./implements/ui/ui.js";
import { setupTimesheet } from "./implements/timesheet/timesheet.js";

// SETTO IL TIMEOUT PER IL LOADER
setTimeout(() => {
  hideItem("#loadingSpinner");
  showItem("#mainContent");
}, 2000);

$(document).ready(async function () {
  $('[data-bs-toggle="tooltip"]').tooltip(); // Inizializza tutti i tooltips
  setupUI();

  if (await checkToken()) {
    showAuthenticatedUI();
    setupTimesheet();
  } else {
    $("#loginBtn").click(async function (event) {
      event.preventDefault();
      const email = $("#email").val();
      const password = $("#password").val();

      if (await login(email, password)) {
        showAuthenticatedUI();
        setupTimesheet();
      }
    });
  }

  // Operazione di logout
  $("#logout").click(() => {
    logout();
  });

  // Area Utente
  $("#userArea").click(() => {});

  // Area Admin
  $("#adminArea").click(() => {
    hideItem("#containerGenerateTimesheet");
    hideItem("#showTimesheet");
    showItem("#containerAdminArea");

    // Aggiungi l'evento al bottone per generare la password
    $("#generatePassword").click(function () {
      const securePassword = generateSecurePassword(16); // lunghezza della password sicura
      $("#passwordRegister").val(securePassword); // Mostra la password nel campo di input
    });

    $("#registrationForm").submit(function (e) {
      e.preventDefault();

      const email = $("#emailRegister").val();
      const password = $("#passwordRegister").val();

      if (email && password) {
        // Nascondi il primo form e mostra il secondo form
        $("#registrationForm").hide();
        $("#secondForm").show();
      } else {
        alert("Per favore, inserisci tutti i dati correttamente.");
      }
    });

    // Gestione del secondo form (Nome e Cognome)
    $("#completeRegistrationForm").submit(function (e) {
      e.preventDefault();

      const firstName = $("#firstName").val();
      const lastName = $("#lastName").val();

      if (firstName && lastName) {
        // Invia i dati o esegui ulteriori operazioni
        alert(
          `Registrazione completata!\nNome: ${firstName}\nCognome: ${lastName}`
        );
      } else {
        alert("Per favore, inserisci correttamente nome e cognome.");
      }
    });
  });

  // Previene la chiusura automatica del dropdown quando si clicca all'interno
  $(".dropdown-menu-user").click(function (event) {
    event.stopPropagation();
  });
});
