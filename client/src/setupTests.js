import '@testing-library/jest-dom';
import { jestPreviewConfigure } from 'jest-preview'
// TODO: To add your global css here
import './index.css';

global.window = {}
global.window = global

module.exports = {
  setupFilesAfterEnv: ["<rootDir>/setup.js"] // or .ts for TypeScript App
  // ...other settings
};

jestPreviewConfigure({
  // Opt-in to automatic mode to preview failed test case automatically.
  autoPreview: true,
})
