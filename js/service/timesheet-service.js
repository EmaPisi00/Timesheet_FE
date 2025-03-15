import { ajaxCall } from "./base-service.js";
import { isEmpty } from "../utils/utils.js";
import { Constant } from "../utils/constant.js";

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
        console.error("Errore", error);
      }
    }
  }
}

// Esportazione predefinita della classe
export default new TimesheetService();
