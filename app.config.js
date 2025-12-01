// app.config.js
import 'dotenv/config'; // Import dotenv to load environment variables

export default ({ config }) => {
  return {
    ...config,
    // Ensure that the 'extra' field includes the public key
    extra: {
      ...config.extra,
      EXPO_PUBLIC_GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
    },
  };
};