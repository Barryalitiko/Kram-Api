const fs = require("fs");
const path = require("path");

// Configuración
const PUBLIC_FOLDER = path.join(__dirname, "../public");
const MAX_FILE_AGE = 15 * 60 * 1000; // 15 minutos en milisegundos

// Función para limpiar archivos viejos
function cleanOldFiles() {
  console.log(`[${new Date().toLocaleTimeString()}] Iniciando limpieza en 'public'...`);

  fs.readdir(PUBLIC_FOLDER, (err, files) => {
    if (err) {
      console.error("Error al leer la carpeta 'public':", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(PUBLIC_FOLDER, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error al obtener información del archivo ${file}:`, err);
          return;
        }

        const fileAge = Date.now() - stats.mtimeMs;

        if (fileAge > MAX_FILE_AGE) {
          fs.unlink(filePath, (