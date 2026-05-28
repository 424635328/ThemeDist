// ThemeDist Figma Plugin — Main thread

figma.showUI(__html__, { width: 420, height: 520, themeColors: true });

// --- Helpers ---

function hexToRgb01(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return { r, g, b };
}

function rgb01ToHex(r, g, b) {
  const toHex = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

function parseRgbString(str) {
  // Parses "99 102 241" into { r, g, b } as 0-1 floats
  const parts = str.trim().split(/\s+/).map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  return { r: parts[0] / 255, g: parts[1] / 255, b: parts[2] / 255 };
}

function categorizeVariable(name) {
  if (name.startsWith('--color-')) return 'color';
  if (name.startsWith('--font-')) return 'typography';
  if (name.startsWith('--space-') || name.startsWith('--spacing-')) return 'spacing';
  return 'other';
}

function parseColorValue(value, varName) {
  // Handle RGB strings like "99 102 241"
  if (/-rgb$/.test(varName)) {
    return parseRgbString(value);
  }
  // Handle hex
  if (/^#/.test(value)) {
    return hexToRgb01(value);
  }
  // Try RGB string "r g b"
  const rgb = parseRgbString(value);
  if (rgb) return rgb;
  return null;
}

// --- Message handler ---

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'import-theme') {
    await importTheme(msg.variables, msg.name || 'ThemeDist');
  } else if (msg.type === 'export-theme') {
    await exportTheme();
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

// --- Import ---

async function importTheme(variables, themeName) {
  try {
    // Find or create the collection
    const collections = figma.variables.getLocalVariableCollections();
    let collection = collections.find(c => c.name === 'ThemeDist');
    if (!collection) {
      collection = figma.variables.createVariableCollection('ThemeDist');
    }

    // Use first mode (or create one)
    const modeId = collection.modes[0]?.modeId || collection.addMode('Default');

    let created = 0;
    let skipped = 0;

    for (const [name, value] of Object.entries(variables)) {
      const category = categorizeVariable(name);
      const variableName = `ThemeDist/${name}`;

      try {
        let variable;

        if (category === 'color') {
          const rgb = parseColorValue(value, name);
          if (!rgb) { skipped++; continue; }

          variable = figma.variables.createVariable(variableName, collection, 'COLOR');
          variable.setValueForMode(modeId, rgb);
          created++;

        } else if (category === 'typography') {
          variable = figma.variables.createVariable(variableName, collection, 'STRING');
          variable.setValueForMode(modeId, String(value));
          created++;

        } else if (category === 'spacing') {
          const num = parseFloat(value);
          if (isNaN(num)) { skipped++; continue; }
          variable = figma.variables.createVariable(variableName, collection, 'FLOAT');
          variable.setValueForMode(modeId, num);
          created++;

        } else {
          // Unknown category — try string
          variable = figma.variables.createVariable(variableName, collection, 'STRING');
          variable.setValueForMode(modeId, String(value));
          created++;
        }
      } catch (e) {
        skipped++;
      }
    }

    figma.ui.postMessage({
      type: 'import-result',
      success: true,
      message: `Imported ${created} variables${skipped ? `, skipped ${skipped}` : ''}`,
    });
  } catch (e) {
    figma.ui.postMessage({
      type: 'import-result',
      success: false,
      message: `Error: ${e.message}`,
    });
  }
}

// --- Export ---

async function exportTheme() {
  try {
    const collections = figma.variables.getLocalVariableCollections();
    const collection = collections.find(c => c.name === 'ThemeDist');

    if (!collection) {
      figma.ui.postMessage({
        type: 'export-result',
        success: false,
        message: 'No ThemeDist collection found. Import a theme first.',
      });
      return;
    }

    const modeId = collection.modes[0]?.modeId;
    const variables = {};
    const exportVariables = {};

    for (const varId of collection.variableIds) {
      const v = figma.variables.getVariableById(varId);
      if (!v) continue;

      const name = v.name.replace('ThemeDist/', '');
      const value = v.valuesByMode[modeId];

      if (v.resolvedType === 'COLOR' && value) {
        if (/-rgb$/.test(name)) {
          exportVariables[name] = `${Math.round(value.r * 255)} ${Math.round(value.g * 255)} ${Math.round(value.b * 255)}`;
        } else {
          exportVariables[name] = rgb01ToHex(value.r, value.g, value.b);
        }
      } else {
        exportVariables[name] = value;
      }
    }

    const theme = {
      name: 'Exported from Figma',
      presetId: 'figma-export',
      variables: exportVariables,
    };

    figma.ui.postMessage({
      type: 'export-result',
      success: true,
      theme: theme,
    });
  } catch (e) {
    figma.ui.postMessage({
      type: 'export-result',
      success: false,
      message: `Error: ${e.message}`,
    });
  }
}
