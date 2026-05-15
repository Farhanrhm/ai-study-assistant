import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SubjectSelector from "@/components/SubjectSelector";
import { Subject } from "@/types/index";

describe("SubjectSelector", () => {
  it("renders a select element with aria-label", () => {
    render(
      <SubjectSelector value="Mathematics" onChange={vi.fn()} disabled={false} />
    );
    const select = screen.getByRole("combobox", { name: /select a study subject/i });
    expect(select).toBeInTheDocument();
  });

  it("renders all 7 subject options", () => {
    render(
      <SubjectSelector value="Mathematics" onChange={vi.fn()} disabled={false} />
    );
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(7);
  });

  it("shows the current value as selected", () => {
    render(
      <SubjectSelector value="Physics" onChange={vi.fn()} disabled={false} />
    );
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("Physics");
  });

  it("calls onChange with the new subject when selection changes", () => {
    const onChange = vi.fn();
    render(
      <SubjectSelector value="Mathematics" onChange={onChange} disabled={false} />
    );
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Chemistry" } });
    expect(onChange).toHaveBeenCalledWith("Chemistry");
  });

  it("is disabled when disabled prop is true", () => {
    render(
      <SubjectSelector value="Mathematics" onChange={vi.fn()} disabled={true} />
    );
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.disabled).toBe(true);
  });
});
