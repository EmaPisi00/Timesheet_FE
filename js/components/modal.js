import { isEmpty, showToast } from "../utils/utils.js";
import timesheetService from "../service/timesheet-service.js";
import { loadPage } from "./pagination.js";
import { getMonthName } from "../utils/date-utils.js";

export function showDeleteModal(month, year, uuid) {
  $("#dynamicModal").remove();

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

  $("body").append(modalHTML);
  var modal = new bootstrap.Modal(document.getElementById("dynamicModal"));
  modal.show();

  $("#confirmDelete").on("click", async function () {
    await timesheetService.deleteTimesheet(uuid);
    modal.hide();
    showToast("Timesheet eliminato con successo!");

    let page = sessionStorage.getItem("currentPage");

    if (!isEmpty(page)) {
      loadPage(page);
    } else {
      loadPage(0);
    }
  });
}
