import { isEmpty, showItem, hideItem } from "../../utils/utils.js";
import {
  generateTimesheet,
  extractPresenceData,
} from "./generate-timesheet.js";
import { showTimesheet } from "./show-timesheet.js";
import timesheetService from "../../service/timesheet-service.js";

let responseSaveTimesheet = null;
let month = 0;
let year = 0;

export async function setupTimesheet() {
  const userProfileJson = sessionStorage.getItem("profile");
  const userProfile = JSON.parse(userProfileJson);

  // Visualizzo la pagina di generazione del timesheet
  $("#generateTimesheetHandle").click(() => {
    showItem("#containerGenerateTimesheet");
    hideItem("#showTimesheet");
  });

  // Visualizzo la tabella di tutti i timesheet salvati a DB
  $("#showAllTimesheetHandle").click(async () => {
    showItem("#showTimesheet");
    hideItem("#containerGenerateTimesheet");

    const pageable = {
      page: 0, // Numero della pagina (indice zero-based)
      size: 10, // Numero di elementi per pagina
      sort: "",
    };

    const responseShowTimesheet = await timesheetService.findAllByEmployee(
      pageable,
      userProfile.uuidEmployee
    );

    console.log(responseShowTimesheet.content);
    console.log(userProfile);

    if (!isEmpty(responseShowTimesheet.content)) {
      showTimesheet(responseShowTimesheet.content, userProfile);
    }
  });

  // Salvo o aggiorno il timesheet a DB
  $("#saveTimesheet").click(async () => {
    const presenceData = extractPresenceData(year, month);

    let timesheetRequestDto = {
      timesheetDto: responseSaveTimesheet.timesheetDto,
      presenceList: presenceData,
    };

    const risposta = await timesheetService.saveTimesheet(timesheetRequestDto);

    console.log(risposta);
  });

  // Genero dinamicamente la tabella del timesheet dopo aver scelto mese ed anno
  $("#generateTimesheet").click(async () => {
    month = parseInt($("#monthsSelect").val(), 10);
    year = parseInt($("#yearsSelect").val(), 10);

    if (isEmpty(month) || isNaN(month)) {
      showItem("#monthError");
      return;
    } else hideItem("#monthError");

    if (isEmpty(year) || isNaN(year)) {
      showItem("#yearError");
      return;
    } else hideItem("#yearError");

    console.log(userProfile);
    responseSaveTimesheet =
      await timesheetService.generateTimesheetByMonthAndYearAndEmployee(
        month,
        year,
        userProfile.uuidEmployee
      );

    if (responseSaveTimesheet === 400) {
      alert("Errore timesheet esistente");
    } else {
      generateTimesheet(year, month, responseSaveTimesheet);
    }
  });

  $("#monthsSelect, #yearsSelect").change(() => {
    if (!isEmpty($("#monthsSelect").val())) hideItem("#monthError");
    if (!isEmpty($("#yearsSelect").val())) hideItem("#yearError");
  });
}
