import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor } from "express-document-sdk";

// Get the document sandbox runtime.
const { runtime } = addOnSandboxSdk.instance;

// Convert hex color to RGB values (0-1 range)
function hexToRgb(hex) {
  try {
    // Remove the hash if present
    hex = hex.replace("#", "");

    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      throw new Error("Invalid hex color");
    }

    return { red: r, green: g, blue: b, alpha: 1 };
  } catch (error) {
    console.error("Error converting hex to RGB:", error);
    throw error;
  }
}

function parseGradientCSS(gradientCSS) {
  try {
    const isLinear = gradientCSS.startsWith("linear-gradient");
    const isRadial = gradientCSS.startsWith("radial-gradient");

    if (!isLinear && !isRadial) {
      throw new Error("Unsupported gradient type");
    }

    let angle = 0;
    let stops = [];

    if (isLinear) {
      // Extract angle
      const angleMatch = gradientCSS.match(/(\d+)deg/);
      if (angleMatch) {
        angle = parseInt(angleMatch[1]);
      }
    }

    // Extract color stops
    const colorStopsStr = gradientCSS.substring(gradientCSS.indexOf(",") + 1);
    const colorStopMatches = colorStopsStr.match(/#[0-9a-fA-F]{6}\s+\d+%/g);

    if (!colorStopMatches) {
      throw new Error("Invalid color stops format");
    }

    stops = colorStopMatches.map((stop) => {
      const [hex, percentStr] = stop.split(/\s+/);
      const percent = parseFloat(percentStr) / 100;
      return {
        color: hexToRgb(hex),
        position: percent,
      };
    });

    return {
      type: isLinear ? "linear" : "radial",
      angle,
      stops,
    };
  } catch (error) {
    console.error("Error parsing gradient CSS:", error);
    throw error;
  }
}

function createGradientRectangle(gradientInfo) {
  try {
    // Create a new rectangle
    const rectangle = editor.createRectangle();
    if (!rectangle) {
      throw new Error("Failed to create rectangle");
    }

    // Set size
    rectangle.width = 200; // Larger size for better gradient visibility
    rectangle.height = 100;

    // Get viewport dimensions for centering
    const viewport = editor.context.viewport || { width: 800, height: 600 };
    const x = Math.max(0, (viewport.width - rectangle.width) / 2);
    const y = Math.max(0, (viewport.height - rectangle.height) / 2);
    rectangle.translation = { x, y };

    // Create and apply the gradient fill
    let fill;
    if (gradientInfo.type === "linear") {
      fill = editor.makeLinearGradientFill({
        angle: gradientInfo.angle,
        stops: gradientInfo.stops,
      });
    } else {
      fill = editor.makeRadialGradientFill({
        stops: gradientInfo.stops,
      });
    }

    if (!fill) {
      throw new Error("Failed to create gradient fill");
    }
    rectangle.fill = fill;

    // Add to document
    const insertionParent = editor.context.insertionParent;
    if (!insertionParent) {
      throw new Error("No insertion parent available");
    }
    insertionParent.children.append(rectangle);

    // Select the new rectangle
    editor.context.selection = rectangle;

    return true;
  } catch (error) {
    console.error("Error creating gradient rectangle:", error);
    return false;
  }
}

function createColoredRectangle(color) {
  try {
    // Create a new rectangle
    const rectangle = editor.createRectangle();
    if (!rectangle) {
      throw new Error("Failed to create rectangle");
    }

    // Set size
    rectangle.width = 100;
    rectangle.height = 100;

    // Get viewport dimensions for centering
    const viewport = editor.context.viewport || { width: 800, height: 600 };
    const x = Math.max(0, (viewport.width - rectangle.width) / 2);
    const y = Math.max(0, (viewport.height - rectangle.height) / 2);
    rectangle.translation = { x, y };

    // Create and apply the fill
    const fill = editor.makeColorFill(color);
    if (!fill) {
      throw new Error("Failed to create color fill");
    }
    rectangle.fill = fill;

    // Add to document
    const insertionParent = editor.context.insertionParent;
    if (!insertionParent) {
      throw new Error("No insertion parent available");
    }
    insertionParent.children.append(rectangle);

    // Select the new rectangle
    editor.context.selection = rectangle;

    return true;
  } catch (error) {
    console.error("Error creating colored rectangle:", error);
    return false;
  }
}

function start() {
  if (!runtime) {
    console.error("Runtime not available");
    return;
  }

  // APIs to be exposed to the UI runtime
  const sandboxApi = {
    applyColorToSelection: async (hexColor) => {
      try {
        if (!editor || !editor.context) {
          throw new Error("Editor context not available");
        }

        console.log("Attempting to apply color:", hexColor);
        const color = hexToRgb(hexColor);
        const selection = editor.context.selection;

        // If nothing is selected, create a new rectangle
        if (!selection || !selection.items || selection.items.length === 0) {
          console.log("No selection, creating new rectangle");
          return createColoredRectangle(color);
        }

        // Apply color to selected items
        let appliedToAny = false;
        console.log("Applying to selection:", selection.items.length, "items");

        for (const item of selection.items) {
          try {
            if (item && "fill" in item) {
              const fill = editor.makeColorFill(color);
              if (!fill) {
                console.warn("Failed to create fill for item");
                continue;
              }
              item.fill = fill;
              appliedToAny = true;
              console.log("Successfully applied color to item");
            } else {
              console.warn("Item does not support fill property");
            }
          } catch (itemError) {
            console.warn("Failed to apply color to item:", itemError);
          }
        }

        if (!appliedToAny) {
          console.log("No compatible items found, creating new rectangle");
          return createColoredRectangle(color);
        }

        return true;
      } catch (error) {
        console.error("Error in applyColorToSelection:", error);
        return false;
      }
    },

    applyGradientToSelection: async (gradientCSS) => {
      try {
        if (!editor || !editor.context) {
          throw new Error("Editor context not available");
        }

        console.log("Attempting to apply gradient:", gradientCSS);
        const gradientInfo = parseGradientCSS(gradientCSS);
        const selection = editor.context.selection;

        // If nothing is selected, create a new rectangle
        if (!selection || !selection.items || selection.items.length === 0) {
          console.log("No selection, creating new gradient rectangle");
          return createGradientRectangle(gradientInfo);
        }

        // Apply gradient to selected items
        let appliedToAny = false;
        console.log(
          "Applying gradient to selection:",
          selection.items.length,
          "items"
        );

        for (const item of selection.items) {
          try {
            if (item && "fill" in item) {
              let fill;
              if (gradientInfo.type === "linear") {
                fill = editor.makeLinearGradientFill({
                  angle: gradientInfo.angle,
                  stops: gradientInfo.stops,
                });
              } else {
                fill = editor.makeRadialGradientFill({
                  stops: gradientInfo.stops,
                });
              }

              if (!fill) {
                console.warn("Failed to create gradient fill for item");
                continue;
              }
              item.fill = fill;
              appliedToAny = true;
              console.log("Successfully applied gradient to item");
            } else {
              console.warn("Item does not support fill property");
            }
          } catch (itemError) {
            console.warn("Failed to apply gradient to item:", itemError);
          }
        }

        if (!appliedToAny) {
          console.log(
            "No compatible items found, creating new gradient rectangle"
          );
          return createGradientRectangle(gradientInfo);
        }

        return true;
      } catch (error) {
        console.error("Error in applyGradientToSelection:", error);
        return false;
      }
    },
  };

  // Expose sandboxApi to the UI runtime
  try {
    runtime.exposeApi(sandboxApi);
    console.log("Sandbox API exposed successfully");
  } catch (error) {
    console.error("Failed to expose sandbox API:", error);
  }
}

start();
