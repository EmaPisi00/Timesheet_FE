import { getProfile } from "../implements/auth/auth.js";
import timesheetService from "../service/timesheet-service.js";
import { showTimesheet } from "../implements/timesheet/show-timesheet.js";

export function updatePagination(pagination) {
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

// Funzione per caricare la pagina
export async function loadPage(page) {
  const userProfile = getProfile(); // Otteniamo il profilo utente per sapere quale dipendente caricare
  const pageable = {
    page: page, // Pagina selezionata
    size: 10, // Numero di risultati per pagina
    sort: "", // Sort se necessario
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
