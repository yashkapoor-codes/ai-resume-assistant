import { useState } from "react";

function App() {
  const [resume, setResume] = useState("");

  const analyzeResume = () => {
    alert("Resume Submitted!");
    console.log(resume);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", padding: "20px" }}>
      <h1>AI Resume Assistant</h1>

      <p>Paste your resume below and get AI suggestions.</p>

      <textarea
        placeholder="Paste your resume here..."
        rows="12"
        value={resume}
        onChange={(e) => setResume(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          borderRadius: "8px",
        }}
      />

      <br />
      <br />

      <button
        onClick={analyzeResume}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Analyze Resume
      </button>
    </div>
  );
}

export default App;