import userService from "../../service/user-service.js";
import { hideItem, showItem, showToast } from "../../utils/utils.js";

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

export async function logout() {
  await userService.logout();
  sessionStorage.removeItem("profile");
  sessionStorage.removeItem("startTime");
  sessionStorage.removeItem("authToken");
  window.location.href = "/pages/main.html";
}

// Recupero il profilo dell'utente
export function getProfile() {
  const userProfileJson = sessionStorage.getItem("profile");
  const userProfile = JSON.parse(userProfileJson);
  console.log(userProfile);
  return userProfile;
}
