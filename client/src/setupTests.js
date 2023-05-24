import '@testing-library/jest-dom';

global.window = {}
global.window = global

module.exports = {
  setupFilesAfterEnv: ["<rootDir>/setup.js"] // or .ts for TypeScript App
  // ...other settings
};
