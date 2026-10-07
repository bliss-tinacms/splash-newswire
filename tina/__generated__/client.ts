import { createClient } from "tinacms/dist/client";
import { queries } from "./types.js";
export const client = createClient({ cacheDir: '/tmp/splash-newswire/tina/__generated__/.cache/1791391753191', url: 'https://content.tinajs.io/2.4/content/5e1c5147-79ba-43bb-9a90-e390b48103ba/github/main', token: '23e61af1d530b05eb4287b6b78bfe3ab28935648', queries,  });
export default client;
  