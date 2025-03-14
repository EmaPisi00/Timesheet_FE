import { hideItem, showItem, isEmpty } from "./utils/utils.js";
import { generateTimesheet } from "./utils/table-utils.js";
import userService from "./service/user-service.js";

// SETTO IL TIMEOUT PER RITARDARE IL CARICAMENTO
setTimeout(() => {
  hideItem("#loader");
  showItem("#content");
}, 2000);

// Variabile per tenere traccia dell'ID del timer
let inactivityTimeout;
let refreshCheckTimeout; // Timeout per controllare ogni minuto
let lastTokenRefreshTime = 0; // Tiene traccia dell'ultimo rinnovo del token

// Funzione per rinnovare il token
async function handleTokenRefresh() {
  const refreshTokenValue = localStorage.getItem("authToken"); // Recupero il refresh token
  
  if (refreshTokenValue) {
    try {
      const newToken = await userService.refreshToken(refreshTokenValue); // Rinnovo del token
      console.log("Nuovo token:", newToken);
      
      if (newToken) {
        // Salva il nuovo token nel localStorage per l'uso futuro
        localStorage.setItem("authToken", newToken);
        lastTokenRefreshTime = Date.now(); // Registra l'ora dell'ultimo rinnovo
      }
    } catch (error) {
      console.error("Errore durante il rinnovo del token:", error);
    }
  } else {
    console.log("Nessun refresh token trovato.");
  }
}

// Funzione per gestire l'inattività dell'utente
function resetInactivityTimer() {
  // Se c'era già un timer di inattività, lo cancella
  clearTimeout(inactivityTimeout);

  // Avvia un nuovo timer di inattività che eseguirà l'azione dopo 10 minuti di inattività
  inactivityTimeout = setTimeout(() => {
    console.log("L'utente è inattivo da un po', non rinnovo il token.");
  }, 60 * 1000); // Imposta un timeout di 10 minuti (600000 ms) per inattività
}

// Funzione per controllare periodicamente se il token deve essere rinnovato
function startPeriodicTokenCheck() {
  // Esegui il controllo ogni minuto (60.000 ms)
  refreshCheckTimeout = setInterval(() => {
    // Verifica se è passato più di un minuto dal precedente rinnovo del token
    const currentTime = Date.now();
    if (currentTime - lastTokenRefreshTime > 60 * 1000) { // Se è passato più di 1 minuto dal rinnovo
      console.log("Controllo periodico del rinnovo del token...");

      const lastInteractionTime = localStorage.getItem("lastInteractionTime");
      if (lastInteractionTime) {
        const timeDiff = currentTime - lastInteractionTime;

        // Se l'utente è inattivo da più di 10 minuti, rinnova il token
        if (timeDiff > 60 * 1000) {
          console.log("Utente inattivo da più di 10 minuti, rinnovo del token.");
          handleTokenRefresh();
        }
      }
    }
  }, 60 * 1000); // Controlla ogni minuto
}

async function checkToken(token) {
  try {
    var result = await userService.verifyToken(token); // Aspetta che la Promise si risolva
    return result; // Qui avrai il valore booleano true o false
  } catch (error) {
    console.error("Errore durante la verifica del token:", error);
  }
}

$(document).ready(async function () {
  $(document).on("click mousemove keydown", function () {

    // Resetta il timer di inattività
    resetInactivityTimer();

    // Aggiorna l'ultima interazione nel localStorage per il controllo periodico
    localStorage.setItem("lastInteractionTime", Date.now());
  });

  // Avvia il timer di inattività
  resetInactivityTimer();

  // Avvia il controllo periodico del rinnovo del token
  startPeriodicTokenCheck();

  // Recupero il token dalla sessione
  const token = localStorage.getItem("authToken");
  var verifyToken = await checkToken(token);

  // Se il token è valido allora eseguo direttamente il login
  if (verifyToken) {
    hideItem("#loginCard");
    setTimeout(async () => {
      $("#nav-icon").show().addClass("open");
      $("#sidebar").addClass("active").show();

      // Nascondi il loader
      hideItem("#loader");
      hideItem("#loadError");

      const userProfile = await userService.getUserProfile(token);
      console.log(userProfile);
    }, 2000);
  } else {
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
        const result = await userService.login(email, password);

        // Se il login va a buon fine
        if (!isEmpty(result)) {
          setTimeout(async () => {
            $("#nav-icon").show().addClass("open");
            $("#sidebar").addClass("active").show();

            // Nascondi il loader
            hideItem("#loader");
            hideItem("#loadError");

            const userProfile = await userService.getUserProfile(result);
            console.log(userProfile);
          }, 2000);
        } else {
          // Se il login fallisce
          // Nascondi il loader e mostra di nuovo il form di login
          hideItem("#loader");
          showItem("#loginCard");
          showItem("#loginError");
        }
      } catch (error) {
        // Gestisci eventuali errori della chiamata AJAX
        console.error("Errore nel login:", error);
        showItem("#loginError");
        hideItem("#loader");
        showItem("#loginCard");
      }
    });
  }

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
