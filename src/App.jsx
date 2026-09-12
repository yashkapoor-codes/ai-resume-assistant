import { useState } from "react";
import "./App.css";

function App() {
  const [resume, setResume] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeResume = async () => {
    if (!resume.trim()) {
      setError("Please paste your resume before analyzing.");
      return;
    }

    if (resume.trim().length < 50) {
      setError("Please enter at least 50 characters of resume content.");
      return;
    }

    setLoading(true);
    setAnalysis(null);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resume }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to analyze your resume.");
      }

      setAnalysis(data.analysis);
    } catch (error) {
      console.error("Analysis error:", error);
      setError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setResume("");
    setAnalysis(null);
    setError("");
  };

  return (
    <main className="app">
      <section className="hero">
        <div className="badge">AI-POWERED CAREER TOOL</div>

        <h1>AI Resume Assistant</h1>

        <p className="subtitle">
          Get instant, practical feedback to improve your resume and
          make your skills stand out.
        </p>
      </section>

      <section className="card">
        <div className="section-header">
          <div>
            <h2>Analyze your resume</h2>
            <p>
              Paste your resume below and let AI identify strengths,
              weaknesses, keywords, and improvement opportunities.
            </p>
          </div>

          <span className="character-count">
            {resume.length} characters
          </span>
        </div>

        <label htmlFor="resume" className="input-label">
          Resume content
        </label>

        <textarea
          id="resume"
          className="resume-input"
          placeholder="Paste your resume here..."
          rows="14"
          value={resume}
          onChange={(e) => {
            setResume(e.target.value);
            if (error) setError("");
          }}
          aria-describedby="resume-help"
        />

        <p id="resume-help" className="input-help">
          Tip: Include your skills, education, projects, experience,
          and achievements for better results.
        </p>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <div className="actions">
          <button
            className="analyze-button"
            onClick={analyzeResume}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>

          {(resume || analysis) && (
            <button
              className="clear-button"
              onClick={clearAll}
              disabled={loading}
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {loading && (
        <section className="card loading-card" aria-live="polite">
          <div className="loader"></div>
          <h2>Analyzing your resume...</h2>
          <p>
            Our AI is reviewing your skills and experience. This may
            take a few seconds.
          </p>
        </section>
      )}

      {analysis && !loading && (
        <section className="card results" aria-live="polite">
          <div className="results-header">
            <div>
              <span className="results-label">AI FEEDBACK</span>
              <h2>Your Resume Analysis</h2>
            </div>
          </div>

          {analysis.summary && (
            <div className="summary-box">
              <h3>Overall Assessment</h3>
              <p>{analysis.summary}</p>
            </div>
          )}

          <div className="analysis-grid">
            <div className="analysis-section">
              <h3>Strengths</h3>
              <ul>
                {analysis.strengths?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="analysis-section">
              <h3>Areas to Improve</h3>
              <ul>
                {analysis.weaknesses?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="analysis-section">
              <h3>Missing Keywords</h3>
              <ul>
                {analysis.missingKeywords?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="analysis-section">
              <h3>Suggestions</h3>
              <ul>
                {analysis.suggestions?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {!analysis && !loading && !error && (
        <section className="features">
          <div className="feature">
            <span>01</span>
            <h3>Identify strengths</h3>
            <p>Understand what already makes your resume effective.</p>
          </div>

          <div className="feature">
            <span>02</span>
            <h3>Find gaps</h3>
            <p>Discover weaknesses and important missing keywords.</p>
          </div>

          <div className="feature">
            <span>03</span>
            <h3>Improve your resume</h3>
            <p>Get actionable suggestions from AI.</p>
          </div>
        </section>
      )}

      <footer>
        <p>AI Resume Assistant • Built for the FlyRank AI Capstone</p>
      </footer>
    </main>
  );
}

export default App;