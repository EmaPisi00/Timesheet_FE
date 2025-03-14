import { ajaxCall } from "./base-service.js";
import { Constant } from "../utils/constant.js";

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
        console.log("Login riuscito, token salvato.       " + response.token);
        return response.token;
      } else {
        throw new Error("Token non ricevuto.");
      }
    } catch (error) {
      // Gestisci errori di rete, server o altre eccezioni
      console.error("Errore nel login:", error);
      return null; 
    }
  }

  // Metodo per verificare la validità del token
  async verifyToken(token) {
    const verifyUrl = Constant.API_URL + "/user/verify"; // Endpoint protetto

    try {
      const response = await ajaxCall(verifyUrl, "POST", null, token);
      return response;
    } catch (error) {
      if (error.status === "403") {
        console.error("Token non valido");
      }
      return false;
    }
  }

  // Funzione per recuperare i dati dell'utente
  async getUserProfile(token) {
    const verifyUrl = Constant.API_URL + "/user/get-profile"; // Endpoint per la verifica

    try {
      // Chiamata AJAX per verificare il token con il metodo POST e il token nell'header Authorization
      const response = await ajaxCall(verifyUrl, "GET", null, token);
      console.log(response);

      if (response) {
        console.log("Toke valido, informazioni utente");
        return response;
      } else {
        console.log("Token non valido.");
        return null;
      }
    } catch (error) {
      console.error("Errore nella verifica del token:", error);
      return null; // Restituisce false in caso di errore
    }
  }

  async refreshToken(refreshToken) {
    const refreshUrl = Constant.API_URL + "/user/refresh-token";
    
    try {
      const response = await ajaxCall(refreshUrl, "POST", null, refreshToken);
      console.log("RESPONSE REFRESH TOKEN :  " + response.token);
      // Verifica la risposta
      if (response && response.token) {  // Supponendo che la risposta contenga un nuovo token (ad esempio, "newToken")
        console.log("Token rinnovato con successo:", response.token);
        return response.token; // Restituisce il nuovo token
      } else {
        console.log("Errore nel rinnovo del token.");
        return null; // Ritorna null se non c'è un nuovo token o se c'è stato un errore
      }
    } catch (error) {
      console.error("Errore durante il rinnovo del token:", error);
      return null; // Ritorna null in caso di errore
    }
  }
  
}

// Esportazione predefinita della classe
export default new UserService();
