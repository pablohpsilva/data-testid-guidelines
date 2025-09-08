import { describe, it, expect, vi } from "vitest";
import { withAutoTestId } from "../index";

describe("withAutoTestId", () => {
  it("should return a Next.js config with webpack configuration", () => {
    const baseConfig = {
      reactStrictMode: true,
    };

    const result = withAutoTestId(baseConfig, { enabled: true });

    expect(result).toEqual({
      reactStrictMode: true,
      webpack: expect.any(Function),
    });
  });

  it("should preserve existing webpack configuration", () => {
    const existingWebpackConfig = vi.fn((config) => {
      config.customProperty = "test";
      return config;
    });

    const baseConfig = {
      webpack: existingWebpackConfig,
    };

    const result = withAutoTestId(baseConfig, { enabled: true });

    // Mock webpack context
    const mockConfig = { module: { rules: [] } };
    const mockContext = { dev: true };

    const newConfig = result.webpack!(mockConfig, mockContext);

    expect(existingWebpackConfig).toHaveBeenCalledWith(mockConfig, mockContext);
    expect(newConfig.customProperty).toBe("test");
    expect(newConfig.module.rules).toHaveLength(1);
  });

  it("should add loader rule in development mode", () => {
    const config = withAutoTestId({}, { enabled: true });

    const mockConfig = { module: { rules: [] } };
    const mockContext = { dev: true };

    const result = config.webpack!(mockConfig, mockContext);

    expect(result.module.rules).toHaveLength(1);
    expect(result.module.rules[0]).toEqual({
      test: /\.(jsx?|tsx?)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: expect.stringContaining("loader"),
          options: { enabled: true },
        },
      ],
      enforce: "pre",
    });
  });

  it("should not add loader rule when disabled", () => {
    const config = withAutoTestId({}, { enabled: false });

    const mockConfig = { module: { rules: [] } };
    const mockContext = { dev: true };

    const result = config.webpack!(mockConfig, mockContext);

    expect(result.module.rules).toHaveLength(0);
  });

  it("should not add loader rule in production mode by default", () => {
    const config = withAutoTestId({}, {});

    const mockConfig = { module: { rules: [] } };
    const mockContext = { dev: false };

    const result = config.webpack!(mockConfig, mockContext);

    expect(result.module.rules).toHaveLength(0);
  });

  it("should add loader rule in production when explicitly enabled", () => {
    const config = withAutoTestId({}, { enabled: true });

    const mockConfig = { module: { rules: [] } };
    const mockContext = { dev: false };

    const result = config.webpack!(mockConfig, mockContext);

    expect(result.module.rules).toHaveLength(1);
  });
});
