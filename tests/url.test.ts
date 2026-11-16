import { describe, it, expect } from "vitest";
import { publicAppUrl, urlPublique } from "@/lib/url";

describe("publicAppUrl", () => {
  it("retire la barre oblique finale", () => {
    expect(publicAppUrl({ PUBLIC_APP_URL: "https://bos.example/" })).toBe("https://bos.example");
  });
  it("refuse une variable absente plutot que de deviner", () => {
    expect(() => publicAppUrl({})).toThrow(/PUBLIC_APP_URL/);
  });
  it("construit une URL absolue depuis un chemin avec ou sans barre", () => {
    const env = { PUBLIC_APP_URL: "https://bos.example" };
    expect(urlPublique("/api/health", env)).toBe("https://bos.example/api/health");
    expect(urlPublique("api/health", env)).toBe("https://bos.example/api/health");
  });
});
