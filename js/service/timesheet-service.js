import { ajaxCall } from "./base-service.js";
import { isEmpty, showToast } from "../utils/utils.js";
import { Constant } from "../utils/constant.js";

export class TimesheetService {
  constructor() {}

  // Metodo Generazione timesheet
  async generateTimesheetByMonthAndYearAndEmployee(month, year, uuidEmployee) {
    if (localStorage.getItem("redirected")) {
      localStorage.removeItem("redirected");
      return false;
    }

    const token = sessionStorage.getItem("authToken");

    if (!isEmpty(token)) {
      const baseUrl = Constant.API_URL + "/timesheet/generateTimesheet";

      const url = `${baseUrl}/month/${month}/year/${year}/uuidEmployee/${uuidEmployee}`;

      try {
        // Chiamata AJAX usando async/await
        const response = await ajaxCall(url, "GET", null, token);

        if (!isEmpty(response.code) && response.code === 400) {
          console.log("Errore, timesheet di riferimento già esistente");
          return response.code;
        } else {
          return response;
        }
      } catch (error) {
        console.error("Verifica token fallita:", error);
        localStorage.setItem("redirected", "true");
        localStorage.removeItem("authToken");
        window.location.href = "/pages/main.html";
      }
    }
  }

  async saveTimesheet(timesheetRequestDto) {
    const token = sessionStorage.getItem("authToken");

    if (!isEmpty(token)) {
      const url = Constant.API_URL + "/timesheet/saveTimesheet";

      try {
        // Chiamata AJAX usando async/await
        const response = await ajaxCall(
          url,
          "POST",
          timesheetRequestDto,
          token
        );

        // Se il codice di risposta è 400 (errore)
        if (!isEmpty(response.code) && response.code === 400) {
          console.log("Errore, timesheet di riferimento già esistente");

          // Mostra il Toast di errore
          showToast(
            "Errore, timesheet di riferimento già esistente.",
            "bg-danger"
          );

          return response.code;
        } else {
          // Mostra il Toast di successo
          showToast("Timesheet salvato con successo!", "bg-success");

          return response;
        }
      } catch (error) {
        console.error("Verifica token fallita:", error);
        localStorage.setItem("redirected", "true");
        localStorage.removeItem("authToken");
        window.location.href = "/pages/main.html";

        // Mostra il Toast di errore
        showToast("Si è verificato un errore. Riprova il login.", "bg-danger");
      }
    }
  }
}

// Esportazione predefinita della classe
export default new TimesheetService();
