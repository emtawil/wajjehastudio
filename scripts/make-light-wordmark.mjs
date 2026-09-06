import sharp from "sharp";

const SRC = "public/brand/wajjeha-text.png";
const OUT = "public/brand/wajjeha-text-light.png";

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

let opaque = 0;
for (let i = 0; i < data.length; i += info.channels) {
  const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
  const a = data[i + 3];
  data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;   // pure white letters
  data[i + 3] = Math.round((a * (255 - lum)) / 255);      // white bg -> transparent
  if (data[i + 3] > 128) opaque++;
}

await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
  .png().toFile(OUT);

console.log("wrote " + OUT + " — " + info.width + "x" + info.height + "px");
console.log("opaque letter coverage: " + ((opaque / (info.width * info.height)) * 100).toFixed(1) + "%");
