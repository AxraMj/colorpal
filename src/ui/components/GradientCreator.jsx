import React, { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const GradientCreator = ({ selectedColors }) => {
  const [gradientType, setGradientType] = useState("linear");
  const [gradientAngle, setGradientAngle] = useState(90);
  const [copied, setCopied] = useState(false);

  const getGradientCSS = () => {
    if (selectedColors.length < 2) return "";

    const colorStops = selectedColors
      .map((color, index) => {
        const percentage = (index / (selectedColors.length - 1)) * 100;
        return `${color} ${percentage}%`;
      })
      .join(", ");

    return gradientType === "linear"
      ? `linear-gradient(${gradientAngle}deg, ${colorStops})`
      : `radial-gradient(circle, ${colorStops})`;
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const gradientCSS = getGradientCSS();

  return (
    <div
      className="gradient-creator"
      style={{
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        padding: "12px",
        marginTop: "16px",
      }}
    >
      <h3
        style={{
          margin: "0 0 12px 4px",
          fontSize: "13px",
          color: "#666",
          fontWeight: "500",
        }}
      >
        Gradient Creator
      </h3>

      {selectedColors.length < 2 ? (
        <div
          style={{
            textAlign: "center",
            padding: "12px",
            color: "#666",
            fontSize: "13px",
          }}
        >
          Select at least 2 colors to create a gradient
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <select
              value={gradientType}
              onChange={(e) => setGradientType(e.target.value)}
              style={{
                padding: "4px 8px",
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
                  width: "70px",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
            )}
          </div>

          <div
            style={{
              height: "100px",
              borderRadius: "6px",
              marginBottom: "12px",
              background: gradientCSS,
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
            }}
          />

          <CopyToClipboard
            text={`background: ${gradientCSS};`}
            onCopy={handleCopy}
          >
            <div
              style={{
                backgroundColor: copied ? "#e0e0e0" : "#f8f8f8",
                padding: "8px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                fontFamily: "monospace",
                wordBreak: "break-all",
                border: "1px solid #eee",
                position: "relative",
              }}
            >
              {`background: ${gradientCSS};`}
              {copied && (
                <div
                  style={{
                    position: "absolute",
                    top: "-24px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    fontSize: "11px",
                  }}
                >
                  Copied!
                </div>
              )}
            </div>
          </CopyToClipboard>
        </>
      )}
    </div>
  );
};

export default GradientCreator;
