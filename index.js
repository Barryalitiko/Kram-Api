const express = require("express");
const path = require("path");
const fs = require("fs"); // Para leer los archivos
const logger = require("./utils/logger"); // Logger personalizado
const audioRoutes = require("./routes/audio");
const musicaRoutes = require("./routes/musica");
const videoRoutes = require("./routes/video"); // Ruta para videos
const playdlAudioRoutes = require("./routes/playdlAudio");
const cleanPublicFolder = require("./utils/cleaner"); // Limpieza automática

async function start() {
  try {
    const app = express();
    const PORT = process.env.PORT || 4000;

    // Servir archivos estáticos desde la carpeta 'public'
    app.use(express.static(path.join(__dirname, "public")));

    app.use(express.json());

    // Ruta principal
    app.get("/", (req, res) => {
      logger.info("Operacion Marshall");
      res.json({ message: "Krampus OM bot" });
    });

    // Ruta para ver los archivos en la carpeta public
    app.get("/public-files", (req, res) => {
      const publicDir = path.join(__dirname, "public");
      fs.readdir(publicDir, (err, files) => {
        if (err) {
          return res.status(500).send("No se pudieron leer los archivos.");
        }

        const fileList = files
          .map((file) => `<li><a href="/${file}" target="_blank">${file}</a></li>`)
          .join("");

        res.send(`
          <html>
            <head>
              <title>Archivos en Public</title>
              <style>
                body { font-family: Arial, sans-serif; background-color: #f0f0f0; }
                h1 { color: #00698f; }
                ul { list-style: none; padding: 0; margin: 0; }
                li { padding: 10px; border-bottom: 1px solid #ccc; }
                li:last-child { border-bottom: none; }
                a { text-decoration: none; color: #00698f; }
                a:hover { color: #003d5d; }
              </style>
            </head>
            <body>
              <h1>Archivos en la carpeta 'public':</h1>
              <ul>${fileList}</ul>
            </body>
          </html>
        `);
      });
    });

    // Rutas de audio, música, video y Play-DL
    app.use("/audio", audioRoutes);
    app.use("/musica", musicaRoutes);
    app.use("/video", videoRoutes);
    app.use("/playdl-audio", playdlAudioRoutes);

    // Ejecutar limpieza de la carpeta 'public' cada 5 minutos
    setInterval(cleanPublicFolder, 5 * 60 * 1000);

    // Iniciar servidor
    app.listen(PORT, () => {
      logger.info(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(`Error al iniciar el servidor: ${error.message}`);
  }
}

start();