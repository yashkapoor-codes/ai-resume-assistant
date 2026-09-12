// @vitest-environment jsdom

import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, test, vi, afterEach } from "vitest";
import App from "./App";

afterEach(() => {
  vi.restoreAllMocks();
});

const resumeText =
  "John Doe is a Computer Science student with Python, React, JavaScript, SQL and web development project experience.";

describe("AI Resume Assistant", () => {
  test("renders the application", () => {
    const { container } = render(<App />);

    expect(container.querySelector("h1")).toBeInTheDocument();
    expect(container.querySelector("textarea")).toBeInTheDocument();
    expect(container.querySelectorAll("button").length).toBeGreaterThan(0);
  });

  test("shows error for empty resume", () => {
    const { container } = render(<App />);

    const button = container.querySelector(".analyze-button");
    fireEvent.click(button);

    expect(container.querySelector('[role="alert"]')).toHaveTextContent(
      "Please paste your resume before analyzing."
    );
  });

  test("shows error for short resume", () => {
    const { container } = render(<App />);

    const textarea = container.querySelector("textarea");
    const button = container.querySelector(".analyze-button");

    fireEvent.change(textarea, {
      target: { value: "Short resume" },
    });

    fireEvent.click(button);

    expect(container.querySelector('[role="alert"]')).toHaveTextContent(
      "Please enter at least 50 characters of resume content."
    );
  });

  test("shows clear button and clears resume", () => {
    const { container } = render(<App />);

    const textarea = container.querySelector("textarea");

    fireEvent.change(textarea, {
      target: { value: resumeText },
    });

    const buttons = container.querySelectorAll("button");
    const clearButton = Array.from(buttons).find(
      (button) => button.textContent === "Clear"
    );

    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);

    expect(textarea).toHaveValue("");
  });

  test("shows loading state during analysis", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {}))
    );

    const { container } = render(<App />);

    const textarea = container.querySelector("textarea");
    const button = container.querySelector(".analyze-button");

    fireEvent.change(textarea, {
      target: { value: resumeText },
    });

    fireEvent.click(button);

    expect(container.textContent).toContain("Analyzing your resume...");
  });

  test("displays successful AI analysis", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          analysis: {
            summary: "Strong technical foundation.",
            strengths: ["React", "Python"],
            weaknesses: ["Limited experience"],
            missingKeywords: ["TypeScript"],
            suggestions: ["Add measurable achievements"],
          },
        }),
      })
    );

    const { container } = render(<App />);

    fireEvent.change(container.querySelector("textarea"), {
      target: { value: resumeText },
    });

    fireEvent.click(container.querySelector(".analyze-button"));

    await waitFor(() => {
      expect(container.textContent).toContain("Your Resume Analysis");
    });

    expect(container.textContent).toContain("Strong technical foundation.");
    expect(container.textContent).toContain("React");
    expect(container.textContent).toContain("Limited experience");
    expect(container.textContent).toContain("TypeScript");
  });

  test("handles failed AI request", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          error: "AI service unavailable",
        }),
      })
    );

    const { container } = render(<App />);

    fireEvent.change(container.querySelector("textarea"), {
      target: { value: resumeText },
    });

    fireEvent.click(container.querySelector(".analyze-button"));

    await waitFor(() => {
      expect(container.querySelector('[role="alert"]')).toHaveTextContent(
        "AI service unavailable"
      );
    });
  });
});