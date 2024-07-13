const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const Reg = require("../models/reg");

const router = express.Router();

// Middleware
router.use(fileUpload());

router.post("/upload", async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const file = req.files.file;
  const filename = file.name.toLowerCase();
  const localname = path.join(__dirname, "..", "inputs", filename);

  // Save file to local storage
  file.mv(localname, (err) => {
    if (err) return res.status(500).send(err);

    let lines = fs.readFileSync(localname).toString().split(/\r?\n/);
    let itemshow = [];

    if (filename.includes("huawei")) {
      processHuawei(lines, itemshow);
    } else if (filename.includes("state")) {
      processZTEState(lines, itemshow);
    } else {
      processZTE(lines, itemshow);
    }

    res.send({ message: "File processed successfully", data: itemshow });
  });
});

const processHuawei = (lines, itemshow) => {
  for (let i = 8; i < lines.length; i++) {
    let elements = lines[i].split(" ").filter((e) => e !== "");
    let item = {
      olt: "Huawei",
      slot: elements[1].split("/")[0],
      port: elements[1].split("/")[1],
      ont_id: elements[2],
      sn: elements[3],
      run_state: elements[5],
      config_state: elements[6],
      match_state: elements[7],
    };

    Reg.create(item);

    itemshow.push(item);
  }
};

const processZTE = (lines, itemshow) => {
  for (let i = 2; i < lines.length; i++) {
    let elements = lines[i].split(" ").filter((e) => e !== "");
    let item = {
      olt: "ZTE",
      slot: elements[0].split([":"])[0][11],
      port: elements[0].split([":"])[0][13],
      ont_id: elements[0].split([":"])[1],
      sn: elements[3].split([":"])[1],
      run_state: elements[4],
      config_state: "",
      match_state: "",
    };

    Reg.create(item);

    itemshow.push(item);
  }
};

const processZTEState = (lines, itemshow) => {
  for (let i = 3; i < lines.length; i++) {
    let elements = lines[i].split(" ").filter((e) => e !== "");
    let item = {
      olt: "ZTE",
      slot: elements[0].split([":"])[0][2],
      port: elements[0].split([":"])[0][4],
      ont_id: elements[0].split([":"])[1],
      sn: "",
      run_state: elements[1],
      config_state: elements[2],
      match_state: elements[3],
    };

    Reg.create(item);

    itemshow.push(item);
  }
};

module.exports = router;