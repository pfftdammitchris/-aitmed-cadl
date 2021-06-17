module.exports = {
  preset: 'jest-puppeteer',
  testEnvironment: 'jsdom',
  // // automock:true,
  // setupFiles: ['jest-localstorage-mock'],
  // modulePaths: ['<rootDir>/node_modules', '<rootDir>/src/'],
  // moduleDirectories: ['<rootDir>/node_modules', '<rootDir>/src/'],
  globals: {
    PATH: 'http://localhost:5000'
  }
}
