import { config } from "dotenv"
import { defineConfig } from "prisma/config"

config({ path: ".env.local", override: true })
config({ path: ".env", override: false })

// Prisma 7 CLI config (migrate, generate, studio)
// PrismaClient bağlantısı src/lib/prisma.ts içinde adapter üzerinden yapılır
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
})
