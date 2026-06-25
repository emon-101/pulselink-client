import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: mongodbAdapter(db, {
    client,
  }),
  plugins:[
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
        }),
      },
    }),
  ],
  user: {
    additionalFields: {
      // Set by the user during registration (sent in the signUp.email body)
      bloodGroup: {
        type: "string",
        required: true,
        input: true,
      },
      district: {
        type: "string",
        required: true,
        input: true,
      },
      upazila: {
        type: "string",
        required: true,
        input: true,
      },
      // Server-controlled — not settable by the client at signup.
      // `input: false` means Better Auth ignores any value a client tries
      // to pass for this field and always falls back to defaultValue.
      role: {
        type: "string",
        required: false,
        defaultValue: "donor",
        input: false,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "active",
        input: false,
      },
    },
  },
});
