const logger = require("./utils/logger"); // Importar el logger personalizado
const express = require("express");
const { youtubedl, youtubedlv2 } = require('@bochilteam/scraper'); // Si necesitas usar YouTube API
const ytdl = require('ytdl-core'); // Si necesitas usar la librería ytdl-core

async function start() {
  try {
    const app = express();
    const PORT = process.env.PORT || 4000;

    app.use(express.json());

    // Ruta principal
    app.get("/", (req, res) => {
      logger.info("Ruta principal '/' visitada");
      res.json({ message: "Bienvenido a la API" });
    });

    // Ruta para descargar audio de YouTube
    app.get("/download-audio", async (req, res) => {
      const { url } = req.query;
      if (!url) {
        return res.status(400).json({ error: "Por favor, proporciona una URL de YouTube." });
      }

      try {
        const info = await ytdl.getInfo(url);
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        const audioUrl = audioFormats[0].url;
        res.json({ title: info.videoDetails.title, audioUrl });
      } catch (error) {
        logger.error(`Error al obtener la información del video: ${error.message}`);
        res.status(500).json({ error: "Error al procesar el video." });
      }
    });

    // Ruta para descargar video de YouTube
    app.get("/download-video", async (req, res) => {
      const { url } = req.query;
      if (!url) {
        return res.status(400).json({ error: "Por favor, proporciona una URL de YouTube." });
      }

      try {
        const info = await ytdl.getInfo(url);
        const videoFormats = ytdl.filterFormats(info.formats, 'videoandaudio');
        const videoUrl = videoFormats[0].url;
        res.json({ title: info.videoDetails.title, videoUrl });
      } catch (error) {
        logger.error(`Error al obtener la información del video: ${error.message}`);
        res.status(500).json({ error: "Error al procesar el video." });
      }
    });

    app.listen(PORT, () => {
      logger.info(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(`Error al iniciar el servidor: ${error.message}`);
  }
}

start();