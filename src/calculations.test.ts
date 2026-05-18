import { describe, expect, it } from "vitest";
import { calcProject, openingAreaM2, openingPerimeterM, revealAreaM2 } from "./calculations";
import { createOpening } from "./factories";
import { createVidineevskyProject } from "./presets/vidineevsky";

describe("openingAreaM2", () => {
  it("rectangle window", () => {
    const o = createOpening("window");
    o.widthM = 1.5;
    o.heightM = 1.4;
    expect(openingAreaM2(o)).toBeCloseTo(2.1, 4);
  });

  it("arch with full rectangular height has no semicircle-only bug", () => {
    const o = createOpening("arch");
    o.widthM = 2;
    o.heightM = 2.1;
    o.archRectHeightM = 2.1;
    expect(openingAreaM2(o)).toBeCloseTo(4.2, 4);
  });

  it("semicircular arch when rect height is zero", () => {
    const o = createOpening("arch");
    o.widthM = 2;
    o.heightM = 1;
    o.archRectHeightM = 0;
    expect(openingAreaM2(o)).toBeCloseTo(Math.PI / 2, 4);
  });
});

describe("calcProject Vidineevsky", () => {
  it("matches reference totals within tolerance", () => {
    const calc = calcProject(createVidineevskyProject());
    expect(calc.totals.netM2).toBeGreaterThan(170);
    expect(calc.totals.netM2).toBeLessThan(200);
    expect(calc.totals.totalRevealM2).toBeGreaterThan(14);
    expect(calc.rooms).toHaveLength(7);
  });
});

describe("revealAreaM2", () => {
  it("scales with count", () => {
    const o = createOpening("door");
    o.widthM = 0.9;
    o.heightM = 2.1;
    o.revealDepthM = 0.105;
    o.count = 2;
    const one = revealAreaM2({ ...o, count: 1 });
    expect(revealAreaM2(o)).toBeCloseTo(one * 2, 4);
  });
});

describe("openingPerimeterM arch", () => {
  it("rectangle when no arch segment", () => {
    const o = createOpening("arch");
    o.widthM = 1;
    o.heightM = 2;
    o.archRectHeightM = 2;
    expect(openingPerimeterM(o)).toBeCloseTo(6, 4);
  });
});
