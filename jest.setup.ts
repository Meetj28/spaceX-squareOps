import '@testing-library/jest-dom';
// Basic global.fetch mock placeholder — tests will override it as needed.
if (!(global as any).fetch) {
  (global as any).fetch = jest.fn();
}

// Mock next/link to just render children (prevents Next Link errors in tests)
jest.mock("next/link", () => {
  return ({ children }: any) => children;
});
