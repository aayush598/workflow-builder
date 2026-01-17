import { defineConfig } from "prisma/config";

// Load environment variables
if (!process.env.DATABASE_URL) {
    process.loadEnvFile();
}

export default defineConfig({
    schema: "prisma/schema.prisma",

    datasource: {
        url: process.env.DATABASE_URL!,
    },
});
