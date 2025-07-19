// Jest configuration file

module.exports = {
  // Add your Jest configuration here
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Ensure Jest loads the setup file
  testEnvironment: "node", // Use Node.js environment for testing
};