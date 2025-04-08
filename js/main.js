// Import moduli separati
import {
  hideItem,
  showItem,
  generateSecurePassword,
  isEmpty,
} from "./utils/utils.js";
import {
  checkToken,
  getProfile,
  login,
  logout,
} from "./implements/auth/auth.js";
import { setupUI, showAuthenticatedUI } from "./implements/ui/ui.js";
import { setupTimesheet } from "./implements/timesheet/timesheet.js";
import {
  setupAdminaArea,
  registerEmployee,
} from "./implements/profile/admin-area.js";

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
  $("#adminArea").click(async () => {
    hideItem("#containerGenerateTimesheet");
    hideItem("#showTimesheet");
    showItem("#containerAdminArea");

    // Aggiungi l'evento al bottone per generare la password
    $("#generatePassword").click(function () {
      const securePassword = generateSecurePassword(16); // lunghezza della password sicura
      $("#passwordRegister").val(securePassword); // Mostra la password nel campo di input
    });

    setupAdminaArea();

    $("#registerEmployee").click(() => {
      // Chiamata all'API per registrare un nuovo dipendente
      registerEmployee();
    });
  });

  // Previene la chiusura automatica del dropdown quando si clicca all'interno
  $(".dropdown-menu-user").click(function (event) {
    event.stopPropagation();
  });
});
