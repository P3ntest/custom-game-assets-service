import Jimp from "jimp";
import { cleanImage } from "./cleanImage";
import { tinyPng } from "./compressImage";

async function processJimp(input: Jimp) {
  const png = await cleanImage(input);
  const compressed = await tinyPng(png);
  return compressed;
}

export async function processFromBuffer(input: Buffer) {
  return processJimp(await Jimp.read(input));
}

export async function processFromUrl(url: string) {
  return processJimp(await Jimp.read(url));
}
