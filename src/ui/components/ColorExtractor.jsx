import React, { useState } from "react";
import ColorThief from "colorthief";
import ColorPalette from "./ColorPalette";

const ColorExtractor = ({ sandboxProxy }) => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const rgbToHex = (r, g, b) =>
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("");

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";

      img.onload = async () => {
        try {
          const colorThief = new ColorThief();
          const palette = colorThief.getPalette(img, 6);
          const hexColors = palette.map((color) =>
            rgbToHex(color[0], color[1], color[2])
          );
          setColors(hexColors);
        } catch (err) {
          setError("Failed to extract colors. Please try another image.");
          console.error("Color extraction error:", err);
        } finally {
          setLoading(false);
        }
      };

      img.onerror = () => {
        setError("Failed to load image. Please try another one.");
        setLoading(false);
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="color-extractor">
      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{
            marginBottom: "20px",
          }}
        />
      </div>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {loading && <p style={{ textAlign: "center" }}>Extracting colors...</p>}

      {colors.length > 0 && !error && (
        <div className="results-section">
          <h3>Extracted Colors</h3>
          <ColorPalette colors={colors} sandboxProxy={sandboxProxy} />
        </div>
      )}
    </div>
  );
};

export default ColorExtractor;
