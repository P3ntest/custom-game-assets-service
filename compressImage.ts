import { $ } from "bun";

export async function tinyPng(input: Buffer) {
  console.log("Compressing image...");
  //   const compressor = new PngQuant(["256", "--speed", "1"]);

  const buffer = await $`pngquant 256 --speed 1 - < ${input}`.arrayBuffer();
  console.log(`Compressed from ${input.byteLength} to ${buffer.byteLength}`);
  return Buffer.from(buffer);
}
