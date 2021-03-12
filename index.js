const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
const multer = require("multer");
var docxConverter = require("docx-pdf");

const app = express();
app.use(bodyparser.json());
app.use(express.static("public"));
var outputFilePath;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const docxtopdfdemo = function (req, file, callback) {
  var ext = path.extname(file.originalname);
  if (ext !== ".docx" && ext !== ".doc") {
    return callback("This Extension is not supported");
  }
  callback(null, true);
};

const docxtopdfdemoupload = multer({
  storage: storage,
  fileFilter: docxtopdfdemo,
});

app.set("view-engine", "ejs");

app.get("/", (req, res) => {
  res.render("frontend.ejs");
});

app.post("/", docxtopdfdemoupload.single("file"), async (req, res) => {
  outputFilePath = "public\\downloads\\" + Date.now() + "output.pdf";

  docxConverter(req.file.path, outputFilePath, function (err, result) {
    if (err) {
      console.log(err);
    }
    res.download(outputFilePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
    console.log("result" + result);
  });
});

app.listen(3000);
