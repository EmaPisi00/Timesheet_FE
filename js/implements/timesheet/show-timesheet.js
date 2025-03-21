import {
  disableLinks,
  enableLinks,
  showItem,
  hideItem,
  showToast,
} from "../../utils/utils.js";
import { getMonthName } from "../../utils/date-utils.js";
export const showTimesheet = (timesheetRequests, employee) => {
  console.log(timesheetRequests); // Mostra tutti i timesheet

  showItem("#loader-show-timesheet");
  disableLinks();

  setTimeout(() => {
    // Seleziono l'elemento della datatable
    const datatableTimesheet = $("#datatableTimesheet");

    // Creazione del contenuto dinamico per la tabella
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
      console.log("presencelIst");
      console.log(presenceList);

      // Calcola il totale delle ore lavorate per questo timesheetRequest
      const totalHours = calculateTotalHours(presenceList);

      // Dati per la riga (ad esempio, per un singolo dipendente)
      const data = {
        nome: employee.name,
        cognome: employee.surname,
        mese: getMonthName(timesheetRequest.month),
        anno: timesheetRequest.year,
        totaleOreLavorate: totalHours,
      };

      // Crea la riga della tabella con i dati
      let row = "<tr>";
      $.each(data, function (key, value) {
        row += `<td>${value}</td>`;
      });

      // Aggiungi la colonna "Azioni"
      row += '<td class="actions">';
      const actions = [
        { icon: "fas fa-edit", title: "Modifica" },
        { icon: "fas fa-eye", title: "Visualizza Dettaglio" },
        { icon: "fas fa-trash-alt", title: "Cancellazione" },
        { icon: "fas fa-lock", title: "Block" },
        { icon: "fas fa-download", title: "Download" },
      ];

      $.each(actions, function (index, action) {
        row += `<i class="${action.icon}" title="${action.title}" style="margin-right: 10px;"></i>`; // Aggiunto margine tra le icone
      });

      row += "</td></tr>";

      tableHTML += row; // Aggiungi la riga appena creata alla tabella
    });

    tableHTML += "</tbody></table>";

    // Inserisci il contenuto HTML generato nella div #datatableTimesheet
    datatableTimesheet.html(tableHTML); // Usato jQuery per appendere il contenuto HTML

    // Nascondi il loader
    hideItem("#loader-show-timesheet");

    // Mostra il Toast di successo (dopo aver caricato la tabella)
    showToast("Tabella caricata con successo!", "success");

    // Abilita i link
    enableLinks();
  }, 5000); // Il timeout di 5000 ms è mantenuto per simulare il tempo di caricamento
};

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
