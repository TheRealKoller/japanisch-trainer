// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MasteryProgressBar } from "./MasteryProgressBar";

describe("MasteryProgressBar", () => {
  it("rendert nichts, wenn noch keine Wörter geübt wurden", () => {
    const { container } = render(<MasteryProgressBar mastered={0} learning={0} unseen={10} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("rendert nichts bei einer leeren Lektion (total = 0)", () => {
    const { container } = render(<MasteryProgressBar mastered={0} learning={0} unseen={0} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("rendert trotz fehlender Übung, wenn alwaysShow gesetzt ist (Statistikseite)", () => {
    const { container } = render(<MasteryProgressBar mastered={0} learning={0} unseen={10} alwaysShow />);
    expect(container).not.toBeEmptyDOMElement();
  });

  it("rendert weiterhin nichts bei alwaysShow und einer leeren Lektion (total = 0)", () => {
    const { container } = render(<MasteryProgressBar mastered={0} learning={0} unseen={0} alwaysShow />);
    expect(container).toBeEmptyDOMElement();
  });

  it("zeigt kein Label, wenn showLabel nicht gesetzt ist", () => {
    render(<MasteryProgressBar mastered={5} learning={2} unseen={3} />);
    expect(screen.queryByText(/gut gekannt/)).not.toBeInTheDocument();
  });

  it("zeigt Zahlen als Label, wenn showLabel gesetzt ist", () => {
    render(<MasteryProgressBar mastered={5} learning={2} unseen={3} showLabel />);
    expect(screen.getByText("5 gut gekannt · 2 wird gelernt · 3 nicht gesehen")).toBeInTheDocument();
  });

  it("berechnet die Breite der Zonen proportional zur Gesamtzahl", () => {
    const { container } = render(<MasteryProgressBar mastered={5} learning={5} unseen={0} />);
    expect(container.querySelector(".bg-green-400")).toHaveStyle({ width: "50%" });
    expect(container.querySelector(".bg-orange-400")).toHaveStyle({ width: "50%" });
  });
});
