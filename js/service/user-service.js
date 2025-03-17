import { ajaxCall } from "./base-service.js";
import { Constant } from "../utils/constant.js";
import { isEmpty } from "../utils/utils.js";

export class UserService {
  constructor() {}

  // Metodo login con token opzionale usando async/await
  async login(email, password) {
    const loginUrl = Constant.API_URL + "/user/login";
    const data = {
      email: email,
      password: password,
    };

    try {
      // Chiamata AJAX usando async/await
      const response = await ajaxCall(loginUrl, "POST", data, null);

      // Successo del login, salva il token
      if (response && response.token) {
        localStorage.setItem("authToken", response.token);
        console.log("Login riuscito, token salvato!");
        return response.token;
      } else {
        throw new Error("Token non ricevuto.");
      }
    } catch (error) {
      // Gestisci errori di rete, server o altre eccezioni
      console.error("Errore nel login:", error);
      window.location.href = "/pages/main.html"; // Reindirizza alla pagina di login
      return null;
    }
  }

  // Metodo per verificare la validità del token
  async verifyToken(token) {
    if (localStorage.getItem("redirected")) {
      localStorage.removeItem("redirected");
      return false;
    }

    const verifyUrl = Constant.API_URL + "/user/verify";

    try {
      const response = await ajaxCall(verifyUrl, "POST", null, token);
      localStorage.removeItem("redirected"); // Se il token è valido, rimuovi il flag
      return response;
    } catch (error) {
      console.error("Verifica token fallita:", error);
      localStorage.setItem("redirected", "true");
      window.location.href = "/pages/main.html";
      return false;
    }
  }

  // Funzione per recuperare i dati dell'utente
  async getUserProfile() {

    if (localStorage.getItem("redirected")) {
      localStorage.removeItem("redirected");
      return false;
    }


    const verifyUrl = Constant.API_URL + "/user/getProfile"; // Endpoint per la verifica
    const token = sessionStorage.getItem("authToken");

    if (!isEmpty(token)) {
      try {
        // Chiamata AJAX per verificare il token con il metodo POST e il token nell'header Authorization
        const response = await ajaxCall(verifyUrl, "GET", null, token);
        console.log(response);

        if (response) {
          console.log("Token valido, informazioni utente");
          return response;
        } else {
          console.log("Token non valido.");
          return null;
        }
      } catch (error) {
        console.error("Verifica token fallita:", error);
        localStorage.setItem("redirected", "true");
        window.location.href = "/pages/main.html";
        return null;
      }
    }
  }

  async refreshToken(refreshToken) {
    const refreshUrl = Constant.API_URL + "/user/refreshToken";

    try {
      const response = await ajaxCall(refreshUrl, "POST", null, refreshToken);
      return response.token;
    } catch (error) {
      console.error("Errore durante il rinnovo del token:", error);
      return null; // Ritorna null in caso di errore
    }
  }
}

// Esportazione predefinita della classe
export default new UserService();
