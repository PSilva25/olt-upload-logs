const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const readline = require('readline');
const Olt = require('./models/olt');

const app = express();

app.use(express.json());
app.use(fileUpload());

// Funções para tratar os diferentes tipos de arquivos
const processHuaweiFile = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const [olt, slot, port, ont_id, sn, run_state, config_state, match_state] = line.split(',');
    await Olt.create({ olt, slot, port, ont_id, sn, run_state, config_state, match_state });
  }
};

const processZteFile = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const [olt, slot, port, ont_id, sn] = line.split(',');
    await Olt.create({ olt, slot, port, ont_id, sn });
  }
};

const processZteStateFile = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const [olt, slot, port, ont_id, sn, run_state, config_state, match_state] = line.split(',');
    await Olt.create({ olt, slot, port, ont_id, sn, run_state, config_state, match_state });
  }
};

// Rota para upload de arquivos
app.post('/upload', async (req, res) => {
  const fileType = req.body.fileType;
  const file = req.files.file;

  const filePath = `./uploads/${file.name}`;
  file.mv(filePath, async (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    try {
      if (fileType === 'huawei') {
        await processHuaweiFile(filePath);
      } else if (fileType === 'zte') {
        await processZteFile(filePath);
      } else if (fileType === 'zte-state') {
        await processZteStateFile(filePath);
      }
      res.send('File uploaded and processed successfully.');
    } catch (error) {
      console.error('Error processing file:', error);
      res.status(500).send('Error processing file.');
    } finally {
      fs.unlinkSync(filePath); // Remove o arquivo após o processamento
    }
  });
});

// Rota para visualização dos dados
app.get('/data', async (req, res) => {
  try {
    const data = await Olt.findAll();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});