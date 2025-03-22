// Import moduli separati
import { hideItem, showItem } from "./utils/utils.js";
import { checkToken, login, logout } from "./implements/auth/auth.js";
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
});
