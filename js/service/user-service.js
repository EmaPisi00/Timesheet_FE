import { ajaxCall } from "./base-service.js";
import { Constant } from "../utils/constant.js";

class UserService {
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
        return response; // Restituisce l'oggetto della risposta
      } else {
        throw new Error("Token non ricevuto.");
      }
    } catch (error) {
      // Gestisci errori di rete, server o altre eccezioni
      console.error("Errore nel login:", error);
      return null; // Restituisce null in caso di errore
    }
  }
}

export default new UserService();
