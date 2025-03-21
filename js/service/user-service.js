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

  // Metodo per rinnovare il token
  async attemptTokenRefresh() {
    const refreshToken = sessionStorage.getItem("authToken");
    if (!refreshToken) return false;

    const refreshUrl = Constant.API_URL + "/user/refreshToken";

    try {
      const response = await ajaxCall(refreshUrl, "POST", { refreshToken });

      if (response?.token) {
        sessionStorage.setItem("authToken", response.token);
        return true;
      } else {
        throw new Error("Rinnovo del token fallito.");
      }
    } catch (error) {
      console.error("Errore durante il rinnovo del token:", error);
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
}

// Esportazione predefinita della classe
export default new UserService();
