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

        console.log(response);

        if (!isEmpty(response.code)) {
          console.log("Errore, timesheet di riferimento già esistente");
          console.log(response.code);
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

  // Chiamata API per salvare il timesheet
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

  // Chiamata API per prendere tutti i timesheet appartenenti a quell'utente
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

  // Chiamata API per eliminare un timesheet
  async deleteTimesheet(uuid) {
    const token = sessionStorage.getItem("authToken");

    if (!isEmpty(token)) {
      // Costruisce l'URL con i parametri di paginazione
      const url = `${Constant.API_URL}/timesheet/` + uuid;

      try {
        // Chiamata AJAX usando async/await (GET request)
        await ajaxCall(url, "DELETE", null, token);
        return true;
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

  // Chiamata API per bloccare un timesheet
  async blockTimesheet(uuid) {
    const token = sessionStorage.getItem("authToken");

    if (!isEmpty(token)) {
      // Costruisce l'URL con i parametri di paginazione
      const url = `${Constant.API_URL}/timesheet/block/` + uuid;

      try {
        // Chiamata AJAX usando async/await (GET request)
        const response = await ajaxCall(url, "PATCH", null, token);

        if (!isEmpty(response)) {
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

  // Chiamata API per scaricare un timesheet
  async downloadTimesheet(uuid) {
    const token = sessionStorage.getItem("authToken");

    if (!isEmpty(token)) {
      const url = `${Constant.API_URL}/timesheet/downloadExcel/` + uuid;

      try {
        // La funzione ajaxCall capisce automaticamente che è un file binario!
        const blob = await ajaxCall(url, "GET", null, token);

        // Creiamo un URL temporaneo per il download
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "OrarioLavorativo.xlsx"; // Nome del file
        document.body.appendChild(a);
        a.click();

        // Pulizia memoria
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error("Errore nel download:", error);
        if (!(await userService.verifyToken())) {
          handleUnauthorizedAccess();
        }
      }
    } else {
      handleUnauthorizedAccess();
    }
  }

  // Chiamata API per prendere tutti i timesheet a db non cancellati
  async findAll(pageable) {
    const token = sessionStorage.getItem("authToken");

    if (!isEmpty(token)) {
      // Costruisce l'URL con i parametri di paginazione
      const url =
        `${Constant.API_URL}/timesheet` +
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

  // Chiamata API per cercare un timesheet in base a uno uuid
  async findByUuid(uuid) {
    const token = sessionStorage.getItem("authToken");

    if (!isEmpty(token)) {
      // Costruisce l'URL con i parametri di paginazione
      const url = `${Constant.API_URL}/timesheet/` + uuid;

      try {
        // Chiamata AJAX usando async/await (GET request)
        await ajaxCall(url, "GET", null, token);
        return true;
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
