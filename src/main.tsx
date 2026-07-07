import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type Mode = "reel-pack" | "captions" | "hashtags" | "hooks" | "comment-replies" | "content-calendar";

type CreatorForm = {
  creatorName: string;
  niche: string;
  contentCategory: string;
  contentPillars: string;
  creatorStyle: string;
  reelTopic: string;
  targetAudience: string;
  tone: string;
  language: string;
  goal: string;
  videoDescription: string;
  locationOrCommunity: string;
  comment: string;
  postingFrequency: string;
  days: number;
};

type ApiResponse = {
  scenario: string;
  prompt: string;
  generation: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${window.location.protocol}//${window.location.hostname}:8080`;

const categories = [
  {
    label: "Food",
    value: "food reel",
    niche: "food reels, recipes, food reviews, and relatable kitchen moments",
    pillars: "quick recipes, food reviews, kitchen tips, family food moments",
    style: "warm, practical, relatable, appetite-building",
    topic: "quick paneer sandwich",
    audience: "people who enjoy easy food ideas and everyday cooking",
    goal: "more saves and shares"
  },
  {
    label: "Comedy",
    value: "comedy reel",
    niche: "comedy reels and relatable daily-life moments",
    pillars: "funny situations, family humor, daily observations, trending audio ideas",
    style: "funny, clean, relatable, fast-paced",
    topic: "when family asks what is for dinner",
    audience: "people who enjoy relatable everyday humor",
    goal: "more shares and comments"
  },
  {
    label: "Vlog",
    value: "personal vlog",
    niche: "personal vlogs, lifestyle moments, and behind-the-scenes clips",
    pillars: "daily routine, small wins, family moments, behind the scenes",
    style: "honest, warm, simple, personal",
    topic: "a simple evening routine after work",
    audience: "people who enjoy real and simple daily-life content",
    goal: "more comments and community connection"
  },
  {
    label: "Mixed",
    value: "mixed lifestyle reel",
    niche: "food, comedy, personal vlogs, and lifestyle reels",
    pillars: "recipes, food reviews, funny daily moments, personal vlog clips",
    style: "relatable, family-friendly, simple, funny",
    topic: "a funny cooking moment at home",
    audience: "people who enjoy food ideas and relatable everyday content",
    goal: "more saves, shares, and comments"
  }
];

const modes: Array<{ id: Mode; label: string; description: string }> = [
  { id: "reel-pack", label: "Full Pack", description: "Caption, hooks, hashtags, script, CTA" },
  { id: "captions", label: "Captions", description: "Only caption options" },
  { id: "hashtags", label: "Hashtags", description: "Hashtag groups" },
  { id: "hooks", label: "Hooks", description: "Opening lines" },
  { id: "comment-replies", label: "Replies", description: "Reply to a comment" },
  { id: "content-calendar", label: "Calendar", description: "Plan future posts" }
];

const tones = ["Warm and simple", "Funny and relatable", "Friendly Hinglish", "Clean family-friendly", "Premium and polished"];
const languages = ["English", "Hindi", "English with simple Hindi words", "Hinglish", "Marathi", "Tamil", "Telugu"];

const initialForm: CreatorForm = {
  creatorName: "Creator Name",
  niche: categories[3].niche,
  contentCategory: categories[3].value,
  contentPillars: categories[3].pillars,
  creatorStyle: categories[3].style,
  reelTopic: categories[3].topic,
  targetAudience: categories[3].audience,
  tone: "Warm and simple",
  language: "English with simple Hindi words",
  goal: categories[3].goal,
  videoDescription: "Shows the main moment, reaction, and final result",
  locationOrCommunity: "India",
  comment: "This looks so good. Please share the recipe!",
  postingFrequency: "1 reel per day",
  days: 7
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [mode, setMode] = useState<Mode>("reel-pack");
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeMode = useMemo(() => modes.find((item) => item.id === mode), [mode]);
  const activeCategory = useMemo(() => categories.find((item) => item.value === form.contentCategory), [form.contentCategory]);

  function update<K extends keyof CreatorForm>(key: K, value: CreatorForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function selectCategory(value: string) {
    const category = categories.find((item) => item.value === value);
    if (!category) return;

    setForm((current) => ({
      ...current,
      contentCategory: category.value,
      niche: category.niche,
      contentPillars: category.pillars,
      creatorStyle: category.style,
      reelTopic: category.topic,
      targetAudience: category.audience,
      goal: category.goal
    }));
  }

  async function generate() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/creator/instagram/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(mode, form))
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      setResult((await response.json()) as ApiResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate content");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <header className="header">
        <div>
          <p className="label">Creator Studio</p>
          <h1>Instagram content, without the blank page.</h1>
        </div>
        <span className="api-status">API: {API_BASE_URL.replace(/^https?:\/\//, "")}</span>
      </header>

      <section className="layout">
        <form className="panel composer" onSubmit={(event) => event.preventDefault()}>
          <section>
            <div className="section-title">
              <h2>What do you need?</h2>
              <p>Pick one output type.</p>
            </div>
            <div className="mode-list">
              {modes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={mode === item.id ? "mode active" : "mode"}
                  onClick={() => setMode(item.id)}
                >
                  <strong>{item.label}</strong>
                  <span>{item.description}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="section-title">
              <h2>Content type</h2>
              <p>Preset fields update automatically.</p>
            </div>
            <div className="segmented">
              {categories.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={form.contentCategory === item.value ? "active" : ""}
                  onClick={() => selectCategory(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <section className="fields">
            <Field label="Reel topic">
              <input value={form.reelTopic} onChange={(event) => update("reelTopic", event.target.value)} />
            </Field>

            <Field label="Video description">
              <textarea
                rows={3}
                value={form.videoDescription}
                onChange={(event) => update("videoDescription", event.target.value)}
              />
            </Field>

            <div className="two-col">
              <Field label="Language">
                <select value={form.language} onChange={(event) => update("language", event.target.value)}>
                  {languages.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <Field label="Tone">
                <select value={form.tone} onChange={(event) => update("tone", event.target.value)}>
                  {tones.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Goal">
              <input value={form.goal} onChange={(event) => update("goal", event.target.value)} />
            </Field>

            {mode === "hashtags" && (
              <Field label="Location or community">
                <input value={form.locationOrCommunity} onChange={(event) => update("locationOrCommunity", event.target.value)} />
              </Field>
            )}

            {mode === "comment-replies" && (
              <Field label="Audience comment">
                <input value={form.comment} onChange={(event) => update("comment", event.target.value)} />
              </Field>
            )}

            {mode === "content-calendar" && (
              <div className="two-col">
                <Field label="Posting frequency">
                  <input value={form.postingFrequency} onChange={(event) => update("postingFrequency", event.target.value)} />
                </Field>
                <Field label="Days">
                  <input min={1} max={30} type="number" value={form.days} onChange={(event) => update("days", Number(event.target.value))} />
                </Field>
              </div>
            )}

            <details>
              <summary>Creator profile</summary>
              <Field label="Creator name">
                <input value={form.creatorName} onChange={(event) => update("creatorName", event.target.value)} />
              </Field>
              <Field label="Niche">
                <textarea rows={2} value={form.niche} onChange={(event) => update("niche", event.target.value)} />
              </Field>
              <Field label="Content pillars">
                <textarea rows={2} value={form.contentPillars} onChange={(event) => update("contentPillars", event.target.value)} />
              </Field>
              <Field label="Creator style">
                <textarea rows={2} value={form.creatorStyle} onChange={(event) => update("creatorStyle", event.target.value)} />
              </Field>
              <Field label="Target audience">
                <textarea rows={2} value={form.targetAudience} onChange={(event) => update("targetAudience", event.target.value)} />
              </Field>
            </details>
          </section>

          <button className="primary-action" type="button" disabled={loading} onClick={generate}>
            {loading ? "Generating..." : `Generate ${activeMode?.label}`}
          </button>
        </form>

        <aside className="panel output">
          <div className="output-head">
            <div>
              <p className="label">{activeCategory?.label ?? "Creator"} / {activeMode?.label}</p>
              <h2>{result ? result.scenario.replaceAll("-", " ") : "Output preview"}</h2>
            </div>
            {result && (
              <button type="button" onClick={() => navigator.clipboard.writeText(result.generation)}>
                Copy
              </button>
            )}
          </div>

          {loading && <EmptyState title="Creating your draft" text="The AI backend is preparing content for this reel." />}
          {error && <EmptyState title="Could not generate" text={error} tone="error" />}
          {!loading && !error && !result && (
            <EmptyState
              title="Start with a reel idea"
              text="Choose a content type, write the reel topic, then generate a creator-ready draft."
            />
          )}
          {result && <pre>{result.generation}</pre>}
        </aside>
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label>
      <span>{label}</span>
      {children}
    </label>
  );
}

function EmptyState({ title, text, tone }: { title: string; text: string; tone?: "error" }) {
  return (
    <div className={tone === "error" ? "empty error" : "empty"}>
      <div className="empty-mark" />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function buildPayload(mode: Mode, form: CreatorForm) {
  if (mode === "hashtags") {
    return {
      niche: form.niche,
      contentCategory: form.contentCategory,
      topic: form.reelTopic,
      targetAudience: form.targetAudience,
      locationOrCommunity: form.locationOrCommunity
    };
  }

  if (mode === "comment-replies") {
    return {
      creatorTone: form.tone,
      creatorStyle: form.creatorStyle,
      contentCategory: form.contentCategory,
      reelTopic: form.reelTopic,
      comment: form.comment
    };
  }

  if (mode === "content-calendar") {
    return {
      niche: form.niche,
      contentPillars: form.contentPillars,
      creatorStyle: form.creatorStyle,
      targetAudience: form.targetAudience,
      goals: form.goal,
      postingFrequency: form.postingFrequency,
      days: form.days
    };
  }

  return {
    creatorName: form.creatorName,
    niche: form.niche,
    contentCategory: form.contentCategory,
    contentPillars: form.contentPillars,
    creatorStyle: form.creatorStyle,
    reelTopic: form.reelTopic,
    targetAudience: form.targetAudience,
    tone: form.tone,
    language: form.language,
    goal: form.goal,
    videoDescription: form.videoDescription
  };
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
