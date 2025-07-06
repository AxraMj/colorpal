import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import GradientCreator from "./GradientCreator";

const ColorPalette = ({ colors, sandboxProxy }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeColor, setActiveColor] = useState(null);
  const [applyStatus, setApplyStatus] = useState({
    show: false,
    success: true,
    message: "",
  });
  const [selectedColors, setSelectedColors] = useState([]);

  const showStatus = (success, message, duration = 2000) => {
    setApplyStatus({ show: true, success, message });
    setTimeout(() => {
      setApplyStatus({ show: false, success: true, message: "" });
      setActiveColor(null);
    }, duration);
  };

  const applyColor = async (hexColor, index) => {
    if (!sandboxProxy) {
      console.error("Sandbox proxy not available");
      showStatus(false, "Plugin not ready");
      return;
    }

    try {
      setActiveColor(index);
      console.log("Attempting to apply color:", hexColor);

      const result = await sandboxProxy.applyColorToSelection(hexColor);
      console.log("Color application result:", result);

      if (result === true) {
        showStatus(true, "Color applied!");
      } else {
        showStatus(false, "Failed to apply color");
      }
    } catch (error) {
      console.error("Error applying color:", error);
      showStatus(false, error.message || "Failed to apply color");
    }
  };

  const handleCopy = (index) => {
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const toggleColorSelection = (color, index) => {
    setSelectedColors((prev) => {
      const isSelected = prev.includes(color);
      if (isSelected) {
        return prev.filter((c) => c !== color);
      } else {
        return [...prev, color];
      }
    });
  };

  return (
    <>
      <div
        className="color-palette"
        style={{
          position: "relative",
          padding: "12px 8px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          margin: "8px 0",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        {colors.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
              paddingLeft: "4px",
            }}
          >
            <h3
              style={{
                margin: "0",
                fontSize: "13px",
                color: "#666",
                fontWeight: "500",
              }}
            >
              Extracted Colors ({colors.length})
            </h3>
            <div
              style={{
                fontSize: "12px",
                color: "#666",
              }}
            >
              Selected: {selectedColors.length}
            </div>
          </div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "8px",
            justifyContent: "center",
            alignItems: "start",
            width: "100%",
          }}
        >
          {colors.map((color, index) => (
            <div
              key={index}
              className="color-item"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "white",
                padding: "6px",
                borderRadius: "6px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                transition: "transform 0.2s ease-in-out",
                transform: activeColor === index ? "scale(0.95)" : "scale(1)",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div
                className="color-swatch"
                style={{
                  backgroundColor: color,
                  width: "100%",
                  height: "40px",
                  borderRadius: "4px",
                  cursor: sandboxProxy ? "pointer" : "not-allowed",
                  position: "relative",
                  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
                  opacity: !sandboxProxy
                    ? 0.7
                    : activeColor === index
                    ? 0.8
                    : 1,
                  outline: selectedColors.includes(color)
                    ? "2px solid #2196F3"
                    : activeColor === index
                    ? "2px solid #4CAF50"
                    : "none",
                  marginBottom: "4px",
                }}
                onClick={() => toggleColorSelection(color, index)}
                onDoubleClick={() => sandboxProxy && applyColor(color, index)}
                title={
                  sandboxProxy
                    ? "Click to select for gradient, double-click to apply"
                    : "Click to select for gradient"
                }
              >
                {applyStatus.show && activeColor === index && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-24px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: applyStatus.success
                        ? "#4CAF50"
                        : "#f44336",
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: "3px",
                      fontSize: "11px",
                      whiteSpace: "nowrap",
                      zIndex: 1000,
                      boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    }}
                  >
                    {applyStatus.message}
                  </div>
                )}
              </div>
              <CopyToClipboard text={color} onCopy={() => handleCopy(index)}>
                <div
                  className="hex-code"
                  style={{
                    width: "100%",
                    padding: "4px 2px",
                    backgroundColor:
                      copiedIndex === index ? "#e0e0e0" : "#f8f8f8",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontFamily: "monospace",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    userSelect: "all",
                    border: "1px solid #eee",
                    color: "#333",
                    boxSizing: "border-box",
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {color.toUpperCase()}
                  {copiedIndex === index && (
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#4CAF50",
                        marginTop: "1px",
                      }}
                    >
                      Copied!
                    </div>
                  )}
                </div>
              </CopyToClipboard>
            </div>
          ))}
        </div>
        {colors.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "16px",
              color: "#666",
              fontSize: "13px",
            }}
          >
            Upload an image to extract colors
          </div>
        )}
      </div>
      <GradientCreator selectedColors={selectedColors} />
    </>
  );
};

export default ColorPalette;
