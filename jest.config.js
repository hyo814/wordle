module.exports = {
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest'],
  },
  modulePaths: ['<rootDir>/src/'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!axios)/'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testTimeout: 10000,
  testEnvironment: 'jsdom',
};
