import {
  isEmpty,
  showItem,
  hideItem,
  disableLinks,
} from "../../utils/utils.js";
import {
  generateTimesheet,
  extractPresenceData,
} from "./generate-timesheet.js";
import { showTimesheet } from "./show-timesheet.js";
import timesheetService from "../../service/timesheet-service.js";
import { getProfile } from "../auth/auth.js";

// Oggetto di risposta per la generazione del timesheet del mese corrente
let responseSaveTimesheet = null;

// Mese scelto
let month = 0;

// Anno scelto
let year = 0;

export async function setupTimesheet() {
  const userProfile = getProfile();

  // Visualizzo la pagina di generazione del timesheet
  $("#generateTimesheetLink").click(() => {
    showItem("#timesheetContainer");
    hideItem("#showTimesheetContainer");
  });

  // Visualizzo la tabella di tutti i timesheet salvati a DB
  $("#showTimesheetLink").click(async () => {
    showItem("#showTimesheetContainer");
    hideItem("#timesheetContainer");

    // Costruisco un oggetto Pageable per la paginazione
    const pageable = {
      page: 0, // Numero della pagina (indice zero-based)
      size: 10, // Numero di elementi per pagina
      sort: "",
    };

    // Mostro il loader
    showItem("#loadingShowTimesheet");

    // Nascondo la tabella ed il titolo
    hideItem("#timesheetDataTable");
    hideItem("#timesheetHistoryTitle");

    // Salva il tempo di inizio
    const startTime = performance.now();

    // Chiamata a BE per recuperare tutti i timesheet in base all'utente
    const responseShowTimesheet = await timesheetService.findAllByEmployee(
      pageable,
      userProfile.uuidEmployee
    );

    // Salva il tempo di fine chiamata
    const endTime = performance.now();

    // Tempo impiegato in millisecondi
    const elapsedTime = endTime - startTime;

    // Se la chiamata è andata a buon fine e c'è almeno un elemento lo mostro con un ritardo calcolato
    if (!isEmpty(responseShowTimesheet.content)) {
      setTimeout(() => {
        showTimesheet(responseShowTimesheet.content, userProfile);
      }, elapsedTime);
    }
  });

  // Salvo o aggiorno il timesheet a DB
  $("#saveTimesheetButton").click(async () => {
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
  $("#generateTimesheetButton").click(async () => {
    // Ricavo il valore di mese e anno dalla select
    month = parseInt($("#selectMonthDropdown").val(), 10);
    year = parseInt($("#selectYearDropdown").val(), 10);

    if (isEmpty(month) || isNaN(month)) {
      showItem("#monthErrorMessage");
      return;
    } else hideItem("#monthErrorMessage");

    if (isEmpty(year) || isNaN(year)) {
      showItem("#yearErrorMessage");
      return;
    } else hideItem("#yearErrorMessage");

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
      const responseSaveTimesheet =
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
      if (isEmpty(responseSaveTimesheet)) {
        alert("Errore timesheet esistente");
        hideItem("#loader-middle");
      } else {
        setTimeout(() => {
          generateTimesheet(year, month, responseSaveTimesheet);
          hideItem("#loader-middle");
        }, elapsedTime);
      }
    } catch (error) {
      console.error("Errore nella generazione del timesheet:", error);
      alert("Si è verificato un errore durante la generazione del timesheet.");
      hideItem("#loader-middle");
    }
  });

  $("#selectMonthDropdown, #selectYearDropdown").change(() => {
    if (!isEmpty($("#selectMonthDropdown").val()))
      hideItem("#monthErrorMessage");
    if (!isEmpty($("#selectYearDropdown").val())) hideItem("#yearErrorMessage");
  });
}

// Funzione che permette di nascondere tutti gli item prima del caricamento del timesheet
function hideItemsBeforeLoadTable() {
  hideItem("#generateTimesheetButton");
  hideItem("#colSelectMonth");
  hideItem("#colSelectYear");
  hideItem("#titleTimesheet");
  hideItem("#timesheetTableContainer");
  hideItem("#buttonLegend");
  hideItem("#timesheetLegendContainer");
  hideItem("#saveTimesheetButton");
}
