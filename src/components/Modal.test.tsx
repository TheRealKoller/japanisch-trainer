// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("zeigt die Kinder-Elemente an", () => {
    render(<Modal onClose={vi.fn()} label="Test-Dialog">Inhalt</Modal>);
    expect(screen.getByText("Inhalt")).toBeInTheDocument();
  });

  it("schließt bei Klick auf den X-Button", () => {
    const onClose = vi.fn();
    render(<Modal onClose={onClose} label="Test-Dialog">Inhalt</Modal>);
    fireEvent.click(screen.getByLabelText("Schließen"));
    expect(onClose).toHaveBeenCalled();
  });

  it("schließt bei Klick außerhalb des Dialogs", () => {
    const onClose = vi.fn();
    render(<Modal onClose={onClose} label="Test-Dialog">Inhalt</Modal>);
    fireEvent.pointerDown(screen.getByRole("dialog").parentElement!);
    expect(onClose).toHaveBeenCalled();
  });

  it("schließt nicht bei Klick innerhalb des Dialogs", () => {
    const onClose = vi.fn();
    render(<Modal onClose={onClose} label="Test-Dialog">Inhalt</Modal>);
    fireEvent.pointerDown(screen.getByText("Inhalt"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("schließt bei Escape-Taste", () => {
    const onClose = vi.fn();
    render(<Modal onClose={onClose} label="Test-Dialog">Inhalt</Modal>);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("hat einen zugänglichen Namen und fokussiert sich beim Öffnen selbst", () => {
    render(<Modal onClose={vi.fn()} label="Test-Dialog">Inhalt</Modal>);
    const dialog = screen.getByRole("dialog", { name: "Test-Dialog" });
    expect(dialog).toHaveFocus();
  });

  it("hält den Fokus per Tab innerhalb des Dialogs (Fokus-Trap)", () => {
    render(
      <Modal onClose={vi.fn()} label="Test-Dialog">
        <button>Aktion</button>
      </Modal>,
    );
    const closeButton = screen.getByLabelText("Schließen");
    const actionButton = screen.getByText("Aktion");

    actionButton.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(actionButton).toHaveFocus();
  });
});
