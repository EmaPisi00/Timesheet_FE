import { isEmpty, showToast } from "../utils/utils.js";
import timesheetService from "../service/timesheet-service.js";
import { loadPage } from "./pagination.js";
import { getMonthName } from "../utils/date-utils.js";
import userService from "../service/user-service.js";
import { Operations } from "../utils/constant.js";

// Modale di conferma per operazioni sui timesheet (eliminazione o blocco)
export function showConfirmationModalShowTimesheet(
  actionType,
  month,
  year,
  uuid
) {
  // Mappatura delle azioni disponibili
  const actionDetails = {
    3: {
      title: "Conferma Eliminazione",
      message: `Sei sicuro di voler eliminare il timesheet di <strong>${getMonthName(
        month
      )} ${year}</strong>?`,
      confirmButtonClass: "btn-danger",
      confirmButtonText: "Elimina",
      actionFunction: () => timesheetService.deleteTimesheet(uuid),
      successMessage: "Timesheet eliminato con successo!",
      errorMessage: "Errore durante l'operazione",
    },
    4: {
      title: "Conferma Blocco",
      message: `Sei sicuro di voler bloccare il timesheet di <strong>${getMonthName(
        month
      )} ${year}</strong>?`,
      confirmButtonClass: "btn-warning",
      confirmButtonText: "Blocca",
      actionFunction: () => timesheetService.blockTimesheet(uuid),
      successMessage: "Timesheet bloccato con successo!",
      errorMessage: "Errore durante l'operazione",
    },
  };

  const action = actionDetails[actionType];
  if (!action) return; // Se il tipo azione non è supportato, esce silenziosamente

  // Crea e mostra la modale usando la funzione centrale
  createConfirmationModal({
    title: action.title,
    message: action.message,
    confirmButtonClass: action.confirmButtonClass,
    confirmButtonText: action.confirmButtonText,
    onConfirm: async () => {
      const response = await action.actionFunction();
      if (!isEmpty(response)) {
        showToast(action.successMessage);
      } else {
        showToast(action.errorMessage, "bg-danger");
      }

      // Ricarica la pagina attuale
      let page = sessionStorage.getItem("currentPage") || 0;
      loadPage(page, Operations.SHOW_TIMESHEET_USER);
    },
  });
}

// Modale di conferma per operazioni su dipendenti (es. eliminazione)
export function showConfirmationModalEmployee(actionType, uuid) {
  const actionDetails = {
    1: {
      title: "Conferma Eliminazione",
      message: `Sei sicuro di voler eliminare questo utente?`,
      confirmButtonClass: "btn-danger",
      confirmButtonText: "Elimina",
      actionFunction: () => userService.deleteUser(uuid),
      successMessage: "Utente eliminato con successo!",
      errorMessage: "Errore durante l'operazione",
    },
  };

  const action = actionDetails[actionType];
  if (!action) {
    console.error("Azione non supportata:", actionType);
    return;
  }

  // Crea e mostra la modale usando la funzione centrale
  createConfirmationModal({
    title: action.title,
    message: action.message,
    confirmButtonClass: action.confirmButtonClass,
    confirmButtonText: action.confirmButtonText,
    onConfirm: async () => {
      const response = await action.actionFunction();
      if (!isEmpty(response)) {
        showToast(action.successMessage);
      } else {
        showToast(action.errorMessage, "bg-danger");
      }

      // Ricarica la pagina attuale
      let page = sessionStorage.getItem("currentPage") || 0;
      loadPage(page, Operations.SHOW_EMPLOYEES_ADMIN);
    },
  });
}

export function showConfirmationModalTimesheet(
  actionType,
  uuid,
  month,
  year,
  name,
  surname
) {
  // Mappatura delle azioni disponibili
  const actionDetails = {
    1: {
      title: "Conferma Eliminazione",
      message: `Sei sicuro di voler eliminare il timesheet dell'utente <strong>${name} ${surname}</strong> 
      di <strong>${getMonthName(month)} ${year}</strong>`,
      confirmButtonClass: "btn-danger",
      confirmButtonText: "Elimina",
      actionFunction: () => timesheetService.deleteTimesheet(uuid),
      successMessage: "Timesheet eliminato con successo!",
      errorMessage: "Errore durante l'operazione",
    },
  };

  const action = actionDetails[actionType];
  if (!action) return; // Se il tipo azione non è supportato, esce silenziosamente

  // Crea e mostra la modale usando la funzione centrale
  createConfirmationModal({
    title: action.title,
    message: action.message,
    confirmButtonClass: action.confirmButtonClass,
    confirmButtonText: action.confirmButtonText,
    onConfirm: async () => {
      const response = await action.actionFunction();
      if (!isEmpty(response)) {
        showToast(action.successMessage);
      } else {
        showToast(action.errorMessage, "bg-danger");
      }

      // Ricarica la pagina attuale
      let page = sessionStorage.getItem("currentPage") || 0;
      loadPage(page, Operations.SHOW_TIMESHEET_ADMIN);
    },
  });
}

// Funzione centrale e riutilizzabile per la creazione e gestione della modale di conferma
function createConfirmationModal({
  title,
  message,
  confirmButtonClass = "btn-primary",
  confirmButtonText = "Conferma",
  onConfirm = () => {},
}) {
  // Rimuove eventuali modali già esistenti
  if ($("#dynamicModal").length) {
    $("#dynamicModal").modal("hide");
    $("#dynamicModal").remove();
  }

  const modalHTML = `
    <div class="modal fade" id="dynamicModal" tabindex="-1" aria-labelledby="dynamicModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="dynamicModalLabel">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">${message}</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="cancelAction">Annulla</button>
            <button type="button" class="btn ${confirmButtonClass}" id="confirmAction">${confirmButtonText}</button>
          </div>
        </div>
      </div>
    </div>
  `;

  $("body").append(modalHTML);

  const modalElement = document.getElementById("dynamicModal");
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Rimuove eventuali vecchi listener e aggiunge il nuovo
  $("#confirmAction")
    .off("click")
    .on("click", async function () {
      await onConfirm();
      modal.hide();
    });

  // Pulisce il DOM una volta chiusa la modale
  modalElement.addEventListener("hidden.bs.modal", function () {
    $("#dynamicModal").remove();
  });
}
