import * as dotenv from "dotenv";
dotenv.config();

import { app } from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[Server] Ascent API is running on http://localhost:${PORT}`);
});
