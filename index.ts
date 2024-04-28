import Elysia, { t } from "elysia";
import { cleanImage } from "./cleanImage";
import { tinyPng } from "./compressImage";
import { processFromBuffer, processFromUrl } from "./processImage";
import { getImage, storeImage } from "./storage";

new Elysia()
  .post(
    "upload",
    async ({ body }) => {
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
    async ({ body }) => {
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
  .listen(3000);
