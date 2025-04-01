import {
  enableLinks,
  showItem,
  hideItem,
  showToast,
  isEmpty,
} from "../../utils/utils.js";
import { getMonthName } from "../../utils/date-utils.js";
import { generateTimesheet } from "./generate-timesheet.js";
import { getProfile } from "../auth/auth.js";
import timesheetService from "../../service/timesheet-service.js";
export const showTimesheet = (timesheetRequests, employee, pagination) => {
  // Seleziono l'elemento della datatable
  const datatableTimesheet = $("#datatableTimesheet");

  if (timesheetRequests.length === 0) {
    // Se non ci sono timesheetRequests, mostro il messaggio "Nessun risultato trovato"
    datatableTimesheet.html(
      '<div class="alert alert-warning">Nessun risultato trovato.</div>'
    );
    hideItem("#loader-show-timesheet");
    showItem("#titleShowTimesheet");
    return; // Esco dalla funzione perché non c'è nulla da mostrare
  }

  // Creo l'intestazione della tabella
  let tableHTML =
    '<table class="table table-striped"><thead><tr>' +
    '<th style="width: 15%;">Mese</th>' + // Imposta larghezza fissa
    '<th style="width: 15%;">Anno</th>' + // Imposta larghezza fissa
    '<th style="width: 20%;">Totale Ore Lavorate</th>' + // Imposta larghezza fissa
    '<th style="width: 50%;">Azioni</th>' + // Colonna azioni più larga
    "</tr></thead><tbody>";

  // Itero su tutti i timesheetRequests per generare le righe della tabella
  $.each(timesheetRequests, function (index, timesheetRequest) {
    let presenceList = timesheetRequest.presenceList;
    let monthRequest = timesheetRequest.month;
    let yearRequest = timesheetRequest.year;
    const totalHours = calculateTotalHours(presenceList);

    const data = {
      mese: getMonthName(monthRequest),
      anno: yearRequest,
      totaleOreLavorate: totalHours,
    };

    let row = "<tr>";

    $.each(data, function (key, value) {
      row += `<td>${value}</td>`;
    });

    row += '<td class="actions">';
    const actions = [
      { icon: "fas fa-edit", title: "Modifica", action: "edit" },
      { icon: "fas fa-eye", title: "Visualizza Dettaglio", action: "view" },
      { icon: "fas fa-trash-alt", title: "Cancellazione", action: "delete" },
      { icon: "fas fa-lock", title: "Blocca", action: "block" },
      { icon: "fas fa-download", title: "Download", action: "download" },
    ];

    $.each(actions, function (index, action) {
      row += `
        <button class="btn btn-link p-0 border-0 shadow-none btn-action" 
                data-action="${action.action}" 
                data-month="${monthRequest}" 
                data-year="${yearRequest}" 
                data-uuid="${timesheetRequest.uuid}" 
                title="${action.title}" 
                style="margin-right: 10px; vertical-align: middle;">
            <i class="${action.icon}" style="font-size: 16px; color: #333;"></i>
        </button>
      `;
    });

    row += "</td></tr>";
    tableHTML += row;
  });

  tableHTML += "</tbody></table>";
  datatableTimesheet.html(tableHTML);

  hideItem("#loader-show-timesheet");
  showItem("#datatableTimesheet");
  showItem("#titleShowTimesheet");

  // Gestisci la paginazione
  updatePagination(pagination);

  enableLinks();

  $(".btn-action").on("click", function () {
    const action = $(this).data("action");
    const month = $(this).data("month");
    const year = $(this).data("year");
    const uuid = $(this).data("uuid");
    handleActionClick(action, month, year, uuid);
  });
};

// Funzione per aggiornare la paginazione
// Funzione per aggiornare la paginazione
function updatePagination(pagination) {
  const paginationContainer = $("#paginationContainer");

  // Se non ci sono dati per la paginazione, esci
  if (!pagination || !pagination.totalPages || pagination.totalPages <= 1) {
    paginationContainer.html(""); // Se c'è solo una pagina, non serve la paginazione
    return;
  }

  let paginationHTML = '<ul class="pagination justify-content-end">'; // Utilizza la classe 'justify-content-end' per allineare a destra

  // Link "Precedente"
  if (pagination.pageable.pageNumber > 0) {
    paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${
      pagination.pageable.pageNumber - 1
    }">«</a></li>`;
  } else {
    paginationHTML += `<li class="page-item disabled"><a class="page-link" href="#" tabindex="-1" aria-disabled="true">«</a></li>`;
  }

  // Link per ogni pagina
  for (let i = 0; i < pagination.totalPages; i++) {
    paginationHTML += `
      <li class="page-item ${
        i === pagination.pageable.pageNumber ? "active" : ""
      }">
        <a class="page-link" href="#" data-page="${i}">${i + 1}</a>
      </li>
    `;
  }

  // Link "Successivo"
  if (pagination.pageable.pageNumber < pagination.totalPages - 1) {
    paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${
      pagination.pageable.pageNumber + 1
    }">»</a></li>`;
  } else {
    paginationHTML += `<li class="page-item disabled"><a class="page-link" href="#" tabindex="-1" aria-disabled="true">»</a></li>`;
  }

  paginationHTML += "</ul>";

  // Inserisco i link nel container di paginazione
  paginationContainer.html(paginationHTML);

  sessionStorage.setItem("currentPage", pagination.pageable.pageNumber);

  // Aggiungo event listener per il click sui link della paginazione
  $(".page-link").on("click", function (event) {
    event.preventDefault();
    const page = $(this).data("page");
    loadPage(page); // Carica la pagina selezionata
  });
}

async function loadPage(page) {
  const userProfile = getProfile(); // Otteniamo il profilo utente per sapere quale dipendente caricare
  const pageable = {
    page: page, // Pagina selezionata
    size: 10, // Numero di risultati per pagina
    sort: "",
  };

  try {
    // Carichiamo i dati del timesheet per la pagina selezionata
    const response = await timesheetService.findAllByEmployee(
      pageable,
      userProfile.uuidEmployee
    );

    // Chiamata alla funzione showTimesheet per visualizzare i dati
    showTimesheet(response.content, userProfile, response);
  } catch (error) {
    console.error("Errore nel caricare i dati del timesheet", error);
    showToast("Errore nel caricare i dati. Riprova.", "bg-danger");
  }
}

// Funzione per gestire il clic sui bottoni delle azioni
async function handleActionClick(action, month, year, uuid) {
  console.log(
    `Azione selezionata: ${action} per mese: ${month}, anno: ${year}`
  );

  switch (action) {
    case "edit":
      editTimesheet(month, year);
      break;
    case "view":
      alert(`Visualizzazione dettagliata del timesheet per ${month}/${year}`);
      break;
    case "delete":
      showDeleteModal(month, year, uuid);
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

// Funzione di edit timesheet che richiamo quando sono nella tabella di storico dei timesheet
async function editTimesheet(month, year) {
  const userProfile = getProfile();
  if (!isEmpty(userProfile)) {
    const responseSaveTimesheet =
      await timesheetService.generateTimesheetByMonthAndYearAndEmployee(
        month,
        year,
        userProfile.uuidEmployee
      );

    if (responseSaveTimesheet === 400) {
      showToast(
        "Timesheet Bloccato, non è più possibile modificare il mese di " +
          getMonthName(month) +
          " per l'anno " +
          year,
        "bg-danger"
      );
    } else {
      if (!isEmpty(responseSaveTimesheet)) {
        if (!isEmpty(responseSaveTimesheet.timesheetDto)) {
          hideItem("#datatableTimesheet");
          showItem("#containerGenerateTimesheet");
          hideItem("#showTimesheet");
          generateTimesheet(year, month, responseSaveTimesheet);
        }
      }
    }
  }
}

// Funzione di delete timesheet che richiamo quando sono nella tabella di storico dei timesheet
async function showDeleteModal(month, year, uuid) {
  // Rimuove eventuali modali precedenti
  $("#dynamicModal").remove();

  console.log(uuid);

  // Crea il codice HTML della modale
  const modalHTML = `
      <div class="modal fade" id="dynamicModal" tabindex="-1" aria-labelledby="dynamicModalLabel" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="dynamicModalLabel">Conferma Eliminazione</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      Sei sicuro di voler eliminare il timesheet del mese di <strong>${getMonthName(
                        month
                      )} ${year}</strong>?
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                      <button type="button" class="btn btn-danger" id="confirmDelete">Conferma</button>
                  </div>
              </div>
          </div>
      </div>
  `;

  // Aggiunge la modale al body
  $("body").append(modalHTML);

  // Mostra la modale
  var modal = new bootstrap.Modal(document.getElementById("dynamicModal"));
  modal.show();

  // Gestisce il click sul pulsante di conferma
  $("#confirmDelete").on("click", async function () {
    await timesheetService.deleteTimesheet(uuid);
    modal.hide(); // Chiude la modale

    const savedPage = sessionStorage.getItem("currentPage");
    if (savedPage !== null) {
      loadPage(savedPage); // Carica la pagina salvata
    } else {
      loadPage(0); // Carica la prima pagina se non c'è una pagina salvata
    }

    // Rimuove la modale e il backdrop dal DOM dopo la chiusura
    $("#dynamicModal").remove();
    $(".modal-backdrop").remove(); // Rimuove il backdrop di oscuramento

    showToast("Timesheet eliminato con successso!");
  });

  // Gestisci anche la chiusura della modale quando si clicca fuori dalla finestra
  $("#dynamicModal").on("hidden.bs.modal", function () {
    $(".modal-backdrop").remove(); // Rimuove il backdrop quando la modale è completamente chiusa
  });
}
