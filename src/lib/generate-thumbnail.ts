const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
];

/**
 * Generates a random gradient SVG as a base64 data URL
 * @param {number} width - Width of the SVG (default: 300)
 * @param {number} height - Height of the SVG (default: 200)
 * @param {boolean} includeDecorations - Whether to include decorative elements (default: true)
 * @returns {string} Base64 encoded SVG data URL
 */
function generateRandomGradientSVG(width = 300, height = 200, includeDecorations = true) {
  // Select a random gradient
  const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

  // Extract colors from the gradient string
  const colorMatches = randomGradient.match(/#[a-fA-F0-9]{6}/g);

  // Fallback colors in case regex fails
  if (!colorMatches || colorMatches.length < 2) {
    throw new Error('Invalid gradient format: unable to extract colors');
  }

  const startColor = colorMatches[0];
  const endColor = colorMatches[1];

  // Optional decorative elements
  const decorations = includeDecorations
    ? `
    <circle cx="${width / 2}" cy="${height / 2}" r="30" fill="white" opacity="0.8" />
    <path d="M${width / 2 - 10} ${height / 2 - 10} L${width / 2 + 10} ${height / 2 - 10} L${
        width / 2 + 10
      } ${height / 2 + 10} L${width / 2 - 10} ${height / 2 + 10} Z" fill="white" opacity="0.6" />
  `
    : '';

  // Create SVG content
  const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${startColor};" />
          <stop offset="100%" style="stop-color:${endColor};" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
      ${decorations}
    </svg>
  `;

  // Return as base64 data URL
  return `data:image/svg+xml;base64,${btoa(svgContent)}`;
}

// Example usage:
// const thumbnail = generateRandomGradientSVG();
// const largeThumbnail = generateRandomGradientSVG(400, 300);
// const simpleThumbnail = generateRandomGradientSVG(300, 200, false);

// Export for use in modules
export { generateRandomGradientSVG, gradients };
