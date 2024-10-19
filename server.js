// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 5000;

app.use(bodyParser.json({ limit: '10mb' }));

// Rota para receber a imagem
app.post('/upload', (req, res) => {
  const imageData = req.body.image;
  const base64Data = imageData.split(',')[1]; // Remove o prefixo data URL

  // Cria um nome único para o arquivo
  const timestamp = Date.now();
  const filePath = path.join(__dirname, 'uploads', `image_${timestamp}.jpg`);

  fs.writeFile(filePath, base64Data, 'base64', (err) => {
    if (err) {
      console.error('Erro ao salvar a imagem:', err);
      return res.status(500).send('Erro ao salvar a imagem');
    }

    // Armazena o IP e informações no arquivo logs.txt
    const userIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    fs.appendFile('logs.txt', `Image saved: ${filePath}, IP: ${userIP}, Timestamp: ${timestamp}\n`, (err) => {
      if (err) {
        console.error('Erro ao salvar os dados:', err);
      }
    });

    res.send('Imagem recebida com sucesso');
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
