import * as Minio from "minio";

const client = new Minio.Client({
  endPoint: process.env.S3_ENDPOINT!,
  accessKey: process.env.S3_ACCESS_KEY!,
  secretKey: process.env.S3_SECRET_KEY!,
});
const bucket = process.env.S3_BUCKET!;

if (!(await client.bucketExists(bucket))) {
  await client.makeBucket(bucket);
}

function genId() {
  return Math.random().toString(36).substring(2);
}

export async function storeImage(buffer: Buffer) {
  console.log("Storing image...");
  const id = genId();
  await client.putObject(bucket, id, buffer);
  return id;
}

export async function getImage(id: string) {
  console.log("Retrieving image...");
  const readable = await client.getObject(bucket, id);
  let buffers: Buffer[] = [];
  for await (const chunk of readable) {
    buffers.push(chunk);
  }
  return Buffer.concat(buffers);
}
