/**
 * Google Apps Script for Retrospective Hub
 * Sheet Name: Retro
 * Spreadsheet: https://docs.google.com/spreadsheets/d/1gCwqccxh3sMFZHdi5wenGIsPBSsvGvrOJskdi0R3brA/edit
 *
 * HOW TO INSTALL:
 * 1. Open the Google Sheet above.
 * 2. In the menu, go to: Extensions > Apps Script.
 * 3. Delete any existing code in the editor, paste this entire file, and click Save (disk icon).
 * 4. Click Deploy (top right) > New deployment.
 * 5. Click the gear icon next to "Select type" and choose "Web app".
 * 6. Set:
 *    - Description: "Retro API"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 7. Click Deploy, Authorize access with your Google account.
 * 8. Copy the "Web app URL" (it ends in /exec) and paste it into the Retrospective app!
 */

const SHEET_NAME = "Retro";

const HEADERS = [
  "Sr. No.",
  "Project",
  "Client name",
  "Product owner",
  "Product owner hrs.",
  "UAT issues",
  "UAT issues remark",
  "Requirement & Document gaps",
  "Requirement & Document gaps remark",
  "Product lessons learned",
  "Lessons learned remark",
  "UI owner(s)",
  "UI issues summary",
  "UI issues summary remark",
  "UI lessons learned",
  "UI lessons learned remark"
];

function doPost(e) {
  try {
    const lock = LockService.getScriptLock();
    // Wait up to 30s for other processes to finish
    lock.waitLock(30000);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
    }

    // Ensure header row is present
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    const payload = JSON.parse(e.postData.contents);
    const rows = sheet.getDataRange().getValues();

    // Check if project already exists (column B, index 1)
    let targetRowIndex = -1;
    const projectSearch = (payload.project || "").trim().toLowerCase();

    if (projectSearch && rows.length > 1) {
      for (let i = 1; i < rows.length; i++) {
        const rowProject = String(rows[i][1] || "").trim().toLowerCase();
        if (rowProject === projectSearch) {
          targetRowIndex = i + 1; // 1-based sheet row
          break;
        }
      }
    }

    if (targetRowIndex > 0) {
      // Update/merge existing project row
      const existing = rows[targetRowIndex - 1];

      const mergeField = (existingVal, newVal) => {
        if (!newVal) return existingVal || "";
        if (!existingVal) return newVal;
        if (existingVal.includes(newVal)) return existingVal;
        return existingVal + "\n• " + newVal;
      };

      const updatedRow = [
        existing[0], // Keep existing Sr. No.
        existing[1] || payload.project || "",
        payload.client !== undefined && payload.client !== "" ? payload.client : (existing[2] || ""),
        payload.productOwner !== undefined && payload.productOwner !== "" ? payload.productOwner : (existing[3] || ""),
        payload.hours !== undefined && payload.hours !== "" ? payload.hours : (existing[4] || ""),
        mergeField(existing[5], payload.uat),
        mergeField(existing[6], payload.uatRemarks),
        mergeField(existing[7], payload.gaps),
        mergeField(existing[8], payload.gapRemarks),
        mergeField(existing[9], payload.productLessons),
        mergeField(existing[10], payload.productLessonRemarks),
        payload.uiOwners !== undefined && payload.uiOwners !== "" ? payload.uiOwners : (existing[11] || ""),
        mergeField(existing[12], payload.uiIssues),
        mergeField(existing[13], payload.uiIssueRemarks),
        mergeField(existing[14], payload.uiLessons),
        mergeField(existing[15], payload.uiLessonRemarks)
      ];

      sheet.getRange(targetRowIndex, 1, 1, 16).setValues([updatedRow]);

      lock.releaseLock();
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "updated",
        row: updatedRow
      })).setMimeType(ContentService.MimeType.JSON);

    } else {
      // Append brand new row
      const lastRow = sheet.getLastRow();
      const nextSrNo = lastRow >= 1 ? lastRow : 1;

      const newRow = [
        payload.srNo || nextSrNo,
        payload.project || "",
        payload.client || "",
        payload.productOwner || "",
        payload.hours || "",
        payload.uat || "",
        payload.uatRemarks || "",
        payload.gaps || "",
        payload.gapRemarks || "",
        payload.productLessons || "",
        payload.productLessonRemarks || "",
        payload.uiOwners || "",
        payload.uiIssues || "",
        payload.uiIssueRemarks || "",
        payload.uiLessons || "",
        payload.uiLessonRemarks || ""
      ];

      sheet.appendRow(newRow);

      lock.releaseLock();
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "appended",
        row: newRow
      })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ status: "success", data: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const values = sheet.getDataRange().getValues();
    return ContentService.createTextOutput(JSON.stringify({ status: "success", data: values }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
