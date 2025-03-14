// Import moduli separati
import { hideItem, showItem } from "./utils/utils.js";
import {
  checkToken,
  login,
  resetInactivityTimer,
  startPeriodicTokenCheck,
} from "./auth.js";
import { setupUI, showAuthenticatedUI } from "./ui.js";
import { setupTimesheet } from "./timesheet.js";

// SETTO IL TIMEOUT PER IL LOADER
setTimeout(() => {
  hideItem("#loader");
  showItem("#content");
}, 2000);

$(document).ready(async function () {
  setupUI();
  setupTimesheet();

  // Gestione attività utente
  $(document).on("click mousemove keydown", () => {
    resetInactivityTimer();
    localStorage.setItem("lastInteractionTime", Date.now());
  });

  resetInactivityTimer();
  startPeriodicTokenCheck();

  // Controllo token
  const token = localStorage.getItem("authToken");
  if (await checkToken(token)) {
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
