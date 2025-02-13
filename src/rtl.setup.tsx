import { type RenderOptions, render } from "@testing-library/react";
/* eslint-disable react-refresh/only-export-components */
import type React from "react";
import type { ReactElement } from "react";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
	return <>{children}</>;
};

const customRender = (
	ui: ReactElement,
	options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

export { customRender as render };
