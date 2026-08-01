export const extractErrorMessages = (err: any): string => {
  // 🟢 1. Server-ൽ നിന്ന് Response എത്തിയെങ്കിൽ (HTTP Status Codes like 400, 404, 500)
  if (err?.response) {
    const status = err.response.status;
    const data = err.response.data;

    // A. status Code 404 ആണെങ്കിൽ
    if (status === 404) {
      return data?.detail || data?.message || "Requested resource or endpoint not found. (404)";
    }

    // B. Check inside `data.error`
    if (data?.error) {
      if (typeof data.error === "string") return data.error;
      if (typeof data.error === "object" && data.error.message) return data.error.message;
    }

    // C. Check standard fields: message, detail
    if (data?.message && typeof data.message === "string") return data.message;
    if (data?.detail && typeof data.detail === "string") return data.detail;

    // D. Handle Object key validation errors (e.g. { username: ["This field is required."] })
    if (typeof data === "object" && !Array.isArray(data)) {
      const firstKey = Object.keys(data)[0];
      if (firstKey) {
        const firstValue = data[firstKey];

        if (Array.isArray(firstValue) && typeof firstValue[0] === "string") {
          return `${firstKey}: ${firstValue[0]}`;
        }
        if (typeof firstValue === "string") {
          return `${firstKey}: ${firstValue}`;
        }
      }
    }

    // E. Handle Direct Array Errors
    if (Array.isArray(data) && typeof data[0] === "string") {
      return data[0];
    }
  } 

  // 🔴 2. Server-ലേക്ക് Request പോയി, പക്ഷെ Response ഒന്നും വരാതിരുന്നാൽ മാത്രം (True Network Error)
  if (err?.request) {
    return "Network error. Server unreachable or connection failed.";
  }

  // 🟡 3. Fallback Standard JS Error
  return err?.message || "Something went wrong. Please try again.";
};