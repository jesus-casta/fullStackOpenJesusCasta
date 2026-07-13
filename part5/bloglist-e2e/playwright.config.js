const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:5173',
  },
  webServer: [
    {
      command: 'npm run start:test',
      cwd: '../../part4/bloglist',
      url: 'http://127.0.0.1:3003/api/blogs',
      reuseExistingServer: false,
      timeout: 120000,
    },
    {
      command: 'npm run dev -- --host 127.0.0.1',
      cwd: '../bloglist-frontend',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: false,
      timeout: 120000,
    },
  ],
})
