// Import moduli separati
import { hideItem, showItem } from "./utils/utils.js";
import {
  checkToken,
  login,
  resetInactivityTimer,
  startPeriodicTokenCheck,
} from "./implements/auth/auth.js";
import { setupUI, showAuthenticatedUI } from "./implements/ui/ui.js";
import { setupTimesheet } from "./implements/timesheet/timesheet.js";

// SETTO IL TIMEOUT PER IL LOADER
setTimeout(() => {
  hideItem("#loader");
  showItem("#content");
}, 2000);

$(document).ready(async function () {
  $('[data-bs-toggle="tooltip"]').tooltip(); // Inizializza tutti i tooltips
  setupUI();
  setupTimesheet();

  // // Gestione attività utente
  // $(document).on("click mousemove keydown", () => {
  //   resetInactivityTimer();
  //   sessionStorage.setItem("lastInteractionTime", Date.now());
  // });

  // resetInactivityTimer();
  // startPeriodicTokenCheck();

  if (await checkToken()) {
    showAuthenticatedUI();
  } else {
    $("#loginBtn").click(async function (event) {
      event.preventDefault();
      const email = $("#email").val();
      const password = $("#password").val();

      if (await login(email, password)) {
        showAuthenticatedUI();
      }
    });
  }
});
