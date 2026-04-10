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

  // set canvas size to match the crop area
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // Apply filters if provided
  if (filters) {
    const { brightness = 100, contrast = 100, saturation = 100, blur = 0, preset = '' } = filters;
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) ${preset}`;
  }

  // draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      resolve(file)
    }, 'image/jpeg')
  })
}
