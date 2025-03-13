import { ajaxCall } from "./base-service.js";
import { Constant } from "../utils/constant.js";

export class UserService {
  constructor() {}

  // Funzione login con token opzionale usando async/await
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
        console.log("Login riuscito, token salvato.");
        return response;
      } else {
        throw new Error("Token non ricevuto.");
      }
    } catch (error) {
      // Gestisci errori di rete, server o altre eccezioni
      console.error("Errore nel login:", error);
      return null; // Restituisce null in caso di errore
    }
  }

  // Funzione per verificare la validità del token
  async verifyToken(token) {
    const verifyUrl = Constant.API_URL + "/user/verify"; // Endpoint per la verifica

    try {
      // Chiamata AJAX per verificare il token con il metodo POST e il token nell'header Authorization
      const response = await ajaxCall(verifyUrl, "POST", null, token);
      console.log(response);

      if (response) {
        console.log("Token valido.");
        return true;
      } else {
        console.log("Token non valido.");
        return false;
      }
    } catch (error) {
      console.error("Errore nella verifica del token:", error);
      return false; // Restituisce false in caso di errore
    }
  }
}

// Esportazione predefinita della classe
export default new UserService();
