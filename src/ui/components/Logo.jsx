import React from "react";

const Logo = ({ width = 40, height = 40 }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main palette shape */}
        <path
          d="M34 20C34 27.732 27.732 34 20 34C12.268 34 6 27.732 6 20C6 12.268 12.268 6 20 6C27.732 6 34 12.268 34 20Z"
          fill="#FFFFFF"
          stroke="#E0E0E0"
          strokeWidth="1"
        />

        {/* Color swatches */}
        <path
          d="M20 6C23.866 6 27.732 8 29.598 12C31.464 16 30.928 20 28.99 24"
          stroke="#FF6B6B"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M28.99 24C27.052 28 23.866 30 20 30C16.134 30 12.948 28 11.01 24"
          stroke="#4ECDC4"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M11.01 24C9.072 20 8.536 16 10.402 12C12.268 8 16.134 6 20 6"
          stroke="#FFBE0B"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Center dot */}
        <circle cx="20" cy="20" r="4" fill="#2D3436" />

        {/* Subtle highlight */}
        <path
          d="M20 6C23.866 6 27.732 8 29.598 12"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "4px",
        }}
      >
        <span
          style={{
            fontSize: "22px",
            fontWeight: "600",
            color: "#2D3436",
            letterSpacing: "-0.5px",
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          ColorPal
        </span>
        <span
          style={{
            fontSize: "11px",
            color: "#666666",
            letterSpacing: "1px",
            marginTop: "-2px",
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          PALETTE & GRADIENT
        </span>
      </div>
    </div>
  );
};

export default Logo;
