import { createApp } from "./app.js";

const app = createApp();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Kushal Multi Speciality Hospital API running on port " + PORT);
});
