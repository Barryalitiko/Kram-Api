const express = require("express");
const path = require("path");
const fs = require("fs"); // Para leer los archivos
const logger = require("./utils/logger");
const audioRoutes = require("./routes/audio");
const musicaRoutes = require("./routes/musica");
const videoRoutes = require("./routes/video");
const playdlAudioRoutes = require("./routes/playdlAudio");

async function start() {
  try {
    const app = express();
    const PORT = process.env.PORT || 4000;

    // Servir archivos estáticos desde la carpeta 'public'
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(express.json());

    // Ruta principal
    app.get("/", (req, res) => {
      logger.info("Ruta principal '/' visitada");
      res.json({ message: "Bienvenido a la API" });
    });

    // Ruta para ver los archivos en la carpeta public
    app.get("/public-files", (req, res) => {
      const publicDir = path.join(__dirname, 'public');
      fs.readdir(publicDir, (err, files) => {
        if (err) {
          return res.status(500).send("No se pudieron leer los archivos.");
        }
        res.send(`
          <html>
            <body>
              <h1>Archivos en public:</h1>
              <ul>
                ${files.map(file => `<li><a href="/${file}" target="_blank">${file}</a></li>`).join('')}
              </ul>
            </body>
          </html>
        `);
      });
    });

    // Usar rutas de audio, música, video y Play-DL
    app.use("/audio", audioRoutes);
    app.use("/musica", musicaRoutes);
    app.use("/video", videoRoutes);
    app.use("/playdl-audio", playdlAudioRoutes);

    app.listen(PORT, () => {
      logger.info(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(`Error al iniciar el servidor: ${error.message}`);
  }
}

start();