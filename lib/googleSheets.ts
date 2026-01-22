import { google } from "googleapis";


console.log("NODE_ENV =", process.env.NODE_ENV);


export async function syncToGoogleSheets(row: string[]) {
  
  if (process.env.NODE_ENV !== "production") {
    console.log("Google Sheets sync skipped (dev mode)");
    return;
  }

  // ⬇️ Everything below runs ONLY in production
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID!,
    range: "Sheet1!A:D",
    valueInputOption: "RAW",
    requestBody: {
      values: [row],
    },
  });
}
