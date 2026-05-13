import { useState, useEffect } from "react";
import { useSSE } from "../hooks/useSSE";
import RichTextEditor from "../components/editor/RichTextEditor";

const SUBJECTS = ["ELA", "Math", "Science", "Social Studies"];
const GRADES = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const GENRES = ["Argumentative", "Narrative", "Informational", "Reading Information", "Reading Literary"];

const DEFAULT_FORM = {
  subject: "ELA",
  grade: "9",
  topic: "",
  multipleChoiceCount: 3,
  shortResponseCount: 1,
  extendedResponseCount: 1,
  extendedResponseGenre: "Argumentative",
};

export default function GeneratePage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [editorContent, setEditorContent] = useState("");

  const { data, isStreaming, error, start, stop, reset } = useSSE("/api/generate");

  // Sync streaming data to preview buffer
  // We use `data` directly for the live preview div,
  // then push to TipTap when streaming completes.
  const handleSubmit = async (e) => {
    e.preventDefault();
    reset();
    setEditorContent("");

    await start({
      recipe: "quiz",
      variables: {
        subject: form.subject,
        grade: form.grade,
        topic: form.topic,
        multipleChoiceCount: form.multipleChoiceCount,
        shortResponseCount: form.shortResponseCount,
        extendedResponseCount: form.extendedResponseCount,
        extendedResponseGenre: form.extendedResponseGenre,
      },
    });
  };

  // When streaming completes, push accumulated data into TipTap
  useEffect(() => {
    if (!isStreaming && data) {
      setEditorContent(data);
    }
  }, [isStreaming, data]);

  const showStreamPreview = isStreaming && data;
  const showEditor = !isStreaming && editorContent;

  function set(key) {
    return (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  function setNum(key) {
    return (e) => setForm((prev) => ({ ...prev, [key]: Number(e.target.value) }));
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
      {/* ── Form panel ── */}
      <div className="bg-surface rounded-lg border border-border shadow-card p-5">
        <h2 className="font-semibold text-lg mb-4">Quiz Generator</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <select
              value={form.subject}
              onChange={set("subject")}
              className="w-full px-3 py-2 rounded-md border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {SUBJECTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Grade */}
          <div>
            <label className="block text-sm font-medium mb-1">Grade</label>
            <select
              value={form.grade}
              onChange={set("grade")}
              className="w-full px-3 py-2 rounded-md border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {GRADES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Topic / Standard / Passage <span className="text-danger">*</span>
            </label>
            <textarea
              value={form.topic}
              onChange={set("topic")}
              required
              rows={4}
              placeholder="Type your topic, standard, or learning objective..."
              className="w-full px-3 py-2 rounded-md border border-border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y"
            />
          </div>

          {/* Question counts */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Multiple Choice</label>
              <input
                type="number"
                min={0}
                max={10}
                value={form.multipleChoiceCount}
                onChange={setNum("multipleChoiceCount")}
                className="w-full px-2 py-2 rounded-md border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Short Response</label>
              <input
                type="number"
                min={0}
                max={5}
                value={form.shortResponseCount}
                onChange={setNum("shortResponseCount")}
                className="w-full px-2 py-2 rounded-md border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Extended Response</label>
              <input
                type="number"
                min={0}
                max={3}
                value={form.extendedResponseCount}
                onChange={setNum("extendedResponseCount")}
                className="w-full px-2 py-2 rounded-md border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* Extended response genre (only when count > 0) */}
          {form.extendedResponseCount > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">Writing Genre</label>
              <select
                value={form.extendedResponseGenre}
                onChange={set("extendedResponseGenre")}
                className="w-full px-3 py-2 rounded-md border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {GENRES.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
          )}

          {/* Submit / Stop */}
          <div className="pt-2">
            {isStreaming ? (
              <button
                type="button"
                onClick={stop}
                className="w-full px-4 py-2 rounded-md bg-danger text-white font-medium hover:bg-danger/90 transition-colors"
              >
                Stop Generating
              </button>
            ) : (
              <button
                type="submit"
                disabled={!form.topic.trim()}
                className="w-full px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                Generate Quiz
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── Output panel ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Output</h2>
          {isStreaming && (
            <span className="text-sm text-text-muted flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
              Generating...
            </span>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-danger/10 border border-danger/30 text-danger px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Live streaming preview (raw HTML in a div during stream) */}
        {showStreamPreview && (
          <div className="border border-border rounded-lg bg-surface shadow-card p-4 overflow-auto max-h-[600px]">
            <div
              className="tiptap-output"
              dangerouslySetInnerHTML={{ __html: data }}
            />
            <span className="inline-block w-2 h-4 ml-0.5 bg-primary animate-pulse align-middle" />
          </div>
        )}

        {/* TipTap editor — shown when streaming is done */}
        {showEditor && !isStreaming && (
          <RichTextEditor
            content={editorContent}
            editable={true}
            placeholder="Generated content will appear here..."
          />
        )}

        {/* Empty state */}
        {!isStreaming && !data && !error && (
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center text-text-muted">
            <p className="text-lg mb-1">Your quiz will appear here</p>
            <p className="text-sm">Fill out the form and click Generate Quiz</p>
          </div>
        )}
      </div>
    </div>
  );
}
