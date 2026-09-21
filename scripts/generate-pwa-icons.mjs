import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Minimal pure-JS PNG encoder using Node built-in zlib
function createPNG(width, height, rgbaBuffer) {
  // CRC32 table
  const crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[i] = c >>> 0;
  }

  function crc32(buf) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(4 + 4 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crcVal = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crcVal, 8 + len);
    return buf;
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk: width(4), height(4), bit depth(1=8), color type(1=6: RGBA), compression(1=0), filter(1=0), interlace(1=0)
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // Color type 6 = RGBA
  ihdrData[10] = 0; // Deflate
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // No interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Scanlines with filter byte 0 (None)
  const rowBytes = width * 4;
  const rawScanlines = Buffer.alloc(height * (rowBytes + 1));
  for (let y = 0; y < height; y++) {
    rawScanlines[y * (rowBytes + 1)] = 0; // Filter byte 0
    rgbaBuffer.copy(rawScanlines, y * (rowBytes + 1) + 1, y * rowBytes, (y + 1) * rowBytes);
  }

  const compressedData = zlib.deflateSync(rawScanlines, { level: 9 });
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Render an icon
function generateIconRGBA(size, maskable = false) {
  const buf = Buffer.alloc(size * size * 4);
  const center = size / 2;
  const radius = maskable ? size / 2 : size * 0.44;
  const cornerRadius = size * 0.22;

  // Background: Indigo gradient to dark violet (#4338CA to #6366F1)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      // Rounded rectangle test
      let inBox = true;
      if (!maskable) {
        const pad = size * 0.04;
        const bx = Math.max(pad + cornerRadius, Math.min(size - pad - cornerRadius, x));
        const by = Math.max(pad + cornerRadius, Math.min(size - pad - cornerRadius, y));
        const dist = Math.hypot(x - bx, y - by);
        if (dist > cornerRadius) {
          inBox = false;
        }
      }

      if (inBox) {
        // Gradient from top-left to bottom-right
        const factor = (x + y) / (size * 2);
        // #4f46e5 (79, 70, 229) to #3730a3 (55, 48, 163) or #7c3aed (124, 58, 237)
        const r = Math.round(79 + (124 - 79) * factor);
        const g = Math.round(70 + (58 - 70) * factor);
        const b = Math.round(229 + (237 - 229) * factor);
        buf[idx] = r;
        buf[idx + 1] = g;
        buf[idx + 2] = b;
        buf[idx + 3] = 255;
      } else {
        buf[idx] = 0;
        buf[idx + 1] = 0;
        buf[idx + 2] = 0;
        buf[idx + 3] = 0;
      }
    }
  }

  // Draw Atom / Science / Circuit emblem in white
  // Center circle (nucleus)
  const nucRadius = size * 0.08;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const d = Math.hypot(x - center, y - center);
      if (d <= nucRadius) {
        buf[idx] = 255;
        buf[idx + 1] = 255;
        buf[idx + 2] = 255;
        buf[idx + 3] = 255;
      }
    }
  }

  // Draw 3 orbital ellipses: horizontal, +60 deg, -60 deg
  const angles = [0, Math.PI / 3, -Math.PI / 3];
  const a = size * 0.28; // semi-major axis
  const b = size * 0.11; // semi-minor axis
  const ringThickness = Math.max(2, size * 0.022);

  for (const angle of angles) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        if (buf[idx + 3] === 0) continue; // outside rounded bounds

        // Rotate coordinate back
        const dx = x - center;
        const dy = y - center;
        const rx = dx * cos + dy * sin;
        const ry = -dx * sin + dy * cos;

        // Ellipse equation: (rx/a)^2 + (ry/b)^2 approx 1
        const term = (rx * rx) / (a * a) + (ry * ry) / (b * b);
        const distFromRing = Math.abs(Math.sqrt(term) - 1.0) * b;

        if (distFromRing <= ringThickness) {
          const alpha = Math.min(1.0, Math.max(0, 1 - (distFromRing / ringThickness) * 0.4));
          // blend with white
          const existingAlpha = buf[idx + 3] / 255;
          buf[idx] = Math.round(buf[idx] * (1 - alpha) + 255 * alpha);
          buf[idx + 1] = Math.round(buf[idx + 1] * (1 - alpha) + 255 * alpha);
          buf[idx + 2] = Math.round(buf[idx + 2] * (1 - alpha) + 255 * alpha);
          buf[idx + 3] = 255;
        }
      }
    }
  }

  return buf;
}

const iconsDir = path.resolve('public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate 192x192
const buf192 = generateIconRGBA(192, false);
fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), createPNG(192, 192, buf192));

// Generate 192x192 maskable
const buf192Maskable = generateIconRGBA(192, true);
fs.writeFileSync(path.join(iconsDir, 'icon-192x192-maskable.png'), createPNG(192, 192, buf192Maskable));

// Generate 512x512
const buf512 = generateIconRGBA(512, false);
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), createPNG(512, 512, buf512));

// Generate 512x512 maskable
const buf512Maskable = generateIconRGBA(512, true);
fs.writeFileSync(path.join(iconsDir, 'icon-512x512-maskable.png'), createPNG(512, 512, buf512Maskable));

// Generate 180x180 apple touch icon
const buf180 = generateIconRGBA(180, true);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), createPNG(180, 180, buf180));

console.log('Successfully generated all PWA PNG icons!');
