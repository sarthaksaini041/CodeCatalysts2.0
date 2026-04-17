/**
 * Create an image element from a URL
 * @param {string} url 
 * @returns {Promise<HTMLImageElement>}
 */
export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues
    image.src = url
  })

/**
 * Get cropped image as a Blob
 * @param {string} imageSrc 
 * @param {Object} pixelCrop 
 * @param {Object} filters
 * @returns {Promise<Blob>}
 */
export default async function getCroppedImg(imageSrc, pixelCrop, filters = {}) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  // Define max dimensions for optimized storage (1200px)
  const MAX_SIZE = 1200;
  let targetWidth = pixelCrop.width;
  let targetHeight = pixelCrop.height;

  // Scale down if exceeding max size while maintaining aspect ratio
  if (targetWidth > MAX_SIZE || targetHeight > MAX_SIZE) {
    const ratio = Math.min(MAX_SIZE / targetWidth, MAX_SIZE / targetHeight);
    targetWidth = Math.round(targetWidth * ratio);
    targetHeight = Math.round(targetHeight * ratio);
  }

  // set canvas size to match the optimized dimensions
  canvas.width = targetWidth
  canvas.height = targetHeight

  // Apply filters if provided
  if (filters) {
    const { brightness = 100, contrast = 100, saturation = 100, blur = 0, preset = '' } = filters;
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) ${preset}`;
  }

  // draw the cropped and potentially downscaled image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetWidth,
    targetHeight
  )

  // As a blob — compressed WebP for best performance
  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (!file) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(file)
    }, 'image/webp', 0.8) // 0.8 quality is the sweet spot for web
  })
}
