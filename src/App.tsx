import { useCallback, useState } from "react";
import "./App.css";

const SESSION_KEY = "jdbf_portal_auth";

type DeliverableStatus = "not_started" | "in_progress" | "done";

type Deliverable = {
  id: string;
  title: string;
  phase: string;
  description: string;
  status: DeliverableStatus;
};

type LearningItem = {
  id: string;
  title: string;
  type: string;
  href: string;
};

const INITIAL_DELIVERABLES: Deliverable[] = [
  {
    id: "1",
    title: "Orientation & onboarding checklist",
    phase: "Week 1",
    description: "Complete foundation policies, introductions, and workspace setup.",
    status: "not_started",
  },
  {
    id: "2",
    title: "Summer project proposal",
    phase: "Weeks 2–3",
    description: "Draft goals, timeline, and success metrics for your primary project.",
    status: "not_started",
  },
  {
    id: "3",
    title: "Mid-summer reflection",
    phase: "Mid-program",
    description: "Short written reflection on progress and support needed.",
    status: "not_started",
  },
  {
    id: "4",
    title: "Final presentation or handoff",
    phase: "End of summer",
    description: "Summarize outcomes and recommendations for the team.",
    status: "not_started",
  },
];

const LEARNING_ITEMS: LearningItem[] = [
  {
    id: "l1",
    title: "Foundation overview & values",
    type: "Reading",
    href: "#",
  },
  {
    id: "l2",
    title: "Hartford community context (primer)",
    type: "Reading",
    href: "#",
  },
  {
    id: "l3",
    title: "Professional communication expectations",
    type: "Module",
    href: "#",
  },
];

function getExpectedPassword(): string {
  return String(import.meta.env.VITE_PORTAL_PASSWORD ?? "");
}

function statusLabel(s: DeliverableStatus): string {
  switch (s) {
    case "not_started":
      return "Not started";
    case "in_progress":
      return "In progress";
    case "done":
      return "Done";
    default:
      return s;
  }
}

function nextStatus(s: DeliverableStatus): DeliverableStatus {
  if (s === "not_started") return "in_progress";
  if (s === "in_progress") return "done";
  return "not_started";
}

function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const expected = getExpectedPassword();

  const submit = useCallback(() => {
    if (!expected) {
      setError(
        "Portal password is not configured. Add VITE_PORTAL_PASSWORD to your .env file (see README)."
      );
      return;
    }
    if (value === expected) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setError(null);
      onSuccess();
      return;
    }
    setError("Incorrect password. Please try again.");
  }, [value, expected, onSuccess]);

  return (
    <div className="gate">
      <div className="gate__card">
        <h1 className="gate__title">Intern portal</h1>
        <p className="gate__sub">
          This area is restricted to approved interns and staff. Enter the portal password to
          continue.
        </p>
        <label className="gate__label" htmlFor="portal-password">
          Password
        </label>
        <input
          id="portal-password"
          className="gate__input"
          type="password"
          autoComplete="current-password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
        {error ? <p className="gate__error">{error}</p> : null}
        <button type="button" className="gate__btn" onClick={submit}>
          Enter portal
        </button>
        <p className="gate__hint">
          Access is enforced in the browser for this demo. For production, use server-side
          authentication.
        </p>
      </div>
    </div>
  );
}

function DeliverableCard({
  item,
  onCycleStatus,
}: {
  item: Deliverable;
  onCycleStatus: (id: string) => void;
}) {
  return (
    <article className="deliverable">
      <div>
        <h3 className="deliverable__title">{item.title}</h3>
        <p className="deliverable__phase">{item.phase}</p>
        <p className="deliverable__desc">{item.description}</p>
      </div>
      <button
        type="button"
        className="status-btn"
        data-status={item.status}
        onClick={() => onCycleStatus(item.id)}
        aria-label={`Status: ${statusLabel(item.status)}. Click to change.`}
      >
        {statusLabel(item.status)}
      </button>
    </article>
  );
}

function PortalContent() {
  const [deliverables, setDeliverables] = useState<Deliverable[]>(INITIAL_DELIVERABLES);

  const cycleStatus = useCallback((id: string) => {
    setDeliverables((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: nextStatus(d.status) } : d))
    );
  }, []);

  return (
    <div className="shell">
      <header className="shell__header">
        <span className="shell__badge">Summer 2026 · upcoming cohorts</span>
        <h1 className="shell__h1">Jaylen D. Berry Foundation</h1>
        <p className="shell__location">Hartford, Connecticut</p>
        <p className="shell__lead">
          We support learning, growth, and community impact. This portal helps interns track
          deliverables and required learning—built for Summer 2026 and future programs.
        </p>
      </header>

      <section className="section" aria-labelledby="deliverables-heading">
        <h2 id="deliverables-heading" className="section__h2">
          Deliverables
        </h2>
        <div className="deliverable-list">
          {deliverables.map((d) => (
            <DeliverableCard key={d.id} item={d} onCycleStatus={cycleStatus} />
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="learning-heading">
        <h2 id="learning-heading" className="section__h2">
          Required learning
        </h2>
        <div className="learning-list">
          {LEARNING_ITEMS.map((item) => (
            <div key={item.id} className="learning-item">
              <div>
                <span className="learning-item__title">{item.title}</span>
                <span className="learning-item__type"> · {item.type}</span>
              </div>
              <a className="learning-item__link" href={item.href}>
                Open resource →
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="assistant-heading">
        <h2 id="assistant-heading" className="section__h2">
          Resource assistant
        </h2>
        <div className="assistant">
          <div className="assistant__row">
            <h3 className="assistant__title">Ask the resource assistant</h3>
            <span className="badge-soon">Coming soon</span>
          </div>
          <p className="assistant__copy">
            Soon you will be able to ask questions in plain language and get answers from
            Foundation materials linked to Google Drive—policies, templates, and curated files—in
            one place.
          </p>
          <textarea
            className="assistant__textarea"
            disabled
            placeholder="Example: Where is the media consent template?"
            aria-label="Resource assistant (disabled until launch)"
          />
          <button type="button" className="assistant__btn" disabled>
            Send
          </button>
        </div>
      </section>

      <footer className="shell__footer">
        Jaylen D. Berry Foundation · Intern portal · Session-only access (clear browser data to
        sign out)
      </footer>
    </div>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");

  if (!unlocked) {
    return <PasswordGate onSuccess={() => setUnlocked(true)} />;
  }

  return (
    <div className="app">
      <PortalContent />
    </div>
  );
}
