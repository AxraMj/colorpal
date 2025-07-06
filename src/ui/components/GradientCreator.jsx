import React, { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const GradientCreator = ({ selectedColors }) => {
  const [gradientType, setGradientType] = useState("linear");
  const [gradientAngle, setGradientAngle] = useState(90);
  const [gradientCSS, setGradientCSS] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    updateGradientCSS();
  }, [selectedColors, gradientType, gradientAngle]);

  const updateGradientCSS = () => {
    if (selectedColors.length < 2) return;

    const colorStops = selectedColors
      .map((color, index) => {
        const percentage = (index / (selectedColors.length - 1)) * 100;
        return `${color} ${percentage}%`;
      })
      .join(", ");

    const gradient =
      gradientType === "linear"
        ? `linear-gradient(${gradientAngle}deg, ${colorStops})`
        : `radial-gradient(circle, ${colorStops})`;

    setGradientCSS(gradient);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (selectedColors.length < 2) {
    return (
      <div
        className="gradient-creator"
        style={{ padding: "12px", textAlign: "center" }}
      >
        <p style={{ color: "#666", fontSize: "13px" }}>
          Select at least 2 colors to create a gradient
        </p>
      </div>
    );
  }

  return (
    <div
      className="gradient-creator"
      style={{
        padding: "12px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        margin: "8px 0",
      }}
    >
      <h3 style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#666" }}>
        Gradient Preview
      </h3>

      <div style={{ marginBottom: "12px" }}>
        <select
          value={gradientType}
          onChange={(e) => setGradientType(e.target.value)}
          style={{
            padding: "4px 8px",
            marginRight: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        >
          <option value="linear">Linear</option>
          <option value="radial">Radial</option>
        </select>

        {gradientType === "linear" && (
          <input
            type="number"
            value={gradientAngle}
            onChange={(e) => setGradientAngle(Number(e.target.value))}
            min="0"
            max="360"
            style={{
              width: "60px",
              padding: "4px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
        )}
      </div>

      <div
        className="gradient-preview"
        style={{
          height: "100px",
          borderRadius: "4px",
          marginBottom: "12px",
          background: gradientCSS,
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
        }}
      />

      <CopyToClipboard text={gradientCSS} onCopy={handleCopy}>
        <button
          style={{
            padding: "6px 12px",
            width: "100%",
            borderRadius: "4px",
            border: "1px solid #ddd",
            backgroundColor: "white",
            cursor: "pointer",
          }}
        >
          {copied ? "Copied!" : "Copy CSS"}
        </button>
      </CopyToClipboard>
    </div>
  );
};

export default GradientCreator;
