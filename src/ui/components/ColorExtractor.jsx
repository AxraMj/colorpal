import React, { useState } from "react";
import ColorThief from "colorthief";
import ColorPalette from "./ColorPalette";
import GradientCreator from "./GradientCreator";

const LoadingSpinner = () => (
  <div
    className="loading-pulse"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      color: "#666",
    }}
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
    <span>Extracting colors...</span>
  </div>
);

const ColorExtractor = ({ sandboxProxy }) => {
  const [colors, setColors] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const rgbToHex = (r, g, b) =>
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("");

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const getColorDifference = (color1, color2) => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    // Using color difference formula
    const rmean = (rgb1.r + rgb2.r) / 2;
    const r = rgb1.r - rgb2.r;
    const g = rgb1.g - rgb2.g;
    const b = rgb1.b - rgb2.b;

    return Math.sqrt(
      (((512 + rmean) * r * r) >> 8) +
        4 * g * g +
        (((767 - rmean) * b * b) >> 8)
    );
  };

  const filterSimilarColors = (colors, threshold = 25) => {
    return colors.reduce((acc, color) => {
      // Check if this color is significantly different from all accepted colors
      const isDifferent = acc.every(
        (acceptedColor) => getColorDifference(color, acceptedColor) > threshold
      );

      if (isDifferent) {
        acc.push(color);
      }
      return acc;
    }, []);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImage(e.dataTransfer.files[0]);
    }
  };

  const extractColors = async (img, colorThief) => {
    try {
      // Get dominant color
      const dominantColor = colorThief.getColor(img);
      const dominantHex = rgbToHex(...dominantColor);

      // Get a large palette
      const mainPalette = colorThief.getPalette(img, 20);
      const mainHexColors = mainPalette.map((color) => rgbToHex(...color));

      // Get another palette with different quality settings
      const secondaryPalette = colorThief.getPalette(img, 10, 5);
      const secondaryHexColors = secondaryPalette.map((color) =>
        rgbToHex(...color)
      );

      // Combine all colors
      let allColors = [dominantHex, ...mainHexColors, ...secondaryHexColors];

      // Remove duplicates
      allColors = [...new Set(allColors)];

      // Filter similar colors
      const filteredColors = filterSimilarColors(allColors);

      // Sort colors by luminance
      const sortedColors = filteredColors.sort((a, b) => {
        const rgb1 = hexToRgb(a);
        const rgb2 = hexToRgb(b);
        const lum1 = 0.299 * rgb1.r + 0.587 * rgb1.g + 0.114 * rgb1.b;
        const lum2 = 0.299 * rgb2.r + 0.587 * rgb2.g + 0.114 * rgb2.b;
        return lum2 - lum1;
      });

      return sortedColors;
    } catch (err) {
      console.error("Error in color extraction:", err);
      throw new Error("Failed to extract colors from the image");
    }
  };

  const handleImage = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedColors([]);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";

      img.onload = async () => {
        try {
          const colorThief = new ColorThief();
          const extractedColors = await extractColors(img, colorThief);
          setColors(extractedColors);
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

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      handleImage(event.target.files[0]);
    }
  };

  const handleColorSelect = (newSelectedColors) => {
    setSelectedColors(newSelectedColors);
  };

  return (
    <div className="color-extractor">
      <div
        className="upload-section"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="file-input-wrapper">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input"
          />
          <div
            className="file-input-button"
            style={{
              borderStyle: dragActive ? "solid" : "dashed",
              borderColor: dragActive ? "#1473e6" : "#e1e1e1",
              backgroundColor: dragActive ? "#f5f9ff" : "#fff",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: "8px" }}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Drag an image here or click to upload
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            color: "#d93025",
            textAlign: "center",
            margin: "12px 0",
            padding: "8px 16px",
            backgroundColor: "#fce8e6",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {loading && <LoadingSpinner />}

      {colors.length > 0 && !error && (
        <div className="results-section">
          <ColorPalette
            colors={colors}
            sandboxProxy={sandboxProxy}
            onColorSelect={handleColorSelect}
          />
          <GradientCreator selectedColors={selectedColors} />
        </div>
      )}
    </div>
  );
};

export default ColorExtractor;
