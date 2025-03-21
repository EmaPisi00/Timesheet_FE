import userService from "../../service/user-service.js";
import { hideItem, isEmpty, showItem } from "../../utils/utils.js";

// Variabile per tenere traccia dell'ID del timer
let inactivityTimeout;

// Timeout per controllare ogni minuto
let refreshCheckTimeout;

// Tiene traccia dell'ultimo rinnovo del token
let lastTokenRefreshTime = 0;

// Funzione per rinnovare il token
async function handleTokenRefresh() {
  // Recupero il token
  const refreshTokenValue = sessionStorage.getItem("authToken");

  if (refreshTokenValue) {
    try {
      // Richiamo l'API per refreshare il token
      const newToken = await userService.refreshToken(refreshTokenValue);
      console.log("Nuovo token:", newToken);

      if (newToken) {
        // Salva il nuovo token nel sessionStorage per l'uso futuro
        sessionStorage.setItem("authToken", newToken);

        // Registra l'ora dell'ultimo rinnovo
        lastTokenRefreshTime = Date.now();
      }
    } catch (error) {
      console.error("Errore durante il rinnovo del token:", error);
    }
  } else {
    console.log("Nessun refresh token trovato.");
  }
}

// Funzione per gestire l'inattività dell'utente
export function resetInactivityTimer() {
  clearTimeout(inactivityTimeout);

  inactivityTimeout = setTimeout(() => {
    console.log("Utente disconnesso per inattività.");
    sessionStorage.removeItem("authToken"); // Rimuove il token di autenticazione
    window.location.href = "/pages/main.html"; // Reindirizza alla pagina di login
  }, 60 * 1000 * 10);
}

// Funzione per controllare periodicamente se il token deve essere rinnovato
export function startPeriodicTokenCheck() {
  // Esegui il controllo ogni minuto (60.000 ms)
  refreshCheckTimeout = setInterval(() => {
    // Verifica se è passato più di un minuto dal precedente rinnovo del token
    const currentTime = Date.now();
    if (currentTime - lastTokenRefreshTime > 60 * 1000) {
      // Se è passato più di 1 minuto dal rinnovo
      console.log("Controllo periodico del rinnovo del token...");

      const lastInteractionTime = sessionStorage.getItem("lastInteractionTime");
      if (lastInteractionTime) {
        const timeDiff = currentTime - lastInteractionTime;

        // Se l'utente è inattivo da più di 10 minuti, rinnova il token
        if (timeDiff > 60 * 1000 * 10) {
          console.log(
            "Utente inattivo da più di 10 minuti, rinnovo del token."
          );
          handleTokenRefresh();
        }
      }
    }
  }, 60 * 1000); // Controlla ogni minuto
}

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
