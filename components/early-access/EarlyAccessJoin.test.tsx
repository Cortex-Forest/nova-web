import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { EarlyAccessJoin } from "./EarlyAccessJoin";

/** 便捷：填写合法 email + 勾选类型 + 同意 terms */
function fillValidForm() {
  fireEvent.change(screen.getByLabelText(/Email/i), {
    target: { value: "user@example.com" },
  });
  fireEvent.click(screen.getByRole("checkbox", { name: "Creator" }));
  fireEvent.click(
    screen.getByRole("checkbox", {
      name: "I agree to receive Nova project updates.",
    }),
  );
}

function mockFetchResponse(overrides: { ok: boolean; status: number }) {
  const fetchMock = vi.fn(async () => overrides);
  vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);
  return fetchMock;
}

describe("EarlyAccessJoin", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders participation cards and the registration form", () => {
    render(<EarlyAccessJoin />);
    expect(
      screen.getByRole("heading", { name: /Choose how you want to join/i }),
    ).toBeInTheDocument();
    for (const name of ["Creator", "Node Operator", "Developer", "Community"]) {
      expect(screen.getByRole("checkbox", { name })).toBeInTheDocument();
    }
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Join Early Access" }),
    ).toBeInTheDocument();
  });

  it("cards and checkboxes share selection state", () => {
    render(<EarlyAccessJoin />);
    // 点击顶部卡片按钮
    fireEvent.click(screen.getByRole("button", { name: /Creator/ }));
    // 对应 checkbox 同步选中
    const box = screen.getByRole("checkbox", {
      name: "Creator",
    }) as HTMLInputElement;
    expect(box.checked).toBe(true);
  });

  it("client validation: empty email", () => {
    render(<EarlyAccessJoin />);
    fireEvent.click(
      screen.getByRole("button", { name: "Join Early Access" }),
    );
    expect(screen.getByText("Please enter your email.")).toBeInTheDocument();
  });

  it("client validation: invalid email", () => {
    render(<EarlyAccessJoin />);
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Join Early Access" }),
    );
    expect(
      screen.getByText("Please enter a valid email address."),
    ).toBeInTheDocument();
  });

  it("client validation: no participation type selected", () => {
    render(<EarlyAccessJoin />);
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Join Early Access" }),
    );
    expect(
      screen.getByText("Select at least one area of interest."),
    ).toBeInTheDocument();
  });

  it("client validation: terms must be agreed", () => {
    render(<EarlyAccessJoin />);
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: "Creator" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Join Early Access" }),
    );
    expect(
      screen.getByText(/Please confirm you’re happy to receive/i),
    ).toBeInTheDocument();
  });

  it("success: shows 'You're on the list' with actions", async () => {
    mockFetchResponse({ ok: true, status: 200 });
    render(<EarlyAccessJoin />);
    fillValidForm();
    fireEvent.click(
      screen.getByRole("button", { name: "Join Early Access" }),
    );
    expect(await screen.findByRole("heading", { name: /on the list/i }))
      .toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Back to Nova/i }),
    ).toHaveAttribute("href", "/");
    expect(
      screen.getByRole("link", { name: /Explore Technology/i }),
    ).toHaveAttribute("href", "/technology");
  });

  it("sends the correct minimal payload to /api/early-access", async () => {
    let captured: RequestInit | undefined;
    const fetchMock = vi.fn(
      async (_input: RequestInfo | URL, init?: RequestInit) => {
        captured = init;
        return { ok: true, status: 200 };
      },
    );
    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);
    render(<EarlyAccessJoin />);
    fireEvent.change(screen.getByLabelText(/Country/i), {
      target: { value: "Singapore" },
    });
    fillValidForm();
    fireEvent.click(
      screen.getByRole("button", { name: "Join Early Access" }),
    );
    await screen.findByRole("heading", { name: /on the list/i });

    expect(fetchMock).toHaveBeenCalledWith("/api/early-access", expect.anything());
    const sent = JSON.parse((captured?.body ?? "") as string);
    expect(sent.email).toBe("user@example.com");
    expect(sent.participationTypes).toContain("creator");
    expect(sent.country).toBe("Singapore");
    expect(sent).not.toHaveProperty("password");
    expect(sent).not.toHaveProperty("wallet");
  });

  it("duplicate: shows 'already registered' state", async () => {
    mockFetchResponse({ ok: false, status: 409 });
    render(<EarlyAccessJoin />);
    fillValidForm();
    fireEvent.click(
      screen.getByRole("button", { name: "Join Early Access" }),
    );
    expect(await screen.findByText(/already registered/i))
      .toBeInTheDocument();
  });

  it("error: shows 'Something went wrong' when server/network fails", async () => {
    mockFetchResponse({ ok: false, status: 503 });
    render(<EarlyAccessJoin />);
    fillValidForm();
    fireEvent.click(
      screen.getByRole("button", { name: "Join Early Access" }),
    );
    expect(
      await screen.findByText(/Something went wrong\. Please try again later\./i),
    ).toBeInTheDocument();
  });

  it("error: network exception handled gracefully", async () => {
    const fetchMock = vi.fn(async () => {
      throw new Error("network");
    });
    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);
    render(<EarlyAccessJoin />);
    fillValidForm();
    fireEvent.click(
      screen.getByRole("button", { name: "Join Early Access" }),
    );
    expect(
      await screen.findByText(/Something went wrong\. Please try again later\./i),
    ).toBeInTheDocument();
  });
});
