import employeeService from "../../service/employee-service.js";

export async function loadEmployee() {
  const pageable = {
    page: 0,
    size: 10,
    sort: "name,asc",
  };

  // Chiamata all'API per ottenere i dati dei dipendenti
  const response = await employeeService.findAll(pageable);
  console.log(response);

  // Seleziona la tabella dove aggiungere i dati
  const tableHtml = $("#employeeTable");

  // Pulisce la tabella (opzionale, nel caso si voglia sempre aggiornare i dati)
  tableHtml.find("tbody").empty();

  // Aggiungi tutte le righe alla tabella in una volta sola
  const rows = response.content.map(createEmployeeRow).join("");
  tableHtml.append(`<tbody>${rows}</tbody>`);
}

// Funzione che crea la riga HTML per un dipendente
const createEmployeeRow = (employee) => {
  return `
        <tr>
          <td>${employee.name}</td>
          <td>${employee.surname}</td>
          <td>
            <div class="dropdown">
              <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                Azioni
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Elimina Utente</a></li>
                <li><a class="dropdown-item" href="#">Modifica Dati</a></li>
                <li><a class="dropdown-item" href="#">Visualizza Timesheet</a></li>
              </ul>
            </div>
          </td>
        </tr>
      `;
};
