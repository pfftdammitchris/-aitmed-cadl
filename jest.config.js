module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // automock:true,
  setupFiles: ['jest-localstorage-mock'],
  modulePaths: ['<rootDir>/node_modules', '<rootDir>/src/'],
  moduleDirectories: ['<rootDir>/node_modules', '<rootDir>/src/']
}
