// Definizione della funzione ajaxCall
export function ajaxCall(method, url, data, successCallback, errorCallback) {
    $.ajax({
      method: method,          // Metodo HTTP (GET, POST, PUT, DELETE, ecc.)
      url: url,                // URL della risorsa
      data: data,              // Dati da inviare (se presente, può essere un oggetto o una stringa)
      dataType: "json",        // Tipo di dato che desideri ricevere
      success: function(response) {
        // Chiamata in caso di successo
        if (successCallback) {
          successCallback(response);
        }
      },
      error: function(xhr, status, error) {
        // Chiamata in caso di errore
        if (errorCallback) {
          errorCallback(xhr, status, error);
        } else {
          alert("Qualcosa è andato storto!");
        }
      },
    });
  }
  