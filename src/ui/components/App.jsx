// To support: system="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";

// To learn more about using "swc-react" visit:
// https://opensource.adobe.com/spectrum-web-components/using-swc-react/
import { Button } from "@swc-react/button";
import { Theme } from "@swc-react/theme";
import React from "react";
import ColorExtractor from "./ColorExtractor";
import "../../styles.css";

const LoadingSpinner = () => (
  <div
    style={{
      display: "inline-block",
      width: "20px",
      height: "20px",
      border: "3px solid rgba(0,0,0,.1)",
      borderRadius: "50%",
      borderTopColor: "#767676",
      animation: "spin 1s ease-in-out infinite",
      marginRight: "10px",
    }}
  />
);

const App = ({ loading, error, addOnUISdk, sandboxProxy }) => {
  const renderContent = () => {
    if (loading) {
      return (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "#666",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <LoadingSpinner />
          <div>
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Initializing Plugin
            </div>
            <div style={{ fontSize: "14px", color: "#888" }}>
              Please wait while we set up the color palette extractor...
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "#f44336",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Initialization Error
          </div>
          <div
            style={{
              color: "#666",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Retry
          </Button>
          <div
            style={{
              fontSize: "13px",
              color: "#888",
              marginTop: "20px",
            }}
          >
            If the problem persists, try checking the console for more details
            or restarting Adobe Express.
          </div>
        </div>
      );
    }

    return (
      <>
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
          ColorPal - Color Palette Extractor
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#666",
            fontSize: "14px",
            marginBottom: "25px",
          }}
        >
          Upload an image to extract its color palette. Click on any color to
          apply it to your document, and click the HEX code to copy it to
          clipboard.
        </p>
        <ColorExtractor sandboxProxy={sandboxProxy} />
      </>
    );
  };

  return (
    <Theme theme="express" scale="medium" color="light">
      <div
        style={{
          padding: "20px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {renderContent()}
      </div>
    </Theme>
  );
};

export default App;
