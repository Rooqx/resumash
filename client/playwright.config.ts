import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
 testDir:'./e2e',
 timeout:60000,
 retries:1,
 use:{baseURL:'http://127.0.0.1:4173',trace:'retain-on-failure'},
 projects:[{name:'chromium',use:{...devices['Desktop Chrome']}}],
 webServer:{
  command:'bun run serve -- --host 127.0.0.1 --port 4173 --strictPort',
  url:'http://127.0.0.1:4173',
  reuseExistingServer:!process.env.CI,
  timeout:60000,
 },
})
