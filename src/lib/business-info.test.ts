import { describe, expect, it } from "vitest";
import { openingHoursSpecification } from "./business-info";

describe("current winter opening hours", () => {
  it("opens Monday to Friday from 08:00 to 13:00 and 15:00 to 18:00", () => {
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const periods = openingHoursSpecification.filter((period) =>
      weekdays.every((day) => (period.dayOfWeek as readonly string[]).includes(day)),
    );
    expect(periods.map(({ opens, closes }) => ({ opens, closes }))).toEqual([
      { opens: "08:00", closes: "13:00" },
      { opens: "15:00", closes: "18:00" },
    ]);
  });

  it("opens Saturdays from 09:00 to 13:00", () => {
    const periods = openingHoursSpecification.filter((period) =>
      (period.dayOfWeek as readonly string[]).includes("Saturday"),
    );
    expect(periods.map(({ opens, closes }) => ({ opens, closes }))).toEqual([
      { opens: "09:00", closes: "13:00" },
    ]);
  });
});