import nextEnv from "@next/env";

// Match production builds when tools run outside the Next.js CLI.
nextEnv.loadEnvConfig(process.cwd(), false);
