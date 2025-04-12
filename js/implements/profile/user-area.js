import { hideItem, showItem } from "../../utils/utils.js";
import { resetPassowrd } from "../auth/auth.js";

export async function setupUseraArea() {
  // Area Utente
  $("#userArea").click(() => {
    showItem("#userAreaContainer");

    hideItem("#containerGenerateTimesheet");
    hideItem("#showTimesheet");
    hideItem("#containerAdminArea");

    $("#passwordForm").submit(async (e) => {
      e.preventDefault(); // Evita l'invio del modulo se ci sono errori

      const password = $("#newPassword").val();
      const confirmPassword = $("#confirmPassword").val();

      const resetPasswordObject = {
        password: password,
        repeatPassword: confirmPassword,
      };

      // Esegui il reset della password
      resetPassowrd(resetPasswordObject);
    });
  });
}
