import { type RenderOptions, render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

const AllTheProviders = ({ children }: { children: ReactNode }) => {
	return <>{children}</>;
};
const customRender = (
	ui: ReactElement,
	options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

// export * from "@testing-library/react";
export { customRender as render };
