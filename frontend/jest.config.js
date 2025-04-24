module.exports = {
  transformIgnorePatterns: [
    'node_modules/(?!(@mui|react-router-dom|@mui/x-date-pickers|date-fns)/)'
  ],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest' // Ensure Babel is used for transforming JS/JSX
  },
  moduleNameMapper: {
    // Add any necessary mocks or custom mappings here
  }
}
