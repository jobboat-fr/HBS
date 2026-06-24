import createImageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./client";

const builder = createImageUrlBuilder(sanityClient);

export function urlForImage(source: unknown) {
  return builder.image(source as Parameters<typeof builder.image>[0]);
}
