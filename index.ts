import Elysia, { t } from "elysia";
import { processFromBuffer, processFromUrl } from "./processImage";
import { getImage, storeImage } from "./storage";

function verifyBearer(headers: Record<string, string | undefined>) {
  if (!process.env.API_AUTH_TOKEN) {
    throw new Error("API_AUTH_TOKEN is not set");
  }
  console.log(headers.authorization);
  console.log(`Bearer ${process.env.API_AUTH_TOKEN}`);
  if (headers.authorization !== `Bearer ${process.env.API_AUTH_TOKEN}`) {
    throw new Error("Unauthorized");
  }
}

new Elysia()
  .post(
    "upload",
    async ({ body, headers }) => {
      verifyBearer(headers);
      const processed = await processFromBuffer(
        Buffer.from(await body.file.arrayBuffer())
      );
      const uploadedId = await storeImage(processed);
      return { id: uploadedId };
    },
    {
      body: t.Object({
        file: t.File(),
      }),
    }
  )
  .post(
    "from-url",
    async ({ body, headers }) => {
      verifyBearer(headers);
      const processed = await processFromUrl(body.url);
      const uploadedId = await storeImage(processed);
      return { id: uploadedId };
    },
    {
      body: t.Object({
        url: t.String(),
      }),
    }
  )
  .get(
    "asset/:id",
    async ({ params, set }) => {
      set.headers["Content-Type"] = "image/png";
      return await getImage(params.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .listen(3000, (server) => {
    console.log(`Server listening on port ${server.port}`);
  });
