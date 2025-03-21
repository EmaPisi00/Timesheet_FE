import userService from "../../service/user-service.js";
import { hideItem, showItem } from "../../utils/utils.js";

export const checkTime = (
  startTime,
  endTime,
  oneMinuteLeft,
  lastLoggedMinute
) => {
  let currentTime = Date.now();
  let timeLeft = endTime - currentTime;

  // Convertiamo il tempo rimanente in secondi e minuti
  let secondsLeft = Math.floor(timeLeft / 1000);
  let minutesLeft = Math.ceil(secondsLeft / 60);

  // Log ogni minuto
  if (minutesLeft < lastLoggedMinute) {
    console.log(`Mancano ${minutesLeft} minuti`);
    lastLoggedMinute = minutesLeft;
  }

  // Se manca meno di un minuto, attiva i listener per le interazioni
  if (secondsLeft <= 60 && !oneMinuteLeft) {
    console.log("Meno di 1 minuto rimasto!");
    oneMinuteLeft = true;

    // Aggiungi listener per le interazioni utente
    $(document).on(
      "mousemove click keydown touchstart",
      function userInteractionHandler() {
        console.log("L'utente ha interagito con la pagina!");
        $(document).off(
          "mousemove click keydown touchstart",
          userInteractionHandler
        );
      }
    );
  }

  if (timeLeft > 0) {
    setTimeout(
      () => checkTime(startTime, endTime, oneMinuteLeft, lastLoggedMinute),
      1000
    );
  } else {
    console.log("Tempo scaduto!");
  }
};

const userInteractionHandler = () => {
  userService.attemptTokenRefresh();
  $(document).off("mousemove click keydown touchstart", userInteractionHandler);
};

// Funzione che richiama il metodo di verifica del token
export async function checkToken() {
  try {
    return await userService.verifyToken();
  } catch (error) {
    console.error("Errore durante la verifica del token:", error);
    return false;
  }
}

// Funzione di login
export async function login(email, password) {
  try {
    showItem("#loader");
    hideItem("#loginCard");

    const result = await userService.login(email, password);

    if (result) {
      const userProfile = await userService.getUserProfile();
      sessionStorage.setItem("profile", JSON.stringify(userProfile));
      sessionStorage.setItem("startTime", Date.now());
      return true;
    } else {
      hideItem("#loader");
      showItem("#loginCard");
      showItem("#loginError");
      return false;
    }
  } catch (error) {
    console.error("Errore nel login:", error);
    showItem("#loginError");
    hideItem("#loader");
    showItem("#loginCard");
    return false;
  }
}
