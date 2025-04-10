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
import { setupUseraArea } from "./implements/profile/user-area.js";

// SETTO IL TIMEOUT PER IL LOADER
setTimeout(() => {
  hideItem("#loadingSpinner");
  showItem("#mainContent");
}, 2000);

$(document).ready(async function () {
  $('[data-bs-toggle="tooltip"]').tooltip(); // Inizializza tutti i tooltips

  // Previene la chiusura automatica del dropdown quando si clicca all'interno
  $(".dropdown-menu-user").click(function (event) {
    event.stopPropagation();
  });

  // Setup della UI
  setupUI();

  // Controllo se l'utente è loggato altrimenti mostro la pagina di login
  if (await checkToken()) {
    showAuthenticatedUI();
    setupTimesheet();
  } else {
    $("#loginBtn").click(async function (event) {
      event.preventDefault();
      const email = $("#email").val();
      const password = $("#password").val();

      // Se l'autenticazione va a buon carico tutta la UI
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

  setupAdminaArea();
  setupUseraArea();
});
