// DRAPER FigJam prelude — paste at the top of use_figma scripts and build with these.
// All sizes are final FigJam values (SVG draft values × 2). Wrap scripts in an async
// IIFE and `return` the ids you'll need later (console.log never reaches the agent).
// Do NOT call figma.closePlugin() before `return` — it hard-terminates the script and
// your return value is lost ("Code executed with no return value"). When you need data
// back, just return; the MCP tool ends the run itself.
//
// STYLING AUTHORITY (8.12): 06.1.2 - Visual Rules is the current standard. The TOKENS
// and LEVEL constants below carry its values. The component helpers further down
// (chip, panelRect, store, logicBlock, wire, ...) are the July board-map register:
// their mechanics (auto-layout, font loading, radius-after-resize, connector API) are
// current, but their baked styles (radius 16-32, stroke 2.2+, #6428DF purple,
// #3E7F76 teal) are LEGACY. For documentation-sheet work, style per Visual Rules:
// radius 2-3, stroke 1-1.5 (pill shapes 1.3), fills from TOKENS, colors from LEVEL.

// Visual Rules tokens (06.1.2 §1). Every documentation-sheet fill comes from these.
const TOKENS = {
  white: '#FFFFFF', sheet: '#FFFDFB', surface: '#FAFAF8', tile: '#F1F1EF',
  hairline: '#E4E4E0',
  tint: {
    principles: '#FFFBF6', logic: '#FDFCFF', functions: '#FBFEFD',
    process: '#FCFCFB', artifacts: '#FCFDFF', data: '#FFFCFE',
  },
};

// Level colors (06.1.2 §1). Process is neutral/black with per-piece internals;
// Agent color and the distinct Interface/Action greens are still open.
const LEVEL = {
  principles: '#E96B0C', logic: '#6D35E9', functions: '#2F8278',
  artifacts: '#1764C0', data: '#D83A9A',
};

// Text grays (06.1.2 §3).
const GRAY = { sub: '#73726E', mono: '#9C9C96' };

const h = (r, g, b) => ({ r: r / 255, g: g / 255, b: b / 255 });
const solid = (hex, opacity) => {
  const n = parseInt(hex.slice(1), 16);
  const p = { type: 'SOLID', color: h((n >> 16) & 255, (n >> 8) & 255, n & 255) };
  if (opacity !== undefined) p.opacity = opacity;
  return p;
};

// Load every (family, style) you will touch, ONCE, before any text mutation.
async function loadFonts() {
  const faces = [
    ['Inter', 'Bold'], ['Inter', 'Semi Bold'], ['Inter', 'Medium'], ['Inter', 'Regular'],
    ['Source Code Pro', 'Regular'],
  ];
  for (const [family, style] of faces) await figma.loadFontAsync({ family, style });
}

// Chip: auto-layout frame, white fill, family stroke, centered two-tier text in ONE
// text node (styled ranges) — replaces the old shape+text+group overlay hack.
// family = { mid: '#9E6FF6', dark: '#6428DF' }
// strokeHex: optional stroke override (neutral chips use neutral-stroke while text
// stays legible — see palette.md "Neutral chip family").
function chip(slug, title, sub, family, minWidth = 0, strokeHex = null) {
  const f = figma.createFrame();
  f.name = 'chip:' + slug;
  f.layoutMode = 'VERTICAL';
  // REQUIRED: without both AUTO sizing modes the frame stays at the 100px
  // createFrame default and clips its text (verified failure, July 2026).
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'AUTO';
  f.primaryAxisAlignItems = 'CENTER';
  f.counterAxisAlignItems = 'CENTER';
  f.paddingTop = 18; f.paddingBottom = 18; f.paddingLeft = 32; f.paddingRight = 32;
  f.cornerRadius = 16;
  f.fills = [solid('#FFFFFF')];
  f.strokes = [solid(strokeHex || family.mid)];
  f.strokeWeight = 2.2;
  const t = figma.createText();
  t.name = 'chiptext:' + slug;
  t.fontName = { family: 'Inter', style: 'Medium' };
  t.fontSize = 24;
  t.textAlignHorizontal = 'CENTER';
  t.characters = sub ? title + '\n' + sub : title;
  t.fills = [solid(family.dark)];
  if (sub) {
    const start = title.length + 1;
    t.setRangeFontName(start, t.characters.length, { family: 'Inter', style: 'Regular' });
    t.setRangeFontSize(start, t.characters.length, 19);
    t.setRangeFills(start, t.characters.length, [solid(family.mid)]);
  }
  f.appendChild(t);
  if (minWidth && f.width < minWidth) {
    f.layoutSizingHorizontal = 'FIXED';
    f.resize(minWidth, f.height);
  }
  return f;
}

// Panel rect: the visible body of an L1 phase panel or L2 cluster card.
// opts = { fill: '#FFFFFF'|null, stroke: '#7A3FF2', weight: 3, radius: 32, dash: [14,12]|null }
function panelRect(slug, x, y, w, hgt, opts) {
  const s = figma.createShapeWithText();
  s.shapeType = 'ROUNDED_RECTANGLE';
  s.name = 'panel:' + slug;
  s.x = x; s.y = y;
  s.resize(w, hgt);
  s.cornerRadius = opts.radius ?? 32; // AFTER resize — resize (grow OR shrink) scales
  // the radius (24 came back as 80 after a shrink). Re-assert + read back after ANY
  // later resize, including reflow-pass resizes.
  s.fills = opts.fill ? [solid(opts.fill)] : [];
  s.strokes = [solid(opts.stroke)];
  s.strokeWeight = opts.weight ?? 3;
  if (opts.dash) s.dashPattern = opts.dash; // verify support by reading back
  return s;
}

// Title-outside-the-box: phase title + kicker sitting above a panel rect's top edge.
function phaseTitle(slug, title, kicker, x, y, accentHex) {
  const t = figma.createText();
  t.name = 'title:' + slug;
  t.fontName = { family: 'Inter', style: 'Bold' };
  t.fontSize = 40;
  t.characters = title;
  t.fills = [solid(accentHex)];
  t.x = x; t.y = y;
  const k = figma.createText();
  k.name = 'kicker:' + slug;
  k.fontName = { family: 'Inter', style: 'Regular' };
  k.fontSize = 22;
  k.characters = kicker;
  k.fills = [solid('#8A8A85')];
  k.x = x + t.width + 24; k.y = y + 14;
  return [t, k];
}

// Caption / legend / annotation text.
function caption(slug, text, x, y, size = 18) {
  const t = figma.createText();
  t.name = 'cap:' + slug;
  t.fontName = { family: 'Inter', style: 'Regular' };
  t.fontSize = size;
  t.characters = text;
  t.fills = [solid('#98988F')];
  t.x = x; t.y = y;
  return t;
}

// Runnable pill (components.md A3): slash commands, agents, skills, back-end fns.
// kind: 'CMD' | 'AGENT' | 'SKILL' | 'FN'. Machine name renders in Source Code Pro.
function runnable(slug, kind, machineName, family) {
  const f = figma.createFrame();
  f.name = 'run:' + slug;
  f.layoutMode = 'HORIZONTAL';
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'AUTO';
  f.counterAxisAlignItems = 'CENTER';
  f.itemSpacing = 14;
  f.paddingTop = 14; f.paddingBottom = 14; f.paddingLeft = 24; f.paddingRight = 28;
  f.cornerRadius = 999;
  f.fills = [solid('#FFFFFF')];
  f.strokes = [solid(family.mid)];
  f.strokeWeight = 2.2;
  const tag = figma.createFrame();
  tag.name = 'runtag:' + slug;
  tag.layoutMode = 'HORIZONTAL';
  tag.primaryAxisSizingMode = 'AUTO';
  tag.counterAxisSizingMode = 'AUTO';
  tag.paddingTop = 4; tag.paddingBottom = 4; tag.paddingLeft = 10; tag.paddingRight = 10;
  tag.cornerRadius = 999;
  tag.fills = [solid(family.light)];
  const tt = figma.createText();
  tt.fontName = { family: 'Inter', style: 'Medium' };
  tt.fontSize = 16;
  tt.characters = kind;
  tt.fills = [solid(family.dark)];
  tag.appendChild(tt);
  const nm = figma.createText();
  nm.name = 'runname:' + slug;
  nm.fontName = { family: 'Source Code Pro', style: 'Regular' };
  nm.fontSize = 20;
  nm.characters = machineName;
  nm.fills = [solid(family.dark)];
  f.appendChild(tag);
  f.appendChild(nm);
  return f;
}

// Store card (A4): repositories. Double-border = outer stroke + inner hairline rim.
// Positions at (x, y), centers the text, and returns a single grouped node.
function store(slug, title, sub, family, x = 0, y = 0, w = 430, hgt = 108) {
  const outer = figma.createShapeWithText();
  outer.shapeType = 'ROUNDED_RECTANGLE';
  outer.name = 'store:' + slug;
  outer.x = x; outer.y = y;
  outer.resize(w, hgt);
  outer.cornerRadius = 24;
  outer.fills = [solid('#FFFFFF')];
  outer.strokes = [solid(family.mid)];
  outer.strokeWeight = 3.4;
  const rim = figma.createShapeWithText();
  rim.shapeType = 'ROUNDED_RECTANGLE';
  rim.name = 'storerim:' + slug;
  rim.x = x + 10; rim.y = y + 10;
  rim.resize(w - 20, hgt - 20);
  rim.cornerRadius = 16;
  rim.fills = [];
  rim.strokes = [solid(family.light)];
  rim.strokeWeight = 2;
  const t = figma.createText();
  t.name = 'storetext:' + slug;
  t.fontName = { family: 'Inter', style: 'Semi Bold' };
  t.fontSize = 26;
  t.textAlignHorizontal = 'CENTER';
  t.characters = sub ? title + '\n' + sub : title;
  t.fills = [solid(family.dark)];
  if (sub) {
    const s = title.length + 1;
    t.setRangeFontName(s, t.characters.length, { family: 'Inter', style: 'Regular' });
    t.setRangeFontSize(s, t.characters.length, 19);
    t.setRangeFills(s, t.characters.length, [solid(family.mid)]);
  }
  t.x = x + (w - t.width) / 2;
  t.y = y + (hgt - t.height) / 2;
  const g = figma.group([outer, rim, t], outer.parent);
  g.name = 'group:store-' + slug;
  return g;
}

// Badge (A9): version/status pill overlapping a host's top-right corner.
// kind 'version' = mid fill + white text; 'status' = light fill + dark text.
function badge(slug, label, family, kind = 'status') {
  const f = figma.createFrame();
  f.name = 'badge:' + slug;
  f.layoutMode = 'HORIZONTAL';
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'AUTO';
  f.paddingTop = 5; f.paddingBottom = 5; f.paddingLeft = 12; f.paddingRight = 12;
  f.cornerRadius = 999;
  f.fills = [solid(kind === 'version' ? family.mid : family.light)];
  const t = figma.createText();
  t.fontName = { family: 'Inter', style: 'Medium' };
  t.fontSize = 16;
  t.characters = label;
  t.fills = [solid(kind === 'version' ? '#FFFFFF' : family.dark)];
  f.appendChild(t);
  return f; // then: f.x = host.x + host.width - f.width + 12; f.y = host.y - f.height / 2
}

// Control slot (A8): 172×28, state 'locked' | 'filled' | 'open'.
function controlSlot(slug, state, x, y) {
  const s = figma.createShapeWithText();
  s.shapeType = 'ROUNDED_RECTANGLE';
  s.name = 'ctl:' + slug;
  s.x = x; s.y = y;
  s.resize(172, 28);
  s.cornerRadius = 6;
  if (state === 'locked') { s.fills = [solid('#DCE9FB')]; s.strokes = [solid('#2B6FDE')]; }
  else if (state === 'filled') { s.fills = [solid('#E8F3E9')]; s.strokes = [solid('#4C9A57')]; }
  else { s.fills = [solid('#FFFFFF')]; s.strokes = [solid('#9A9A94')]; s.dashPattern = [6, 6]; }
  s.strokeWeight = 2.2;
  return s;
}

// Number marker (A10): 44px circle + centered white numeral, in a frame.
function marker(slug, n, family) {
  const f = figma.createFrame();
  f.name = 'mark:' + slug;
  f.resize(44, 44);
  f.fills = [];
  f.clipsContent = false;
  const c = figma.createEllipse();
  c.resize(44, 44);
  c.fills = [solid(family.mid)];
  f.appendChild(c); c.x = 0; c.y = 0;
  const t = figma.createText();
  t.fontName = { family: 'Inter', style: 'Bold' };
  t.fontSize = 20;
  t.characters = String(n);
  t.fills = [solid('#FFFFFF')];
  f.appendChild(t);
  t.x = (44 - t.width) / 2; t.y = (44 - t.height) / 2;
  return f;
}

// Logic block (D): pull-able thinking module. Left accent bar + whisper card.
function logicBlock(slug, title, sub, x, y, w = 420, hgt = 104) {
  const card = figma.createShapeWithText();
  card.shapeType = 'ROUNDED_RECTANGLE';
  card.name = 'logic:' + slug;
  card.x = x; card.y = y;
  card.resize(w, hgt);
  card.cornerRadius = 16;
  card.fills = [solid('#FBFAFF')];
  card.strokes = [solid('#9E6FF6')];
  card.strokeWeight = 2;
  const bar = figma.createRectangle();
  bar.name = 'logicbar:' + slug;
  bar.x = x; bar.y = y + 8;
  bar.resize(8, hgt - 16);
  bar.cornerRadius = 4;
  bar.fills = [solid('#6428DF')];
  const t = figma.createText();
  t.name = 'logictext:' + slug;
  t.fontName = { family: 'Inter', style: 'Semi Bold' };
  t.fontSize = 24;
  t.characters = sub ? title + '\n' + sub : title;
  t.fills = [solid('#6428DF')];
  if (sub) {
    const s = title.length + 1;
    t.setRangeFontName(s, t.characters.length, { family: 'Inter', style: 'Regular' });
    t.setRangeFontSize(s, t.characters.length, 19);
    t.setRangeFills(s, t.characters.length, [solid('#8A63E8')]);
  }
  t.x = x + 32; t.y = y + (hgt - t.height) / 2;
  const g = figma.group([card, bar, t], card.parent);
  g.name = 'group:logic-' + slug;
  return g;
}

// Creative unit (G): idea under evaluation. Ellipse + kind badge below-center.
// kind: 'CONCEPT' | 'THEME' | 'MOTIF' | 'DEVICE' | 'TENSION' | 'ANCHOR'
function creativeUnit(slug, name, kind, x, y, w = 220, hgt = 110) {
  const e = figma.createShapeWithText();
  e.shapeType = 'ELLIPSE';
  e.name = 'unit:' + slug;
  e.x = x; e.y = y;
  e.resize(w, hgt);
  e.fills = [solid('#FFFFFF')];
  e.strokes = [solid('#9E6FF6')];
  e.strokeWeight = 2.4;
  e.text.characters = name;
  e.text.fontSize = 22;
  e.text.fills = [solid('#6428DF')];
  const b = badge(slug + '-kind', kind, { light: '#FBFAFF', mid: '#9E6FF6', dark: '#6428DF' }, 'status');
  b.x = x + w / 2 - b.width / 2;
  b.y = y + hgt - b.height / 2;
  return { ellipse: e, kindBadge: b }; // font for e.text must be loaded (read node.text.fontName)
}

// Variant tile (G): one disposable exploration output. Always used in grids, 16 gap.
function variantTile(slug, x, y) {
  const r = figma.createShapeWithText();
  r.shapeType = 'ROUNDED_RECTANGLE';
  r.name = 'var:' + slug;
  r.x = x; r.y = y;
  r.resize(96, 64);
  r.cornerRadius = 8;
  r.fills = [solid('#FFFFFF')];
  r.strokes = [solid('#C7C7C1')];
  r.strokeWeight = 1.6;
  return r;
}

// Surface card (H): a venue where work happens. Header strip + white body.
function surfaceCard(slug, title, familyMidHex, x, y, w = 420, hgt = 220) {
  const body = figma.createShapeWithText();
  body.shapeType = 'ROUNDED_RECTANGLE';
  body.name = 'surf:' + slug;
  body.x = x; body.y = y;
  body.resize(w, hgt);
  body.cornerRadius = 16;
  body.fills = [solid('#FFFFFF')];
  body.strokes = [solid(familyMidHex)];
  body.strokeWeight = 2.2;
  const strip = figma.createRectangle();
  strip.name = 'surfstrip:' + slug;
  strip.x = x; strip.y = y;
  strip.resize(w, 40);
  strip.topLeftRadius = 16; strip.topRightRadius = 16;
  strip.fills = [solid(familyMidHex)];
  const t = figma.createText();
  t.name = 'surftitle:' + slug;
  t.fontName = { family: 'Inter', style: 'Medium' };
  t.fontSize = 20;
  t.characters = title;
  t.fills = [solid('#FFFFFF')];
  t.x = x + 20; t.y = y + (40 - t.height) / 2;
  const g = figma.group([body, strip, t], body.parent);
  g.name = 'group:surf-' + slug;
  return g;
}

// Brief / bundle chip (C): packaged handoff — stacked-shadow look behind a chip.
// Create the back rect FIRST (z-order), then the chip, then group.
function bundleBack(slug, chipNode) {
  const back = figma.createShapeWithText();
  back.shapeType = 'ROUNDED_RECTANGLE';
  back.name = 'bundleback:' + slug;
  back.x = chipNode.x + 6; back.y = chipNode.y + 6;
  back.resize(chipNode.width, chipNode.height);
  back.cornerRadius = 16;
  back.fills = [{ ...solid('#C7C7C1'), opacity: 0.5 }];
  back.strokes = [];
  return back; // then reorder behind the chip and group both
}

// Span rail (A): a continuant across a span of stages. Sits below/above the band;
// left/right edges align to the first/last stage it spans. Exchanges = port dots.
function rail(slug, title, sub, family, x, y, w, hgt = 160) {
  const r = figma.createShapeWithText();
  r.shapeType = 'ROUNDED_RECTANGLE';
  r.name = 'rail:' + slug;
  r.x = x; r.y = y;
  r.resize(w, hgt);
  r.cornerRadius = 20;
  r.fills = [solid(family.light)];
  r.strokes = [solid(family.mid)];
  r.strokeWeight = 2;
  const t = figma.createText();
  t.name = 'railtitle:' + slug;
  t.fontName = { family: 'Inter', style: 'Semi Bold' };
  t.fontSize = 24;
  t.characters = sub ? title + '\n' + sub : title;
  t.fills = [solid(family.dark)];
  if (sub) {
    const s = title.length + 1;
    t.setRangeFontName(s, t.characters.length, { family: 'Inter', style: 'Regular' });
    t.setRangeFontSize(s, t.characters.length, 18);
    t.setRangeFills(s, t.characters.length, [solid(family.mid)]);
  }
  t.x = x + 32; t.y = y + (hgt - t.height) / 2;
  return { rail: r, label: t }; // group with contents after placing them
}

// Port dot (I): wire replacement — alignment carries the pairing.
// Place on a rail/panel edge at the centerline of the counterpart. order: optional numeral.
function port(slug, x, y, familyMidHex, order = null) {
  const nodes = [];
  const d = figma.createEllipse();
  d.name = 'port:' + slug;
  d.x = x - 7; d.y = y - 7;
  d.resize(14, 14);
  d.fills = [solid(familyMidHex)];
  nodes.push(d);
  if (order !== null) {
    const t = figma.createText();
    t.name = 'portnum:' + slug;
    t.fontName = { family: 'Inter', style: 'Medium' };
    t.fontSize = 16;
    t.characters = String(order);
    t.fills = [solid(familyMidHex)];
    t.x = x + 12; t.y = y - t.height / 2;
    nodes.push(t);
  }
  return nodes;
}

// Emphasis modifiers (components.md): apply AFTER creation.
function mute(node) { node.opacity = 0.55; }
function loadBearing(node) { if ('strokeWeight' in node) node.strokeWeight = Math.round(node.strokeWeight * 1.5 * 10) / 10; }

// Connector by grammar role: 'flow' | 'feedback' | 'loadbearing' | 'mesh' | 'tie'.
// label is human prose or '' — NEVER the slug. Slug goes in .name.
// familyHex: mesh/tie color override — mesh defaults to logic purple but MUST be
// overridden to the local family outside the Logic plane; tie takes the color of the
// non-Process end's plane (Logic purple or Function teal).
function wire(slug, fromId, fromMagnet, toId, toMagnet, role, label = '', familyHex = null) {
  const c = figma.createConnector();
  c.name = slug;
  c.connectorStart = { endpointNodeId: fromId, magnet: fromMagnet };
  c.connectorEnd = { endpointNodeId: toId, magnet: toMagnet };
  const R = {
    flow:        { type: 'ELBOWED', w: 2.6, hex: '#9A9A94', both: false, dash: null },
    feedback:    { type: 'ELBOWED', w: 2.6, hex: '#9A9A94', both: false, dash: [12, 10] },
    loadbearing: { type: 'ELBOWED', w: 6,   hex: '#6428DF', both: true,  dash: null },
    mesh:        { type: 'STRAIGHT', w: 2.2, hex: '#9E6FF6', both: false, dash: null },
    tie:         { type: 'STRAIGHT', w: 2.6, hex: '#6428DF', both: false, dash: [4, 8] },
    pull:        { type: 'STRAIGHT', w: 2.2, hex: '#3E7F76', both: false, dash: [2, 6] },
  }[role];
  if (familyHex && (role === 'mesh' || role === 'tie')) R.hex = familyHex;
  c.connectorLineType = R.type;
  c.strokeWeight = R.w;
  c.strokes = [solid(R.hex)];
  if (R.dash) c.dashPattern = R.dash;
  if (role !== 'mesh' && role !== 'pull') c.connectorEndStrokeCap = 'ARROW_LINES';
  if (R.both) c.connectorStartStrokeCap = 'ARROW_LINES';
  if (label) c.text.characters = label; // font must already be loaded
  return c;
}
