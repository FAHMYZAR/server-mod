import { describe, expect, it } from "vitest";
import { money, roleName } from "./format.js";

describe("format helpers", () => {
  it("maps legacy role values", () => {
    expect(roleName(1)).toBe("Admin");
    expect(roleName(2)).toBe("Reseller");
  });
  it("formats balances", () => {
    expect(money(5)).toBe("$5");
    expect(money(0.3)).toBe("$0.30");
  });
});
