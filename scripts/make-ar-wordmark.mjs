import sharp from "sharp";

const SRC = "public/brand/wajjeha-text.png";
const OUT = "public/brand/wajjeha-ar.png";

// Letter color for the hero (ink). For the Wajjeha blue instead: [79, 179, 255]
const INK = [11, 14, 19];

// After the first run the report lists the stacked text lines ("bands").
// If there is more than one, set BAND to the index of the Arabic line and rerun.
// For side-by-side elements, set CROP = { left, top, width, height } in pixels.
const BAND = 1;
const CROP = null;

let pipe = sharp(SRC).ensureAlpha();
if (CROP) pipe = pipe.extract(CROP);

const { data, info } = await pipe.raw().toBuffer({ resolveWithObject: true });

// 1) white background -> transparent, letters -> INK
for (let i = 0; i < data.length; i += info.channels) {
  const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
  const a = data[i + 3];
  data[i] = INK[0]; data[i + 1] = INK[1]; data[i + 2] = INK[2];
  data[i + 3] = Math.round((a * (255 - lum)) / 255);
}

// 2) rows containing visible pixels -> content bands
const rowHas = [];
for (let y = 0; y < info.height; y++) {
  rowHas.push(false);
  for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * info.channels + 3] > 24) { rowHas[y] = true; break; }
  }
}
const bands = [];
let s = -1;
for (let y = 0; y <= info.height; y++) {
  const on = y < info.height && rowHas[y];
  if (on && s < 0) s = y;
  if (!on && s >= 0) { bands.push({ top: s, height: y - s }); s = -1; }
}

// 3) chosen region: one band, or the whole image
const region = BAND !== null && bands[BAND] ? bands[BAND] : { top: 0, height: info.height };

// 4) horizontal bounds inside the region
let minX = info.width, maxX = -1;
for (let y = region.top; y < region.top + region.height; y++) {
  for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * info.channels + 3] > 24) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
    }
  }
}
if (maxX < minX) { minX = 0; maxX = info.width - 1; }

const out = { left: minX, top: region.top, width: maxX - minX + 1, height: region.height };

await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
  .extract(out).png().toFile(OUT);

console.log("wrote " + OUT + " — " + out.width + "x" + out.height + "px");
console.log("content bands found: " + bands.length);
bands.forEach((b, i) => console.log("  band " + i + " — top " + b.top + "px, height " + b.height + "px"));
console.log("Hero <Image> props:  width={" + out.width + "} height={" + out.height + "}");
