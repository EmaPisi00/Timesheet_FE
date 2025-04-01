import { ajaxCall } from "./base-service.js";
import {
  isEmpty,
  showToast,
  handleUnauthorizedAccess,
} from "../utils/utils.js";
import { Constant } from "../utils/constant.js";
import userService from "./user-service.js";

export class TimesheetService {
  constructor() {}

  // Metodo Generazione timesheet
  async generateTimesheetByMonthAndYearAndEmployee(month, year, uuidEmployee) {
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
        console.error("Errore:", error);

        // richiamare verifyToken se va a buon fine fai il refresh del token altrimenti butti fuori
        if (!(await userService.verifyToken())) {
          sessionStorage.removeItem("authToken");
          handleUnauthorizedAccess();
        }
      }
    } else {
      handleUnauthorizedAccess();
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
          showToast("Timesheet salvato con successo!", "success");

          return response;
        }
      } catch (error) {
        console.error("Errore", error);

        // richiamare verifyToken se va a buon fine fai il refresh del token altrimenti butti fuori
        if (!(await userService.verifyToken())) {
          sessionStorage.removeItem("authToken");
          handleUnauthorizedAccess();
        }

        // Mostra il Toast di errore
        showToast(
          "Si è verificato un errore. Controlla meglio la compilazione",
          "bg-danger"
        );
      }
    } else {
      handleUnauthorizedAccess();
    }
  }

  async findAllByEmployee(pageable, uuidEmployee) {
    const token = sessionStorage.getItem("authToken");

    if (!isEmpty(token)) {
      // Costruisce l'URL con i parametri di paginazione
      const url =
        `${Constant.API_URL}/timesheet/findAllByEmployee/${uuidEmployee}` +
        `?page=${pageable.page}&size=${pageable.size}&sort=${pageable.sort}`;

      try {
        // Chiamata AJAX usando async/await (GET request)
        const response = await ajaxCall(url, "GET", null, token);

        // Se il codice di risposta è 400 (errore)
        if (!isEmpty(response.code) && response.code === 400) {
          console.log("Errore nel recupero dei timesheet");

          // Mostra il Toast di errore
          showToast("Errore nel recupero dei timesheet.", "bg-danger");

          return response.code;
        } else {
          return response;
        }
      } catch (error) {
        console.error("Errore:", error);

        // richiamare verifyToken se va a buon fine fai il refresh del token altrimenti butti fuori
        if (!(await userService.verifyToken())) {
          handleUnauthorizedAccess();
        }
      }
    } else {
      handleUnauthorizedAccess();
    }
  }

  async deleteTimesheet(uuid) {
    const token = sessionStorage.getItem("authToken");

    if (!isEmpty(token)) {
      // Costruisce l'URL con i parametri di paginazione
      const url = `${Constant.API_URL}/timesheet/` + uuid;

      try {
        // Chiamata AJAX usando async/await (GET request)
        await ajaxCall(url, "DELETE", null, token);
      } catch (error) {
        console.error("Errore:", error);

        // richiamare verifyToken se va a buon fine fai il refresh del token altrimenti butti fuori
        if (!(await userService.verifyToken())) {
          handleUnauthorizedAccess();
        }
      }
    } else {
      handleUnauthorizedAccess();
    }
  }
}

// Esportazione predefinita della classe
export default new TimesheetService();
