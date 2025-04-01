import { isEmpty, showToast } from "../utils/utils.js";
import timesheetService from "../service/timesheet-service.js";
import { loadPage } from "./pagination.js";
import { getMonthName } from "../utils/date-utils.js";

export function showConfirmationModal(actionType, month, year, uuid) {
  $("#dynamicModal").remove();

  const actionDetails = {
    delete: {
      title: "Conferma Eliminazione",
      message: `Sei sicuro di voler eliminare il timesheet del mese di <strong>${getMonthName(
        month
      )} ${year}</strong>?`,
      confirmButtonClass: "btn-danger",
      confirmButtonText: "Elimina",
      actionFunction: () => timesheetService.deleteTimesheet(uuid),
      successMessage: "Timesheet eliminato con successo!",
      errorMessage: "Errore durante l'operazione",
    },
    block: {
      title: "Conferma Blocco",
      message: `Sei sicuro di voler bloccare il timesheet del mese di <strong>${getMonthName(
        month
      )} ${year}</strong>?`,
      confirmButtonClass: "btn-warning",
      confirmButtonText: "Blocca",
      actionFunction: () => timesheetService.blockTimesheet(uuid),
      successMessage: "Timesheet bloccato con successo!",
      errorMessage: "Errore durante l'operazione",
    },
  };

  if (!actionDetails[actionType]) {
    console.error("Azione non supportata:", actionType);
    return;
  }

  const {
    title,
    message,
    confirmButtonClass,
    confirmButtonText,
    actionFunction,
    successMessage,
    errorMessage,
  } = actionDetails[actionType];

  const modalHTML = `
  <div class="modal fade" id="dynamicModal" tabindex="-1" aria-labelledby="dynamicModalLabel" aria-hidden="false">
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

  // Quando clicchi su "Elimina" o "Blocca"
  $("#confirmAction").on("click", async function () {
    const response = await actionFunction();

    if (!isEmpty(response)) {
      showToast(successMessage);
    } else {
      showToast(errorMessage, "bg-danger");
    }
    modal.hide(); // Chiude il modal

    let page = sessionStorage.getItem("currentPage") || 0;
    loadPage(page);
  });

  // Gestisce la chiusura della modale (clic su "Annulla", "X" o fuori)
  modalElement.addEventListener("hidden.bs.modal", function () {
    // Rimuove la modale solo dopo che è stata chiusa
    $("#dynamicModal").remove();
  });
}
