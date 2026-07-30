/* ================================================================
   Fruitiva Forms → Google Sheets Backend  (Code.gs)

   Routes incoming POST /exec  →  3 sheet tabs based on `type` field:
     type: "order"         →  Orders tab
     type: "contact"       →  Contact tab
     type: "subscription"  →  Subscriptions tab

   Frontend sends JSON via fetch()  →  doPost(e) appends a row + timestamp.
   ================================================================ */

function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse_({ ok: false, error: "Invalid JSON body: " + err.toString() });
  }

  const type = (data.type || "").toString().trim().toLowerCase();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const now = new Date();

  try {
    if (type === "order") {
      const sheet = ss.getSheetByName("Orders");
      if (!sheet) return jsonResponse_({ ok: false, error: 'Sheet tab "Orders" not found — run setupHeaders() first' });
      sheet.appendRow([
        now,
        data.name       || "",
        data.email      || "",
        data.phone      || "",
        data.items      || "",
        data.itemsCount || "",
        data.subtotal   || "",
        data.delivery   || "",
        data.total      || "",
        data.address    || "",
        data.payment    || "",
        data.note       || ""
      ]);
    }
    else if (type === "contact") {
      const sheet = ss.getSheetByName("Contact");
      if (!sheet) return jsonResponse_({ ok: false, error: 'Sheet tab "Contact" not found — run setupHeaders() first' });
      sheet.appendRow([
        now,
        data.name     || "",
        data.email    || "",
        data.subject  || "",
        data.message  || ""
      ]);
    }
    else if (type === "subscription") {
      const sheet = ss.getSheetByName("Subscriptions");
      if (!sheet) return jsonResponse_({ ok: false, error: 'Sheet tab "Subscriptions" not found — run setupHeaders() first' });
      sheet.appendRow([
        now,
        data.name       || "",
        data.phone      || "",
        data.address    || "",
        data.plan       || "",
        data.startDate  || "",
        data.items      || "",
        data.itemsCount || "",
        data.extras     || "",
        data.total      || ""
      ]);
    }
    else {
      return jsonResponse_({ ok: false, error: 'Unknown type "' + type + '". Expected: order | contact | subscription.' });
    }

    return jsonResponse_({ ok: true, type: type });
  } catch (err) {
    return jsonResponse_({ ok: false, error: "Append failed: " + err.toString() });
  }
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ----------------------------------------------------------------
 * setupHeaders()  —  Run ONCE manually after pasting this script.
 * Creates the 3 required tabs, writes bold column headers, freezes row 1.
 * (Safe to re-run — it will not overwrite existing data rows.
 * ---------------------------------------------------------------- */
function setupHeaders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  ensureSheet_(ss, "Orders", [
    "Timestamp", "Name", "Email", "Phone",
    "Items", "Items Count", "Subtotal", "Delivery", "Total",
    "Address", "Payment Method", "Note"
  ]);

  ensureSheet_(ss, "Contact", [
    "Timestamp", "Name", "Email", "Subject", "Message"
  ]);

  ensureSheet_(ss, "Subscriptions", [
    "Timestamp", "Name", "Phone", "Address",
    "Plan", "Start Date", "Items", "Items Count",
    "Extras / Requests", "Total"
  ]);

  SpreadsheetApp.getUi().alert(
    "✅ Setup complete!\n\n" +
    "3 tabs created + bold headers + frozen top row.\n\n" +
    "Now go to: Deploy → New deployment → Web app → Who has access: Anyone → Deploy.\n" +
    "Then paste the /exec URL into line 1 of checkout.js, contact.js, subscription.js."
  );
}

function ensureSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  const existingHeader = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const isBlank = existingHeader.every(function (v) { return v === "" || v === null || v === undefined; });
  if (isBlank) {
    sheet.getRange(1, 1, 1, headers.length)
      .setValues([headers])
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#f3f4f6");
  }
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
}
