export async function ajaxCall(url, method, data = null, token = null) {
  try {
    const headers = {};

    // Se stiamo inviando JSON, aggiungi il Content-Type
    if (data) {
      headers["Content-Type"] = "application/json";
    }

    // Aggiungi il token di autenticazione, se presente
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

    // Se la risposta non è ok (status 2xx), lancia un errore
    if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.status}`);
    }

    // **Controlla il Content-Type della risposta**
    const contentType = response.headers.get("Content-Type");

    if (contentType && contentType.includes("application/json")) {
      // Se è JSON, parsalo e restituiscilo
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } else {
      // Se NON è JSON, trattiamolo come file binario (Blob)
      return await response.blob();
    }
  } catch (error) {
    console.error("Errore nella chiamata AJAX:", error);
    throw error;
  }
}
