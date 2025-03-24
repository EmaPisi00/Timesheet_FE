// Import moduli separati
import { hideItem, showItem } from "./utils/utils.js";
import { checkToken, login, logout } from "./implements/auth/auth.js";
import { setupUI, showAuthenticatedUI } from "./implements/ui/ui.js";
import { setupTimesheet } from "./implements/timesheet/timesheet.js";

// SETTO IL TIMEOUT PER IL LOADER
setTimeout(() => {
  hideItem("#loaderSpinner");
  showItem("#mainContent");
}, 2000);

$(document).ready(async function () {
  $('[data-bs-toggle="tooltip"]').tooltip(); // Inizializza tutti i tooltips
  setupUI();

  if (await checkToken()) {
    showAuthenticatedUI();
    setupTimesheet();
  } else {
    $("#loginButton").click(async function (event) {
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

$(document).ready(function () {
  $("#generateProfile").click(function () {
    var fullName = "Mario Rossi";

    var words = fullName.split(" ");
    var initials =
      words.length > 1
        ? words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase()
        : words[0].charAt(0).toUpperCase();

    $("#profileImage").text(initials);
  });
});
