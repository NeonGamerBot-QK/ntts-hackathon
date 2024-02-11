const express = require("express");
const path = require("path");
// const fs = require('fs');
const app = express();
const port = process.env.PORT || process.env.SERVER_PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.status(200).end();
});

module.exports = () => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  return app;
};
