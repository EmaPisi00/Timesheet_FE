import {
  enableLinks,
  showItem,
  hideItem,
  showToast,
} from "../../utils/utils.js";
import { getMonthName } from "../../utils/date-utils.js";
import timesheetService from "../../service/timesheet-service.js";
import { generateTimesheet } from "./generate-timesheet.js";
export const showTimesheet = (timesheetRequests, employee) => {
  // Seleziono l'elemento della datatable
  const timesheetDataTable = $("#timesheetDataTable");

  if (timesheetRequests.length === 0) {
    // Se non ci sono timesheetRequests, mostro il messaggio "Nessun risultato trovato"
    timesheetDataTable.html(
      '<div class="alert alert-warning">Nessun risultato trovato.</div>'
    );

    // Nascondi il loader se presente
    hideItem("#loadingShowTimesheet");

    // Mostra il titolo se necessario
    showItem("#timesheetHistoryTitle");

    return; // Esco dalla funzione perché non c'è nulla da mostrare
  }

  // Se ci sono timesheetRequests, procedo con la creazione della tabella
  let tableHTML =
    '<table class="table table-striped"><thead><tr>' +
    '<th style="width: 10%;">Nome</th>' +
    '<th style="width: 10%;">Cognome</th>' +
    '<th style="width: 5%;">Mese</th>' +
    '<th style="width: 5%;">Anno</th>' +
    '<th style="width: 10%;">Totale Ore Lavorate</th>' +
    '<th style="width: 20%;">Azioni</th>' +
    "</tr></thead><tbody>";

  // Itera su tutti i timesheetRequests
  $.each(timesheetRequests, function (index, timesheetRequest) {
    let presenceList = timesheetRequest.presenceList;
    console.log("presenceList:", presenceList);

    let monthRequest = timesheetRequest.month;
    let yearRequest = timesheetRequest.year;

    // Calcola il totale delle ore lavorate per questo timesheetRequest
    const totalHours = calculateTotalHours(presenceList);

    // Dati per la riga (ad esempio, per un singolo dipendente)
    const data = {
      nome: employee.name,
      cognome: employee.surname,
      mese: getMonthName(monthRequest),
      anno: yearRequest,
      totaleOreLavorate: totalHours,
    };

    // Crea la riga della tabella con i dati
    let row = "<tr>";
    $.each(data, function (key, value) {
      row += `<td>${value}</td>`;
    });

    // Aggiungi la colonna "Azioni" con i bottoni senza bordi
    row += '<td class="actions">';
    const actions = [
      { icon: "fas fa-edit", title: "Modifica", action: "edit" },
      { icon: "fas fa-eye", title: "Visualizza Dettaglio", action: "view" },
      { icon: "fas fa-trash-alt", title: "Cancellazione", action: "delete" },
      { icon: "fas fa-lock", title: "Blocca", action: "block" },
      { icon: "fas fa-download", title: "Download", action: "download" },
    ];

    // Genera i pulsanti con data-month e data-year
    $.each(actions, function (index, action) {
      row += `
          <button class="btn btn-link p-0 border-0 shadow-none btn-action" 
                  data-action="${action.action}" 
                  data-month="${monthRequest}" 
                  data-year="${yearRequest}" 
                  title="${action.title}"
                  style="margin-right: 15px; vertical-align: middle;">
            <i class="${action.icon}" style="font-size: 16px; color: #333;"></i>
          </button>
        `;
    });

    row += "</td></tr>";

    tableHTML += row; // Aggiungi la riga appena creata alla tabella
  });

  tableHTML += "</tbody></table>";

  // Inserisci il contenuto HTML generato nella div #timesheetDataTable
  timesheetDataTable.html(tableHTML);

  // Nascondi il loader e mostra la tabella
  hideItem("#loadingShowTimesheet");
  showItem("#timesheetDataTable");
  showItem("#timesheetHistoryTitle");

  // Mostra il Toast di successo (dopo aver caricato la tabella)
  showToast("Tabella caricata con successo!", "success");

  // Abilita i link
  enableLinks();

  // Aggiungi event listener ai bottoni per ottenere il mese e l'anno corretti
  $(".btn-action").on("click", function () {
    const action = $(this).data("action");
    const month = $(this).data("month");
    const year = $(this).data("year");
    handleActionClick(action, month, year);
  });
};

// Funzione per gestire il clic sui bottoni delle azioni
async function handleActionClick(action, month, year) {
  console.log(
    `Azione selezionata: ${action} per mese: ${month}, anno: ${year}`
  );

  switch (action) {
    case "edit":
      const userProfileJson = sessionStorage.getItem("profile");
      const userProfile = JSON.parse(userProfileJson);
      const responseSaveTimesheet =
        await timesheetService.generateTimesheetByMonthAndYearAndEmployee(
          month,
          year,
          userProfile.uuidEmployee
        );

      if (responseSaveTimesheet === 400) {
        alert("Errore timesheet esistente");
      } else {
        hideItem("#timesheetDataTable");
        showItem("#timesheetContainer");
        hideItem("#showTimesheetContainer");
        generateTimesheet(year, month, responseSaveTimesheet);
      }
      break;
    case "view":
      alert(`Visualizzazione dettagliata del timesheet per ${month}/${year}`);
      break;
    case "delete":
      if (confirm("Sei sicuro di voler eliminare il timesheet?")) {
        alert(`Timesheet di ${month}/${year} eliminato!`);
      }
      break;
    case "block":
      alert(`Il timesheet di ${month}/${year} è stato bloccato`);
      break;
    case "download":
      alert(`Download del timesheet per ${month}/${year} avviato`);
      break;
    default:
      alert("Azione non riconosciuta");
  }
}

// Funzione per calcolare il totale delle ore lavorate nel mese
function calculateTotalHours(presenceList) {
  if (!Array.isArray(presenceList)) {
    console.error("La lista delle presenze non è un array");
    return 0;
  }

  // Calcola il totale delle ore lavorate (verifica che la proprietà 'totalHours' sia presente)
  return presenceList.reduce(function (total, day) {
    if (day.totalHours) {
      return total + day.totalHours;
    }
    return total; // Se non c'è 'totalHours', restituisci il totale corrente
  }, 0);
}
