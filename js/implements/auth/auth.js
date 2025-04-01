import {
  handleUnauthorizedAccess,
  hideItem,
  isEmpty,
  showItem,
} from "../../utils/utils.js";
import userService from "../../service/user-service.js";

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
    showItem("#loadingSpinner");
    hideItem("#loginCardContainer");

    const result = await userService.login(email, password);

    if (result) {
      const userProfile = await userService.getUserProfile();
      sessionStorage.setItem("profile", JSON.stringify(userProfile));
      sessionStorage.setItem("startTime", Date.now());
      return true;
    } else {
      hideItem("#loadingSpinner");
      showItem("#loginCardContainer");
      showItem("#loginError");
      return false;
    }
  } catch (error) {
    console.error("Errore nel login:", error);
    showItem("#loginError");
    hideItem("#loadingSpinner");
    showItem("#loginCardContainer");
    return false;
  }
}

export async function logout() {
  await userService.logout();
  sessionStorage.removeItem("profile");
  sessionStorage.removeItem("startTime");
  sessionStorage.removeItem("authToken");
  window.location.href = "/pages/main.html";
}

// Recupero il profilo dell'utente
export function getProfile() {
  const token = sessionStorage.getItem("authToken");
  if (!isEmpty(token)) {
    const userProfileJson = sessionStorage.getItem("profile");
    const userProfile = JSON.parse(userProfileJson);
    return userProfile;
  }

  handleUnauthorizedAccess();
}
