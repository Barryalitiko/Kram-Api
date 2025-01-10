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
    throw new Error("URL inválida");
  }

  const info = await ytdl.getInfo(url);
  return info;
}

/**
 * Selecciona el mejor formato de video disponible.
 * @param {object} formats
 * @returns {object}
 */
function selectBestVideoFormat(formats) {
  const videoFormat = ytdl.chooseFormat(formats, { quality: "highestvideo" });
  if (!videoFormat) {
    throw new Error("No se encontró un formato de video válido");
  }
  return videoFormat;
}

module.exports = {
  validateYouTubeURL,
  getYouTubeVideoInfo,
  selectBestVideoFormat,
};