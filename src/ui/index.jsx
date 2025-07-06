import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

// Create root before async operations
const root = createRoot(document.getElementById("root"));

// Initial render with loading state
root.render(<App loading={true} />);

// Initialize the add-on
const init = async () => {
    try {
        // Import the SDK
        const addOnUISdk = await import("https://new.express.adobe.com/static/add-on-sdk/sdk.js").then(module => module.default);
        
        // Wait for SDK to be ready
        await addOnUISdk.ready;
        console.log("addOnUISdk is ready for use.");

        // Get the UI runtime
        const { runtime } = addOnUISdk.instance;
        if (!runtime) {
            throw new Error("Runtime not available");
        }

        // Get the sandbox proxy
        const sandboxProxy = await runtime.apiProxy("documentSandbox");
        if (!sandboxProxy) {
            throw new Error("Failed to get sandbox proxy");
        }

        console.log("Sandbox proxy initialized successfully");

        // Render the app with the SDK and proxy
        root.render(
            <App 
                loading={false}
                addOnUISdk={addOnUISdk} 
                sandboxProxy={sandboxProxy}
            />
        );
    } catch (error) {
        console.error("Failed to initialize add-on:", error);
        root.render(
            <App 
                loading={false}
                error={error.message || "Failed to initialize add-on"} 
            />
        );
    }
};

// Start initialization
init();
