const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({ firstName: "Uzzwal" });
});

app.post("/user", (req, res) => {
  res.send("Data saved");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
