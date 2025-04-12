import { ajaxCall } from "./base-service.js";
import { Constant } from "../utils/constant.js";
import {
  isEmpty,
  showToast,
  handleUnauthorizedAccess,
} from "../utils/utils.js";

export class UserService {
  constructor() {}

  // Metodo login
  async login(email, password) {
    const loginUrl = Constant.API_URL + "/user/login";
    const data = { email, password };

    try {
      const response = await ajaxCall(loginUrl, "POST", data, null);

      if (response?.token) {
        sessionStorage.setItem("authToken", response.token);
        showToast("Login effettuato con successo!", "success");
        return response.token;
      } else {
        throw new Error("Credenziali non valide o token non ricevuto.");
      }
    } catch (error) {
      console.error("Errore nel login:", error);
      showToast("Accesso non riuscito. Controlla le credenziali.", "bg-danger");
      return null;
    }
  }

  // Metodo per verificare la validità del token
  async verifyToken() {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      handleUnauthorizedAccess();
      return false;
    }

    const verifyUrl = Constant.API_URL + "/user/verify";

    try {
      return await ajaxCall(verifyUrl, "POST", null, token);
    } catch (error) {
      console.error("Verifica token fallita:", error);
      sessionStorage.removeItem("authToken");
      return false;
    }
  }

  // Metodo per ottenere i dati dell'utente
  async getUserProfile() {
    const profileUrl = Constant.API_URL + "/user/getProfile";
    const token = sessionStorage.getItem("authToken");

    if (isEmpty(token)) {
      handleUnauthorizedAccess();
      return null;
    }

    try {
      const response = await ajaxCall(profileUrl, "GET", null, token);
      if (response) {
        return response;
      } else {
        throw new Error("Dati utente non disponibili.");
      }
    } catch (error) {
      console.error("Errore nel recupero del profilo utente:", error);
      showToast("Errore nel caricamento del profilo utente.", "bg-danger");
      sessionStorage.removeItem("authToken");
      return null;
    }
  }

  async logout() {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      handleUnauthorizedAccess();
      return false;
    }

    const logoutUrl = Constant.API_URL + "/user/logout";

    try {
      return await ajaxCall(logoutUrl, "POST", null, token);
    } catch (error) {
      console.error("Verifica token fallita:", error);
      sessionStorage.removeItem("authToken");
      return false;
    }
  }

  async register(employee) {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      handleUnauthorizedAccess();
      return false;
    }

    const registerUrl = Constant.API_URL + "/user/register";

    try {
      const response = await ajaxCall(registerUrl, "POST", employee, token);

      if (!isEmpty(response) && response.code === 400) {
        showToast("Errore! Inserire tutti i campi correttamente", "bg-danger");
        return null;
      }
      if (!isEmpty(response) && response.code === 500) {
        showToast("Errore! E-mail già esistente", "bg-danger");
        return null;
      } else {
        showToast("Utente aggiunto con successo");
        return response;
      }
    } catch (error) {
      console.error("Verifica token fallita:", error);
      sessionStorage.removeItem("authToken");
      return false;
    }
  }

  async deleteUser(uuid) {
    const token = sessionStorage.getItem("authToken");

    if (!isEmpty(token)) {
      // Costruisce l'URL con i parametri di paginazione
      const url = `${Constant.API_URL}/user/` + uuid;

      try {
        // Chiamata AJAX usando async/await (GET request)
        await ajaxCall(url, "DELETE", null, token);
        return true;
      } catch (error) {
        console.error("Errore:", error);

        // richiamare verifyToken se va a buon fine fai il refresh del token altrimenti butti fuori
        if (!(await this.verifyToken())) {
          handleUnauthorizedAccess();
        }
      }
    } else {
      handleUnauthorizedAccess();
    }
  }

  async resetPassword(resetPassword) {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      handleUnauthorizedAccess();
      return false;
    }

    const resetPasswordUrl = Constant.API_URL + "/user/resetPassword";

    try {
      const response = await ajaxCall(
        resetPasswordUrl,
        "POST",
        resetPassword,
        token
      );

      if (!isEmpty(response) && response.code === 500) {
        showToast(
          "Errore! In questo momento non puoi cambiare l'email, attendi...",
          "bg-danger"
        );
        return null;
      } else {
        showToast("Password Cambiata con successo");
        showToast("Effettua nuovamente il login");
        return response;
      }
    } catch (error) {
      console.error("Verifica token fallita:", error);
      sessionStorage.removeItem("authToken");
      return false;
    }
  }
}

// Esportazione predefinita della classe
export default new UserService();
