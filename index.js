const express = require("express");
const path = require("path");
const fs = require("fs"); // Para leer los archivos
const { exec } = require("child_process"); // Para ejecutar comandos de terminal
const logger = require("./utils/logger"); // Si usas un logger
const audioRoutes = require("./routes/audio");
const musicaRoutes = require("./routes/musica");
const videoRoutes = require("./routes/video");
const playdlAudioRoutes = require("./routes/playdlAudio");

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

        // Generamos un listado HTML con los archivos
        const fileList = files
          .map((file) => {
            return `<li><a href="/${file}" target="_blank">${file}</a></li>`;
          })
          .join("");

        // Enviamos la respuesta con el listado de archivos
        res.send(`
  <html>
    <head>
      <title>Archivos en Public</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
        }
        h1 {
          color: #00698f;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        li {
          padding: 10px;
          border-bottom: 1px solid #ccc;
        }
        li:last-child {
          border-bottom: none;
        }
        a {
          text-decoration: none;
          color: #00698f;
        }
        a:hover {
          color: #003d5d;
        }
      </style>
    </head>
    <body>
      <h1>Archivos en la carpeta 'public':</h1>
      <ul>
        ${fileList}
      </ul>
    </body>
  </html>
`);
      });
    });

    // Prueba de yt-dlp: descargar un video al iniciar el servidor
    const downloadVideo = async () => {
      const videoUrl = "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"; // Cambia esto por un ID real
      const outputFilePath = path.join(__dirname, "public", "video_prueba.mp4");

      logger.info("Iniciando prueba de yt-dlp...");
      exec(
        `yt-dlp -f best -o "${outputFilePath}" ${videoUrl}`,
        (error, stdout, stderr) => {
          if (error) {
            logger.error(`Error al descargar el video: ${error.message}`);
            return;
          }
          if (stderr) {
            logger.warn(`Advertencia durante la descarga: ${stderr}`);
          }
          logger.info("Video descargado con éxito y almacenado en 'public'.");
        }
      );
    };

    // Llamamos a la función de prueba
    await downloadVideo();

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