import type { Collection } from "tinacms";

export const UserCollection: Collection = {
  name: "user",
  label: "Users",
  path: "src/content/user",
  format: "json",
  ui: {
    router({ document }) {
      return `/users/${document._sys.filename}`;
    },
  },
  fields: [
    {
      type: "string",
      name: "name",
      label: "Name",
      isTitle: true,
      required: true,
    },
    {
      type: "string",
      name: "role",
      label: "Role / Title",
    },
    {
      type: "image",
      name: "avatar",
      label: "Avatar",
    },
    {
      type: "string",
      name: "bio",
      label: "Bio",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "string",
      name: "email",
      label: "Email",
    },
  ],
};
