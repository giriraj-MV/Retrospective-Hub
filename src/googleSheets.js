export const SPREADSHEET_ID = "1gCwqccxh3sMFZHdi5wenGIsPBSsvGvrOJskdi0R3brA";
export const SHEET_NAME = "Retro";
export const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit#gid=0`;

const GVIZ_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

export const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx91MsyFl10kPHSmsSyYkHs6csFr7lemHshbB9k0VhP7bRpXFbSZNGhV7i6Coj5OwiE/exec";

export function getScriptUrl() {
  return localStorage.getItem("retro_google_script_url") || import.meta.env.VITE_GOOGLE_SCRIPT_URL || DEFAULT_SCRIPT_URL;
}

export function setScriptUrl(url) {
  if (url) {
    localStorage.setItem("retro_google_script_url", url.trim());
  } else {
    localStorage.removeItem("retro_google_script_url");
  }
}

/**
 * Fetches current rows live from the Google Sheet via GViz.
 * Returns an array of parsed project records.
 */
export async function fetchSheetRows() {
  try {
    const res = await fetch(`${GVIZ_URL}&_t=${Date.now()}`);
    if (!res.ok) {
      throw new Error(`Google Sheet request failed with status: ${res.status}`);
    }
    const text = await res.text();
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
    if (!match || !match[1]) {
      return [];
    }

    const data = JSON.parse(match[1]);
    const rows = data.table?.rows || [];
    if (rows.length === 0) return [];

    // Check if first row is header
    const firstRowCell0 = rows[0]?.c?.[0]?.v;
    const startIndex = (firstRowCell0 === "Sr. No." || String(firstRowCell0).toLowerCase().includes("sr")) ? 1 : 0;

    const splitLines = (val) => {
      if (!val) return [];
      return String(val)
        .split("\n")
        .map(s => s.replace(/^[•\s\-\*]+/, "").trim())
        .filter(Boolean);
    };

    const parsed = [];
    for (let i = startIndex; i < rows.length; i++) {
      const c = rows[i].c || [];
      const val = (idx) => (c[idx] && c[idx].v !== null && c[idx].v !== undefined ? String(c[idx].v).trim() : "");
      
      const project = val(1);
      if (!project) continue; // Skip completely empty rows

      parsed.push({
        srNo: val(0) || i,
        project: project,
        client: val(2),
        productOwner: val(3),
        hours: val(4) ? parseFloat(val(4)) || val(4) : "",
        uat: splitLines(val(5)),
        uatRemarks: splitLines(val(6)),
        gaps: splitLines(val(7)),
        gapRemarks: splitLines(val(8)),
        productLessons: splitLines(val(9)),
        productLessonRemarks: splitLines(val(10)),
        uiOwners: val(11),
        uiIssues: splitLines(val(12)),
        uiIssueRemarks: splitLines(val(13)),
        uiLessons: splitLines(val(14)),
        uiLessonRemarks: splitLines(val(15))
      });
    }

    return parsed;
  } catch (err) {
    console.warn("Failed to fetch live data from Google Sheet:", err);
    return null;
  }
}

/**
 * Sends a submission (Product or UI retrospective) to the Google Apps Script Web App.
 */
export async function submitRetrospective(payload) {
  const scriptUrl = getScriptUrl();

  // Save to local backup cache
  saveLocalSubmission(payload);

  if (!scriptUrl) {
    return {
      success: true,
      viaSheet: false,
      message: "Saved locally! To write directly to Google Sheets, connect your Google Apps Script Web App URL."
    };
  }

  try {
    // Send to Google Apps Script Web App
    // Note: using mode: 'no-cors' allows submission through Google's 302 redirect without CORS failure
    await fetch(scriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    return {
      success: true,
      viaSheet: true,
      message: "Successfully submitted and stored in Google Sheet (Retro)!"
    };
  } catch (error) {
    console.error("Failed to post to Google Apps Script:", error);
    return {
      success: false,
      viaSheet: false,
      error: error.message || "Failed to reach Google Apps Script"
    };
  }
}

function saveLocalSubmission(payload) {
  try {
    const existing = JSON.parse(localStorage.getItem("retro_local_submissions") || "[]");
    existing.push({ ...payload, timestamp: new Date().toISOString() });
    localStorage.setItem("retro_local_submissions", JSON.stringify(existing));
  } catch (e) {
    // Ignore storage quota errors
  }
}
