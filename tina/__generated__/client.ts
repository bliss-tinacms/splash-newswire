import { createClient } from "tinacms/dist/client";
import { queries } from "./types.js";
export const client = createClient({ url: 'https://www.splashnewswire.com/tina-content-proxy', token: '23e61af1d530b05eb4287b6b78bfe3ab28935648', queries,  });
export default client;
  