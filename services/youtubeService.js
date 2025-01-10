const ytdl = require("ytdl-core");

/**
 * Valida si la URL proporcionada es un enlace válido de YouTube.
 * @param {string} url
 * @returns {boolean}
 */
function validateYouTubeURL(url) {
  return ytdl.validateURL(url);
}

/**
 * Obtiene información detallada sobre un video de YouTube.
 * @param {string} url
 * @returns {Promise<object>}
 */
async function getYouTubeVideoInfo(url) {
  if (!validateYouTubeURL(url)) {
    throw new Error("URL inválida o no es un video de YouTube");
  }

  try {
    console.log(`Intentando obtener información del video: ${url}`);
    const info = await ytdl.getInfo(url);
    console.log("Información del video obtenida con éxito:", info.videoDetails.title);
    return info;
  } catch (error) {
    console.error("Error al obtener información del video:", error.message);
    throw new Error("Error al procesar el video. Verifica si la URL es válida.");
  }
}

/**
 * Selecciona el mejor formato de video disponible.
 * @param {object} formats
 * @returns {object}
 */
function selectBestVideoFormat(formats) {
  try {
    const videoFormat = ytdl.chooseFormat(formats, { quality: "highestvideo" });
    if (!videoFormat) {
      throw new Error("No se encontró un formato de video válido");
    }
    console.log("Formato de video seleccionado:", videoFormat.mimeType);
    return videoFormat;
  } catch (error) {
    console.error("Error al seleccionar el formato de video:", error.message);
    throw error;
  }
}

module.exports = {
  validateYouTubeURL,
  getYouTubeVideoInfo,
  selectBestVideoFormat,
};