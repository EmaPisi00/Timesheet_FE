import {
  isEmpty,
  showItem,
  hideItem,
  disableLinks,
  showToast,
  enableLinks,
} from "../../utils/utils.js";
import {
  generateTimesheet,
  extractPresenceData,
} from "./generate-timesheet.js";
import { showTimesheet } from "./show-timesheet.js";
import { getProfile } from "../auth/auth.js";
import { basePageable } from "../../utils/constant.js";
import timesheetService from "../../service/timesheet-service.js";

// Oggetto di risposta per la generazione del timesheet del mese corrente
let responseSaveTimesheet = null;

// Mese scelto
let month = 0;

// Anno scelto
let year = 0;

export async function setupTimesheet() {
  const userProfile = getProfile();

  // Visualizzo la pagina di generazione del timesheet
  $("#generateTimesheetHandle").click(() => {
    showItem("#containerGenerateTimesheet");
    hideItem("#showTimesheet");
    hideItem("#containerAdminArea");
  });

  // Visualizzo la tabella di tutti i timesheet salvati a DB
  $("#showAllTimesheetHandle").click(async () => {
    showItem("#showTimesheet");
    hideItem("#containerGenerateTimesheet");
    hideItem("#containerAdminArea");

    // Mostro il loader
    showItem("#loader-show-timesheet");

    // Nascondo la tabella ed il titolo
    hideItem("#datatableTimesheet");
    hideItem("#titleShowTimesheet");

    // Salva il tempo di inizio
    const startTime = performance.now();

    // Chiamata a BE per recuperare tutti i timesheet in base all'utente
    const responseShowTimesheet = await timesheetService.findAllByEmployee(
      basePageable,
      userProfile.uuidEmployee
    );

    // Salva il tempo di fine chiamata
    const endTime = performance.now();

    // Tempo impiegato in millisecondi
    const elapsedTime = endTime - startTime;

    // Se la chiamata è andata a buon fine e c'è almeno un elemento lo mostro con un ritardo calcolato
    if (!isEmpty(responseShowTimesheet.content)) {
      setTimeout(() => {
        showTimesheet(
          responseShowTimesheet.content,
          userProfile,
          responseShowTimesheet
        );
      }, elapsedTime);
    }
  });

  // Salvo o aggiorno il timesheet a DB
  $("#saveTimesheet").click(async () => {
    // Estraggo una lista di presenze in base a mese e anno
    const presenceData = extractPresenceData(year, month);

    // Creo un oggetto da dare in input alla chiamata per salvare a DB
    let timesheetRequestDto = {
      timesheetDto: responseSaveTimesheet.timesheetDto,
      presenceList: presenceData,
    };

    // Eseguo una chiamata a DB per salvare o aggiornare il timesheet
    await timesheetService.saveTimesheet(timesheetRequestDto);
  });

  // Genero dinamicamente la tabella del timesheet dopo aver scelto mese ed anno
  $("#generateTimesheet").click(async () => {
    // Ricavo il valore di mese e anno dalla select
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

    // Mostra il loader prima di iniziare
    showItem("#loader-middle");

    // Nasconde tutti i button o altro durante il caricamento
    hideItemsBeforeLoadTable();

    // Disabilito i link o pulsanti
    disableLinks();

    // Salva il tempo di inizio
    const startTime = performance.now();

    // Faccio la chiamata a BE per generare o recuperare il timesheet (in base a se esiste già a DB o no)
    try {
      responseSaveTimesheet =
        await timesheetService.generateTimesheetByMonthAndYearAndEmployee(
          month,
          year,
          userProfile.uuidEmployee
        );

      // Salva il tempo di fine chiamata
      const endTime = performance.now();

      // Tempo impiegato in millisecondi
      const elapsedTime = endTime - startTime;

      // Se la response della mia chiamata è vuota do un errore altrimenti mostro la tabella con il ritardo calcolato
      if (responseSaveTimesheet === 400) {
        showToast(
          "Timesheet Bloccato, non è più possibile modificare il mese",
          "bg-danger"
        );
        hideItem("#loader-middle");
        enableLinks();
        showItemsAfterLoadTable();
      } else {
        setTimeout(
          () => {
            generateTimesheet(year, month, responseSaveTimesheet);
            hideItem("#loader-middle");
          },
          elapsedTime > 2 ? elapsedTime : 2000
        );
      }
    } catch (error) {
      console.error("Errore nella generazione del timesheet:", error);
      hideItem("#loader-middle");
    }
  });

  $("#monthsSelect, #yearsSelect").change(() => {
    if (!isEmpty($("#monthsSelect").val())) hideItem("#monthError");
    if (!isEmpty($("#yearsSelect").val())) hideItem("#yearError");
  });
}

// Funzione che permette di nascondere tutti gli item prima del caricamento del timesheet
function hideItemsBeforeLoadTable() {
  hideItem("#generateTimesheet");
  hideItem("#colSelectMonth");
  hideItem("#colSelectYear");
  hideItem("#titleTimesheet");
  hideItem("#tableContainer");
  hideItem("#saveTimesheet");
  hideItem("#containerAdminArea");
}

function showItemsAfterLoadTable() {
  showItem("#generateTimesheet");
  showItem("#colSelectMonth");
  showItem("#colSelectYear");
  showItem("#titleTimesheet");

  if ($("#saveTimesheet").is(":visible")) {
    hideItem("#saveTimesheet");
  }

  if ($("#tableContainer").is(":visible")) {
    hideItem("#tableContainer");
  } else {
    showItem("#tableContainer");
  }
}
