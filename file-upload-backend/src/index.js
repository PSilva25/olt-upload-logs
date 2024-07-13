require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const cors = require("cors");
const { maxHeaderSize } = require("http");

const app = express();
const PORT = process.env.PORT || 3000;

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

sequelize
  .authenticate()
  .then(() =>
    console.log("Conexão com o banco de dados estabelecida com sucesso.")
  )
  .catch((err) =>
    console.error("Não foi possível conectar ao banco de dados:", err)
  );

const Reg = sequelize.define("Reg", {
  olt: { type: Sequelize.STRING },
  slot: { type: Sequelize.STRING },
  port: { type: Sequelize.STRING },
  ont_id: { type: Sequelize.STRING },
  sn: { type: Sequelize.STRING },
  run_state: { type: Sequelize.STRING },
  config_state: { type: Sequelize.STRING },
  match_state: { type: Sequelize.STRING },
});

Reg.sync();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

function convertLineHuawei(line) {
  const elements = line.split(" ").filter((e) => e !== "");
  return {
    olt: "Huawei",
    slot: elements[1]?.split("/")[0],
    port: elements[1]?.split("/")[1],
    ont_id: elements[2],
    sn: elements[3],
    run_state: elements[5],
    config_state: elements[6],
    match_state: elements[7],
  };
}

function convertLineZte(line) {
  const elements = line.split(" ").filter((e) => e !== "");
  return {
    olt: "ZTE",
    slot: elements[0]?.split(":")[0][11],
    port: elements[0]?.split(":")[0][13],
    ont_id: elements[0]?.split(":")[1],
    sn: elements[3]?.split(":")[1],
    run_state: elements[4],
    config_state: "",
    match_state: "",
  };
}

function convertLineZteState(line) {
  const elements = line.split(" ").filter((e) => e !== "");
  return {
    olt: "ZTE State",
    slot: elements[0]?.split(":")[0][2],
    port: elements[0]?.split(":")[0][4],
    ont_id: elements[0]?.split(":")[1],
    sn: "",
    run_state: elements[3],
    config_state: elements[2],
    match_state: elements[3],
  };
}

const convertLine = (line, filename) => {
  const normalizedFilename = filename.toLowerCase();

  if (normalizedFilename.includes("huawei")) return convertLineHuawei(line);
  if (
    normalizedFilename.includes("zte") &&
    normalizedFilename.includes("state")
  )
    return convertLineZteState(line);
  if (normalizedFilename.includes("zte")) return convertLineZte(line);

  return convertLineZte(line);
};

app.post("/api/upload", async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("Nenhum arquivo foi enviado.");
    }

    const file = req.files.file;
    const uploadPath = path.join(__dirname, "../inputs", file.name);

    file.mv(uploadPath, async (err) => {
      console.log(uploadPath);
      if (err) {
        console.error("Erro ao mover o arquivo:", err);
        return res.status(500).send("Erro ao mover o arquivo.");
      }

      try {
        const lines = fs.readFileSync(uploadPath, "utf-8").split(/\r?\n/);
        const items = [];

        for (let i = 0; i < lines.length; i++) {
          try {
            const item = convertLine(lines[i], file.name);
            if (item.sn.includes("@virtex.com")) {
              break;
            }
            if (item.slot && item.port && item.ont_id) {
              await Reg.create(item);
              items.push(item);
            }
          } catch (err) {
            console.error("Erro ao processar linha:", err);
          }
        }

        res.send("Arquivo enviado e processado com sucesso!");
      } catch (err) {
        console.error("Erro ao ler ou processar o arquivo:", err);
        res.status(500).send("Erro ao ler ou processar o arquivo.");
      }
    });
  } catch (err) {
    console.error("Erro ao tratar a requisição de upload:", err);
    res.status(500).send("Erro interno do servidor.");
  }
});

app.delete("/api/data/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const record = await Reg.findByPk(id);
    if (!record) {
      return res.status(404).send("Registro não encontrado.");
    }
    await record.destroy();
    res.send("Registro excluído com sucesso.");
  } catch (err) {
    console.error("Erro ao excluir dados:", err);
    res.status(500).send("Erro ao excluir dados.");
  }
});

app.post("/api/data/batch-delete", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).send("Nenhum ID fornecido para exclusão.");
    }

    await Reg.destroy({
      where: {
        id: ids,
      },
    });

    res.send("Registros excluídos com sucesso.");
  } catch (err) {
    console.error("Erro ao excluir registros:", err);
    res.status(500).send("Erro ao excluir registros.");
  }
});

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      "Tem calma que deu certo aqui...<br>Se quiser ver os dados, acesse /api/data"
    );
});

app.get("/api/data", async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = maxHeaderSize,
      sortField,
      sortOrder,
      searchText,
      olt = [],
      slot = [],
      port = [],
    } = req.query;

    const options = {
      offset: (parseInt(page) - 1) * parseInt(pageSize),
      limit: parseInt(pageSize),
    };

    if (sortField && sortOrder) {
      options.order = [[sortField, sortOrder === "ascend" ? "ASC" : "DESC"]];
    }

    const whereClause = {};

    if (searchText) {
      whereClause[Sequelize.Op.or] = [
        { olt: { [Sequelize.Op.like]: `%${searchText}%` } },
        { slot: { [Sequelize.Op.like]: `%${searchText}%` } },
        { port: { [Sequelize.Op.like]: `%${searchText}%` } },
        { ont_id: { [Sequelize.Op.like]: `%${searchText}%` } },
        { sn: { [Sequelize.Op.like]: `%${searchText}%` } },
        { run_state: { [Sequelize.Op.like]: `%${searchText}%` } },
      ];
    }

    if (olt.length > 0) {
      whereClause.olt = { [Sequelize.Op.in]: olt };
    }
    if (slot.length > 0) {
      whereClause.slot = { [Sequelize.Op.in]: slot };
    }
    if (port.length > 0) {
      whereClause.port = { [Sequelize.Op.in]: port };
    }

    const data = await Reg.findAndCountAll({
      ...options,
      where: whereClause,
    });

    res.json({
      data: data.rows,
      total: data.count,
    });
  } catch (err) {
    console.error("Erro ao buscar dados:", err);
    res.status(500).send("Erro ao buscar dados.");
  }
});

app.get("/api/filters", async (req, res) => {
  try {
    const olts = await Reg.findAll({
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("olt")), "olt"]],
    });

    const slots = await Reg.findAll({
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("slot")), "slot"]],
    });

    const ports = await Reg.findAll({
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("port")), "port"]],
    });

    res.json({
      olts: olts.map((item) => item.olt),
      slots: slots.map((item) => item.slot),
      ports: ports.map((item) => item.port),
    });
  } catch (err) {
    console.error("Erro ao buscar filtros:", err);
    res.status(500).send("Erro ao buscar filtros.");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
