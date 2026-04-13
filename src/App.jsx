import { useState } from "react";

const SPECIALTIES = [
  { id: "cardiology", label: "Cardiology", icon: "🫀" },
  { id: "neurology", label: "Neurology", icon: "🧠" },
  { id: "pulmonology", label: "Pulmonology", icon: "🫁" },
  { id: "gastroenterology", label: "Gastro", icon: "🩺" },
  { id: "endocrinology", label: "Endocrine", icon: "⚗️" },
  { id: "infectious disease", label: "Infectious", icon: "🦠" },
];

const DIFFICULTY = ["Beginner", "Intermediate", "Advanced"];
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');`;
const GROQ_KEY = "YOUR_API_KEY"
function DNAStrand({ left, top = 40 }) {
  const nodes = Array.from({ length: 20 });
  return (
    <svg width="60" height="580" viewBox="0 0 60 580"
      style={{ position: "absolute", top, [left ? "left" : "right"]: -20, opacity: 0.22, pointerEvents: "none" }}>
      {nodes.map((_, i) => {
        const y = i * 29;
        const x1 = 10 + Math.sin(i * 0.7) * 20;
        const x2 = 50 - Math.sin(i * 0.7) * 20;
        return (
          <g key={i}>
            <line x1={x1} y1={y} x2={x2} y2={y} stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx={x1} cy={y} r="4" fill={i % 3 === 0 ? "#F9A8D4" : i % 3 === 1 ? "#86EFAC" : "#93C5FD"} />
            <circle cx={x2} cy={y} r="4" fill={i % 3 === 0 ? "#93C5FD" : i % 3 === 1 ? "#F9A8D4" : "#86EFAC"} />
          </g>
        );
      })}
      <polyline points={nodes.map((_, i) => `${10 + Math.sin(i * 0.7) * 20},${i * 29}`).join(" ")} fill="none" stroke="#C4B5FD" strokeWidth="1.2" />
      <polyline points={nodes.map((_, i) => `${50 - Math.sin(i * 0.7) * 20},${i * 29}`).join(" ")} fill="none" stroke="#C4B5FD" strokeWidth="1.2" />
    </svg>
  );
}

function Bubbles() {
  const bubbles = [
    { size: 60, left: "8%", delay: "0s", duration: "6s", color: "#DDD6FE" },
    { size: 35, left: "18%", delay: "1.5s", duration: "8s", color: "#FBCFE8" },
    { size: 80, left: "30%", delay: "0.8s", duration: "7s", color: "#BAE6FD" },
    { size: 25, left: "45%", delay: "2s", duration: "5.5s", color: "#A7F3D0" },
    { size: 50, left: "58%", delay: "0.3s", duration: "9s", color: "#FDE68A" },
    { size: 40, left: "70%", delay: "1.2s", duration: "6.5s", color: "#DDD6FE" },
    { size: 70, left: "80%", delay: "0.6s", duration: "7.5s", color: "#FBCFE8" },
    { size: 30, left: "90%", delay: "1.8s", duration: "8.5s", color: "#BAE6FD" },
    { size: 45, left: "3%", delay: "2.5s", duration: "6s", color: "#FDE68A" },
    { size: 55, left: "93%", delay: "1s", duration: "9s", color: "#A7F3D0" },
  ];
  return (
    <>
      {bubbles.map((b, i) => (
        <div key={i} style={{
          position: "absolute", bottom: "-80px", left: b.left,
          width: b.size, height: b.size, borderRadius: "50%",
          background: b.color, opacity: 0.5,
          animation: `bubbleUp ${b.duration} ${b.delay} infinite ease-in`,
          pointerEvents: "none",
        }} />
      ))}
    </>
  );
}

function Loader() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "2rem 0" }}>
      <div style={{ display: "flex", gap: "6px" }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ width: 5, height: 24, background: "#A78BFA", borderRadius: 3, animation: "bar 1s ease-in-out infinite", animationDelay: `${i*0.12}s` }} />
        ))}
      </div>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#A78BFA", letterSpacing: "0.15em" }}>generating case…</p>
    </div>
  );
}

function Section({ title, children, accent }) {
  return (
    <div style={{ marginBottom: "1.2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: accent, flexShrink: 0 }} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: accent, fontWeight: 500 }}>{title}</span>
      </div>
      <div style={{ paddingLeft: "1rem", borderLeft: `2px solid ${accent}55` }}>{children}</div>
    </div>
  );
}

function parseCase(text) {
  const sections = { patient:"", presentation:"", history:"", examination:"", investigations:"", diagnosis:"", treatment:"", teaching:"" };
  const patterns = {
    patient: /patient profile[:\s]*([\s\S]*?)(?=\n[A-Z#*]|\n\n[A-Z]|$)/i,
    presentation: /presenting complaint[:\s]*([\s\S]*?)(?=\n[A-Z#*]|\n\n[A-Z]|$)/i,
    history: /(?:history|hpi)[:\s]*([\s\S]*?)(?=\n[A-Z#*]|\n\n[A-Z]|$)/i,
    examination: /(?:examination|exam|physical)[:\s]*([\s\S]*?)(?=\n[A-Z#*]|\n\n[A-Z]|$)/i,
    investigations: /(?:investigations|labs?|diagnostics?)[:\s]*([\s\S]*?)(?=\n[A-Z#*]|\n\n[A-Z]|$)/i,
    diagnosis: /(?:diagnosis|differential)[:\s]*([\s\S]*?)(?=\n[A-Z#*]|\n\n[A-Z]|$)/i,
    treatment: /(?:treatment|management|plan)[:\s]*([\s\S]*?)(?=\n[A-Z#*]|\n\n[A-Z]|$)/i,
    teaching: /(?:teaching|key points?|learning)[:\s]*([\s\S]*?)(?=\n[A-Z#*]|\n\n[A-Z]|$)/i,
  };
  for (const [key, regex] of Object.entries(patterns)) {
    const match = text.match(regex);
    if (match) sections[key] = match[1].replace(/\*\*/g, "").trim();
  }
  return sections;
}

function CaseDisplay({ caseText, specialty, difficulty }) {
  const [revealed, setRevealed] = useState(false);
  const s = parseCase(caseText);
  const accentMap = {
    cardiology: "#F87171", neurology: "#A78BFA", pulmonology: "#60A5FA",
    gastroenterology: "#34D399", endocrinology: "#FBBF24", "infectious disease": "#F472B6",
  };
  const accent = accentMap[specialty] || "#A78BFA";
  const cleanText = (t) => t ? t.split("\n").filter(Boolean).map((line, i) => (
    <p key={i} style={{ fontSize: "0.85rem", color: "#4B4B6B", lineHeight: 1.8, fontFamily: "'Nunito', sans-serif", marginBottom: "0.2rem" }}>
      {line.replace(/^[-•*]\s*/, "").trim()}
    </p>
  )) : null;

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.2rem", flexWrap: "wrap" }}>
        <span style={{ background: accent + "22", border: `1px solid ${accent}66`, color: accent, borderRadius: 20, padding: "0.2rem 0.8rem", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem" }}>{specialty}</span>
        <span style={{ background: "#F3F0FF", border: "1px solid #DDD6FE", color: "#7C6FA0", borderRadius: 20, padding: "0.2rem 0.8rem", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem" }}>{difficulty}</span>
      </div>
      {s.patient && <Section title="Patient Profile" accent={accent}>{cleanText(s.patient)}</Section>}
      {s.presentation && <Section title="Presenting Complaint" accent={accent}>{cleanText(s.presentation)}</Section>}
      {s.history && <Section title="History" accent={accent}>{cleanText(s.history)}</Section>}
      {s.examination && <Section title="Examination" accent={accent}>{cleanText(s.examination)}</Section>}
      {s.investigations && <Section title="Investigations" accent={accent}>{cleanText(s.investigations)}</Section>}
      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{
          width: "100%", background: "transparent", border: `1.5px dashed ${accent}88`,
          color: accent, borderRadius: 12, padding: "0.8rem",
          fontFamily: "'DM Mono', monospace", fontSize: "0.75rem",
          letterSpacing: "0.08em", cursor: "pointer", marginTop: "0.5rem", transition: "all 0.2s",
        }}>▶ reveal diagnosis & treatment</button>
      ) : (
        <>
          {s.diagnosis && <Section title="Diagnosis" accent={accent}>{cleanText(s.diagnosis)}</Section>}
          {s.treatment && <Section title="Treatment Plan" accent={accent}>{cleanText(s.treatment)}</Section>}
          {s.teaching && <Section title="Key Teaching Points" accent={accent}>{cleanText(s.teaching)}</Section>}
        </>
      )}
    </div>
  );
}

function LandingPage({ onEnter }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #FAF5FF 0%, #EFF6FF 50%, #FFF0F9 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "'Nunito', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "8%", left: "10%", width: 220, height: 220, borderRadius: "50%", background: "#DDD6FE", filter: "blur(70px)", opacity: 0.6 }} />
      <div style={{ position: "absolute", bottom: "12%", right: "8%", width: 240, height: 240, borderRadius: "50%", background: "#FBCFE8", filter: "blur(80px)", opacity: 0.5 }} />
      <div style={{ position: "absolute", bottom: "8%", left: "18%", width: 180, height: 180, borderRadius: "50%", background: "#BAE6FD", filter: "blur(60px)", opacity: 0.5 }} />
      <div style={{ position: "absolute", left: 10, top: 0 }}><DNAStrand left={true} top={20} /></div>
      <div style={{ position: "absolute", right: 10, top: 0 }}><DNAStrand left={false} top={20} /></div>
      <Bubbles />

      <div style={{ textAlign: "center", maxWidth: 540, position: "relative", zIndex: 1, animation: "fadeUp 0.7s ease" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(237,233,254,0.85)", border: "1px solid #DDD6FE", borderRadius: 20, padding: "0.35rem 1.1rem", marginBottom: "1.6rem" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#A78BFA", animation: "pulse 2s infinite" }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.2em", color: "#7C6FA0" }}>ClinIQ · V1.0</span>
        </div>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, color: "#3B1F6B", lineHeight: 1.15, marginBottom: "1rem" }}>
          <span style={{ color: "#A78BFA" }}>ClinIQ</span>
        </h1>
        <p style={{ fontSize: "1rem", color: "#6B7280", lineHeight: 1.8, marginBottom: "1.4rem" }}>
          Generate realistic synthetic medical case studies across 6 specialties — instantly. Built for students, educators, and researchers.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.5rem", marginBottom: "2.2rem" }}>
          {["🧬 Synthetic Data", "🏥 6 Specialties", "🎓 3 Difficulty Levels", "🔍 Reveal Mechanic", "⚡ Powered by Groq"].map(f => (
            <span key={f} style={{ background: "rgba(255,255,255,0.85)", border: "1px solid #EDE9FE", borderRadius: 20, padding: "0.3rem 0.9rem", fontSize: "0.78rem", color: "#7C6FA0", fontWeight: 600 }}>{f}</span>
          ))}
        </div>
        <button onClick={onEnter} style={{
          background: "linear-gradient(135deg, #A78BFA, #818CF8)", color: "white",
          border: "none", borderRadius: 16, padding: "1rem 3rem",
          fontSize: "1rem", fontWeight: 800, cursor: "pointer",
          boxShadow: "0 4px 24px #A78BFA55", fontFamily: "'Nunito', sans-serif",
        }}>Enter the Lab →</button>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "#C4B5FD", marginTop: "1.2rem", letterSpacing: "0.1em" }}>
          free to use · no sign up needed · ai generated
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("landing");
  const [specialty, setSpecialty] = useState(null);
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [caseText, setCaseText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  async function generate() {
    if (!specialty) return;
    setLoading(true); setCaseText(null); setError(null);
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Generate a synthetic medical case study for ${specialty} at ${difficulty} difficulty level.
Format with these exact headers:
PATIENT PROFILE:
PRESENTING COMPLAINT:
HISTORY:
EXAMINATION:
INVESTIGATIONS:
DIAGNOSIS:
TREATMENT:
KEY TEACHING POINTS:
Make it realistic and educationally rich.`
          }]
        })
      });
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error("No response");
      setCaseText(text);
      setCount(c => c + 1);
    } catch(e) {
      setError("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (page === "landing") return (
    <>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes bubbleUp { 0%{transform:translateY(0) scale(1);opacity:0.5} 80%{opacity:0.3} 100%{transform:translateY(-110vh) scale(0.7);opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
      <LandingPage onEnter={() => setPage("app")} />
    </>
  );

  return (
    <>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes bar { 0%,100%{transform:scaleY(0.4);opacity:0.4} 50%{transform:scaleY(1);opacity:1} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #FAF5FF 0%, #EFF6FF 50%, #FFF0F9 100%)", padding: "2.5rem 1rem 4rem", fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ maxWidth: 600, margin: "0 auto 1.2rem" }}>
          <button onClick={() => setPage("landing")} style={{ background: "none", border: "1px solid #EDE9FE", borderRadius: 10, padding: "0.4rem 1rem", fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#A78BFA", cursor: "pointer" }}>← back</button>
        </div>
        <div style={{ maxWidth: 600, margin: "0 auto 2rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "#3B1F6B" }}>Medical Case <span style={{ color: "#A78BFA" }}>Generator</span></h1>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "#9CA3AF", marginTop: "0.6rem" }}>ai-generated synthetic cases for medical education</p>
        </div>
        <div style={{ maxWidth: 600, margin: "0 auto 1.2rem", background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", border: "1px solid #EDE9FE", borderRadius: 20, padding: "1.8rem", position: "relative", overflow: "hidden", boxShadow: "0 4px 40px #A78BFA18" }}>
          <DNAStrand left={true} />
          <DNAStrand left={false} />
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.18em", color: "#C4B5FD", textTransform: "uppercase", marginBottom: "0.8rem" }}>Specialty</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.6rem", marginBottom: "1.4rem" }}>
            {SPECIALTIES.map(s => (
              <button key={s.id} onClick={() => setSpecialty(s.id)} style={{
                background: specialty === s.id ? "#EDE9FE" : "#FAFAFA",
                border: `1.5px solid ${specialty === s.id ? "#A78BFA" : "#EDE9FE"}`,
                color: specialty === s.id ? "#7C3AED" : "#9CA3AF",
                borderRadius: 14, padding: "0.7rem 0.4rem",
                fontFamily: "'Nunito', sans-serif", fontSize: "0.78rem", fontWeight: 700,
                cursor: "pointer", transition: "all 0.18s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem"
              }}>
                <span style={{ fontSize: "1.3rem" }}>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.18em", color: "#C4B5FD", textTransform: "uppercase", marginBottom: "0.7rem" }}>Difficulty</p>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.4rem" }}>
            {DIFFICULTY.map(d => (
              <button key={d} onClick={() => setDifficulty(d)} style={{
                flex: 1, background: difficulty === d ? "#EDE9FE" : "transparent",
                border: `1px solid ${difficulty === d ? "#A78BFA" : "#EDE9FE"}`,
                color: difficulty === d ? "#7C3AED" : "#C4B5FD",
                borderRadius: 10, padding: "0.5rem",
                fontFamily: "'DM Mono', monospace", fontSize: "0.7rem",
                cursor: "pointer", transition: "all 0.18s", fontWeight: 500
              }}>{d}</button>
            ))}
          </div>
          <button onClick={generate} disabled={!specialty || loading} style={{
            width: "100%",
            background: !specialty || loading ? "#EDE9FE" : "linear-gradient(135deg, #A78BFA, #818CF8)",
            color: !specialty || loading ? "#C4B5FD" : "white",
            border: "none", borderRadius: 14, padding: "0.95rem",
            fontFamily: "'Nunito', sans-serif", fontSize: "0.92rem", fontWeight: 800,
            cursor: !specialty || loading ? "not-allowed" : "pointer",
            transition: "all 0.2s", boxShadow: !specialty || loading ? "none" : "0 4px 20px #A78BFA44"
          }}>
            {loading ? "Generating…" : count > 0 ? "↺ Generate New Case" : "Generate Case →"}
          </button>
        </div>
        <div style={{ maxWidth: 600, margin: "0 auto", background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", border: "1px solid #EDE9FE", borderRadius: 20, padding: "1.8rem", minHeight: 80, position: "relative", overflow: "hidden", boxShadow: "0 4px 40px #A78BFA18" }}>
          <DNAStrand left={false} />
          {loading && <Loader />}
          {error && <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: "#F87171", textAlign: "center", padding: "1rem 0" }}>{error}</p>}
          {!loading && !error && !caseText && (
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#DDD6FE", textAlign: "center", padding: "1.5rem 0", letterSpacing: "0.12em" }}>select a specialty and generate a case ✨</p>
          )}
          {!loading && caseText && <CaseDisplay caseText={caseText} specialty={specialty} difficulty={difficulty} />}
        </div>
        {count > 0 && (
          <p style={{ textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "#C4B5FD", marginTop: "1rem", letterSpacing: "0.1em" }}>
            {count} case{count !== 1 ? "s" : ""} generated this session 🧬
          </p>
        )}
      </div>
    </>
  );
}