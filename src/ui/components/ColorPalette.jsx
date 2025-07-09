import React, { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const ColorPalette = ({ colors, sandboxProxy, onColorSelect }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeColor, setActiveColor] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [applyStatus, setApplyStatus] = useState({
    show: false,
    success: true,
    message: "",
  });

  // Reset selected colors when colors prop changes (new image loaded)
  useEffect(() => {
    setSelectedColors([]);
    onColorSelect([]);
  }, [colors]);

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

  const toggleColorSelection = (color) => {
    const newSelectedColors = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];
    setSelectedColors(newSelectedColors);
    onColorSelect(newSelectedColors);
  };

  return (
    <div className="color-sections">
      <div className="color-grid">
        {colors.map((color, index) => (
          <div
            key={index}
            className="color-item"
            style={{
              transform: activeColor === index ? "scale(0.98)" : "scale(1)",
            }}
          >
            <div
              className="color-swatch tooltip"
              data-tooltip={`Click to apply ${color.toUpperCase()}`}
              style={{
                backgroundColor: color,
                opacity: !sandboxProxy ? 0.7 : 1,
                outline: selectedColors.includes(color)
                  ? "2px solid #1473e6"
                  : "none",
              }}
              onClick={() => applyColor(color, index)}
            >
              {applyStatus.show && activeColor === index && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: applyStatus.success
                      ? "rgba(76, 175, 80, 0.9)"
                      : "rgba(244, 67, 54, 0.9)",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "500",
                    whiteSpace: "nowrap",
                    backdropFilter: "blur(4px)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  {applyStatus.message}
                </div>
              )}
            </div>
            <div className="color-info">
              <CopyToClipboard text={color} onCopy={() => handleCopy(index)}>
                <div
                  className="hex-code tooltip"
                  data-tooltip="Click to copy"
                  style={{
                    backgroundColor:
                      copiedIndex === index ? "#e8f5e9" : "transparent",
                    cursor: "pointer",
                    padding: "6px",
                    borderRadius: "4px",
                    transition: "all 0.2s ease",
                  }}
                >
                  {color.toUpperCase()}
                  {copiedIndex === index && (
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#43a047",
                        marginTop: "2px",
                      }}
                    >
                      Copied!
                    </div>
                  )}
                </div>
              </CopyToClipboard>
              <button
                className={`button button-secondary`}
                style={{
                  width: "100%",
                  marginTop: "6px",
                  padding: "4px 8px",
                  fontSize: "12px",
                  backgroundColor: selectedColors.includes(color)
                    ? "#e8f5e9"
                    : "#fff",
                  color: selectedColors.includes(color) ? "#43a047" : "#4b4b4b",
                }}
                onClick={() => toggleColorSelection(color)}
              >
                {selectedColors.includes(color)
                  ? "Selected"
                  : "Select for Gradient"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;
