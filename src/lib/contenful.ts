import { createClient } from "contentful";

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

if (!spaceId || !accessToken) {
  console.warn(
    "Contentful environment variables (CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN) are missing."
  );
}

export const contentfulClient = createClient({
  space: spaceId || "",
  accessToken: accessToken || "",
});