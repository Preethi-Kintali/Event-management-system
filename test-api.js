const fetch = require("node-fetch");
async function main() {
  const res = await fetch("http://localhost:3000/api/v1/payments/manager/transactions", {
    headers: {
      "x-organization-id": "df900947-eff9-45d7-a0b7-925f6e61912f",
      // Without auth, it'll fail, so I shouldn't bother simulating the API call natively
      // The issue is more likely the frontend hook fetching `/payments/manager/transactions` but wait!
    }
  });
}
