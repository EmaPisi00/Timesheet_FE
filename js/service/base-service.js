export async function ajaxCall(url, method, data = null, token = null) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    // Se è presente un token, aggiungilo nell'header Authorization
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    console.log("URL richiesta:", url);

    // Esegui la richiesta
    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: data ? JSON.stringify(data) : null,
    });

    // Verifica se la risposta non è stata positiva (status 2xx)
    if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.status}`);
    }

    // Se la risposta non contiene un corpo (es. per DELETE o risposte senza contenuto), ritorna void
    const text = await response.text();
    if (!text) {
      return; // Risposta vuota, quindi ritorniamo `void`
    }

    // Se la risposta contiene dati, parsifica il JSON
    return JSON.parse(text);
  } catch (error) {
    console.error("Errore nella chiamata AJAX:", error);
    // Log dettagliato dell'errore
    if (error instanceof TypeError) {
      console.error("Tipo di errore:", error.message);
      console.error("Verifica la connessione o la configurazione dell'URL.");
    }
    throw error; // Rilancio l'errore per gestirlo a livello superiore
  }
}
