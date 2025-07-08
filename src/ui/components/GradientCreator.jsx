import React, { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const GradientCreator = ({ selectedColors }) => {
  const [gradientType, setGradientType] = useState("linear");
  const [gradientAngle, setGradientAngle] = useState(90);
  const [gradientCSS, setGradientCSS] = useState("");
  const [copiedType, setCopiedType] = useState(null);
  const [copiedColorIndex, setCopiedColorIndex] = useState(null);

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

  const handleCopy = (type) => {
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1500);
  };

  const handleColorCopy = (index) => {
    setCopiedColorIndex(index);
    setTimeout(() => setCopiedColorIndex(null), 1500);
  };

  const getHexString = () => {
    return selectedColors.join(" → ");
  };

  if (selectedColors.length < 2) {
    return (
      <div
        className="gradient-creator"
        style={{
          padding: "16px",
          textAlign: "center",
          backgroundColor: "#fff",
          borderRadius: "8px",
          border: "1px solid #e1e1e1",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
          Select at least 2 colors to create a gradient
        </p>
      </div>
    );
  }

  return (
    <div
      className="gradient-creator"
      style={{
        padding: "16px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        margin: "16px 0",
        border: "1px solid #e1e1e1",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "14px",
            color: "#2c2c2c",
            fontWeight: "500",
          }}
        >
          Gradient Preview
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <select
            value={gradientType}
            onChange={(e) => setGradientType(e.target.value)}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #e1e1e1",
              backgroundColor: "white",
              fontSize: "12px",
              color: "#2c2c2c",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </select>

          {gradientType === "linear" && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <input
                type="number"
                value={gradientAngle}
                onChange={(e) => setGradientAngle(Number(e.target.value))}
                min="0"
                max="360"
                style={{
                  width: "52px",
                  padding: "4px 6px",
                  borderRadius: "4px",
                  border: "1px solid #e1e1e1",
                  fontSize: "12px",
                  outline: "none",
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                °
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        className="gradient-preview"
        style={{
          height: "120px",
          borderRadius: "6px",
          marginBottom: "12px",
          background: gradientCSS,
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            left: "8px",
            right: "8px",
            display: "flex",
            gap: "4px",
            flexWrap: "wrap",
          }}
        >
          {selectedColors.map((color, index) => (
            <CopyToClipboard
              key={index}
              text={color}
              onCopy={() => handleColorCopy(index)}
            >
              <div
                style={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(8px)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontFamily: "SF Mono, Consolas, monospace",
                  color: "#2c2c2c",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  transform:
                    copiedColorIndex === index ? "scale(0.95)" : "scale(1)",
                  backgroundColor:
                    copiedColorIndex === index
                      ? "#e8f5e9"
                      : "rgba(255,255,255,0.9)",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    border: "1px solid rgba(0,0,0,0.1)",
                  }}
                />
                <div style={{ position: "relative" }}>
                  {color.toUpperCase()}
                  {copiedColorIndex === index && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        marginTop: "4px",
                        backgroundColor: "rgba(0,0,0,0.8)",
                        color: "white",
                        padding: "2px 6px",
                        borderRadius: "3px",
                        fontSize: "10px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Copied!
                    </div>
                  )}
                </div>
              </div>
            </CopyToClipboard>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        <CopyToClipboard text={gradientCSS} onCopy={() => handleCopy("css")}>
          <button
            className="button button-secondary"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "8px",
              backgroundColor: copiedType === "css" ? "#e8f5e9" : "#fff",
              color: copiedType === "css" ? "#2e7d32" : "#2c2c2c",
              transition: "all 0.2s ease",
              fontSize: "12px",
              fontWeight: "500",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
            {copiedType === "css" ? "Copied CSS!" : "Copy CSS"}
          </button>
        </CopyToClipboard>

        <CopyToClipboard text={getHexString()} onCopy={() => handleCopy("hex")}>
          <button
            className="button button-secondary"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "8px",
              backgroundColor: copiedType === "hex" ? "#e8f5e9" : "#fff",
              color: copiedType === "hex" ? "#2e7d32" : "#2c2c2c",
              transition: "all 0.2s ease",
              fontSize: "12px",
              fontWeight: "500",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2l10 6v8l-10 6-10-6V8z" />
            </svg>
            {copiedType === "hex" ? "Copied Hex!" : "Copy Hex"}
          </button>
        </CopyToClipboard>
      </div>
    </div>
  );
};

export default GradientCreator;
