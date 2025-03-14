import userService from "./service/user-service.js";
import { hideItem, showItem } from "./utils/utils.js";

// Variabile per tenere traccia dell'ID del timer
let inactivityTimeout;

// Timeout per controllare ogni minuto
let refreshCheckTimeout;

// Tiene traccia dell'ultimo rinnovo del token
let lastTokenRefreshTime = 0;

// Funzione per rinnovare il token
async function handleTokenRefresh() {

  // Recupero il token
  const refreshTokenValue = localStorage.getItem("authToken"); 

  if (refreshTokenValue) {
    try {
      // Richiamo l'API per refreshare il token
      const newToken = await userService.refreshToken(refreshTokenValue);
      console.log("Nuovo token:", newToken);

      if (newToken) {
        // Salva il nuovo token nel localStorage per l'uso futuro
        localStorage.setItem("authToken", newToken);

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

  // Se c'era già un timer di inattività, lo cancella
  clearTimeout(inactivityTimeout);

  // Avvia un nuovo timer di inattività che eseguirà l'azione dopo 10 minuti di inattività
  inactivityTimeout = setTimeout(() => {
    console.log("L'utente è inattivo da un po', non rinnovo il token.");
  }, 60 * 1000 * 10); // Imposta un timeout di 10 minuti (600000 ms) per inattività
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

      const lastInteractionTime = localStorage.getItem("lastInteractionTime");
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
export async function checkToken(token) {
  try {
    return await userService.verifyToken(token);
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
      sessionStorage.setItem("authToken", result); // Salviamo il token
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
