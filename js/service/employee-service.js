import { ajaxCall } from "./base-service.js";
import { Constant } from "../utils/constant.js";
import {
  isEmpty,
  showToast,
  handleUnauthorizedAccess,
} from "../utils/utils.js";
import userService from "./user-service.js";

export class EmployeeService {
  constructor() {}

  // Metodo FindAll
  async findAll(pageable) {
    const token = sessionStorage.getItem("authToken");

    if (!isEmpty(token)) {
      // Costruisce l'URL con i parametri di paginazione
      const url =
        `${Constant.API_URL}/employee` +
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
}

// Esportazione predefinita della classe
export default new EmployeeService();
