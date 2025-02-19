import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";

// cleans up `render` after each test
afterEach(() => {
	cleanup();
});
