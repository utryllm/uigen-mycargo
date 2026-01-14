// This API generates an HTML page that can be captured client-side
// Since server-side screenshot requires Puppeteer which needs system dependencies,
// we return HTML that the client can render in a controlled iframe
export async function POST(req: Request) {
  try {
    const { code, name } = await req.json();

    if (!code) {
      return new Response('No code provided', { status: 400 });
    }

    // Clean up the code
    let cleanCode = code;
    if (cleanCode.startsWith('```')) {
      const firstNewline = cleanCode.indexOf('\n');
      cleanCode = cleanCode.substring(firstNewline + 1);
    }
    if (cleanCode.endsWith('```')) {
      cleanCode = cleanCode.substring(0, cleanCode.lastIndexOf('```'));
    }
    cleanCode = cleanCode.trim();

    // Remove 'use client' directive for static rendering
    cleanCode = cleanCode.replace(/'use client';?\s*/g, '');
    cleanCode = cleanCode.replace(/"use client";?\s*/g, '');

    // Remove all import statements (we provide globals instead)
    // This handles various import formats including multi-line imports
    // First, remove multi-line imports using regex (using [\s\S] instead of . with s flag for compatibility)
    cleanCode = cleanCode.replace(/import\s*\{[\s\S]*?\}\s*from\s*['"][^'"]+['"];?\s*/g, '');
    cleanCode = cleanCode.replace(/import\s+\w+\s*,?\s*\{[\s\S]*?\}\s*from\s*['"][^'"]+['"];?\s*/g, '');
    cleanCode = cleanCode.replace(/import\s+\w+\s+from\s*['"][^'"]+['"];?\s*/g, '');
    cleanCode = cleanCode.replace(/import\s*['"][^'"]+['"];?\s*/g, '');

    // Also filter line by line for any remaining imports
    cleanCode = cleanCode
      .split('\n')
      .filter((line: string) => {
        const trimmed = line.trim();
        // Skip lines that start with 'import'
        if (trimmed.startsWith('import ') || trimmed.startsWith('import{') || trimmed.startsWith('import(')) {
          return false;
        }
        return true;
      })
      .join('\n');

    // Convert 'export default function ComponentName' to 'function ComponentName'
    // and track the component name for rendering
    let componentName = 'App';

    // Match: export default function ComponentName
    const exportDefaultFuncMatch = cleanCode.match(/export\s+default\s+function\s+(\w+)/);
    if (exportDefaultFuncMatch) {
      componentName = exportDefaultFuncMatch[1];
      cleanCode = cleanCode.replace(/export\s+default\s+function\s+(\w+)/, 'function $1');
    }

    // Match: const ComponentName = () => or function ComponentName()
    if (!exportDefaultFuncMatch) {
      // Try to find arrow function component: const ComponentName = () =>
      const arrowFuncMatch = cleanCode.match(/(?:const|let|var)\s+(\w+)\s*=\s*\([^)]*\)\s*=>/);
      if (arrowFuncMatch) {
        componentName = arrowFuncMatch[1];
      }
      // Try to find regular function: function ComponentName(
      const funcMatch = cleanCode.match(/function\s+(\w+)\s*\(/);
      if (funcMatch) {
        componentName = funcMatch[1];
      }
    }

    // Match: export default ComponentName (at end of file)
    const exportDefaultMatch = cleanCode.match(/export\s+default\s+(\w+)\s*;?\s*$/);
    if (exportDefaultMatch && !exportDefaultFuncMatch) {
      componentName = exportDefaultMatch[1];
      cleanCode = cleanCode.replace(/export\s+default\s+\w+\s*;?\s*$/, '');
    }

    // Remove any remaining 'export' keywords
    cleanCode = cleanCode.replace(/export\s+/g, '');

    // Remove TypeScript type annotations that might cause issues
    // Remove interface/type declarations (including multi-line, using [\s\S] for compatibility)
    cleanCode = cleanCode.replace(/interface\s+\w+\s*(?:extends\s+[^{]+)?\{[\s\S]*?\}/g, '');
    cleanCode = cleanCode.replace(/type\s+\w+\s*=\s*(?:\{[\s\S]*?\}|[^;]+);/g, '');

    // Remove type annotations after colons in various contexts
    // Match : followed by type until , or ) or = or { or ; or newline
    // This handles: param: string, param: string[], param: Type | null, etc.
    cleanCode = cleanCode.replace(/:\s*(?:string|number|boolean|any|void|null|undefined|never|unknown|object|symbol|bigint|String|Number|Boolean|Object|Array|Function|Date|RegExp|Error|Promise|Map|Set|Record|Partial|Required|Pick|Omit|Exclude|Extract|NonNullable|ReturnType|Parameters|InstanceType|ThisType)(?:<[^>]*>)?(?:\[\])?(?:\s*\|\s*(?:string|number|boolean|null|undefined|[A-Z]\w*(?:<[^>]*>)?(?:\[\])?))*(?=\s*[,\)=\{;>\n])/g, '');

    // Remove type annotations like : React.FC<Props>, : JSX.Element, : React.ReactNode etc.
    cleanCode = cleanCode.replace(/:\s*(?:React\.)?(?:FC|FunctionComponent|ComponentType|ReactNode|ReactElement|JSX\.Element|CSSProperties|ChangeEvent|MouseEvent|KeyboardEvent|FormEvent|FocusEvent|SyntheticEvent|RefObject|MutableRefObject|Dispatch|SetStateAction)(?:<[^>]*>)?(?=\s*[,\)=\{;>\n])/g, '');

    // Remove type annotations for custom types (PascalCase identifiers after colon)
    cleanCode = cleanCode.replace(/:\s*[A-Z][a-zA-Z0-9]*(?:<[^>]*>)?(?:\[\])?(?:\s*\|\s*(?:null|undefined|[A-Z][a-zA-Z0-9]*(?:<[^>]*>)?(?:\[\])?))*(?=\s*[,\)=\{;>\n])/g, '');

    // Remove generic type parameters from function calls/definitions: <T>, <Props>, etc.
    cleanCode = cleanCode.replace(/<(?:string|number|boolean|any|void|null|undefined|Props|T|K|V|U|State|Action|[A-Z]\w*)(?:\s*,\s*[^>]+)?>\s*(?=\()/g, '');

    // Remove 'as Type' assertions
    cleanCode = cleanCode.replace(/\s+as\s+(?:string|number|boolean|any|const|unknown|null|undefined|[A-Z]\w*(?:<[^>]*>)?)/g, '');

    // Remove angle brackets for generic type parameters in useState, etc: useState<string> -> useState
    cleanCode = cleanCode.replace(/(useState|useRef|useCallback|useMemo|useReducer|useContext|createContext|forwardRef|memo)<[^>]+>/g, '$1');

    // Clean up any remaining standalone type keywords that might have been left
    cleanCode = cleanCode.replace(/\(\s*,/g, '(');  // Fix (,param) -> (param)
    cleanCode = cleanCode.replace(/,\s*,/g, ',');   // Fix param,,param -> param,param
    cleanCode = cleanCode.replace(/,\s*\)/g, ')');  // Fix param,) -> param)

    console.log('Extracted component name:', componentName);

    const screenshotName = name || 'Screen';

    // Generate standalone HTML with React and the component
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${screenshotName} - Protofy Screenshot</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://unpkg.com/react-circular-progressbar@2.1.0/dist/react-circular-progressbar.min.js" crossorigin></script>
  <link rel="stylesheet" href="https://unpkg.com/react-circular-progressbar@2.1.0/dist/styles.css">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .screenshot-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 48px;
      background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      z-index: 9999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .screenshot-toolbar h1 {
      color: white;
      font-size: 14px;
      font-weight: 600;
    }
    .screenshot-toolbar .subtitle {
      color: rgba(255,255,255,0.7);
      font-size: 12px;
      margin-left: 8px;
    }
    .toolbar-buttons {
      display: flex;
      gap: 8px;
    }
    .toolbar-btn {
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    .toolbar-btn-primary {
      background: white;
      color: #6366F1;
    }
    .toolbar-btn-primary:hover {
      background: #F5F5F5;
    }
    .toolbar-btn-primary:disabled {
      opacity: 0.7;
      cursor: wait;
    }
    .toolbar-btn-secondary {
      background: rgba(255,255,255,0.2);
      color: white;
    }
    .toolbar-btn-secondary:hover {
      background: rgba(255,255,255,0.3);
    }
    #root {
      padding-top: 48px;
      min-height: 100vh;
    }
    @media print {
      .screenshot-toolbar { display: none !important; }
      #root { padding-top: 0; }
    }
  </style>
</head>
<body>
  <div class="screenshot-toolbar">
    <div style="display: flex; align-items: center;">
      <h1>${screenshotName}</h1>
      <span class="subtitle">• Protofy Preview</span>
    </div>
    <div class="toolbar-buttons">
      <button id="downloadBtn" class="toolbar-btn toolbar-btn-primary" onclick="downloadAsImage()">
        📥 Download PNG
      </button>
      <button class="toolbar-btn toolbar-btn-secondary" onclick="window.close()">
        Close
      </button>
    </div>
  </div>
  <div id="root">
    <div id="loading" style="padding: 40px; text-align: center; color: #666;">
      <p>Loading component...</p>
    </div>
  </div>
  <script>
    // Global error handler to catch Babel compilation errors
    window.onerror = function(message, source, lineno, colno, error) {
      console.error('Global error:', message, error);
      document.getElementById('root').innerHTML = '<div style="padding: 40px; text-align: center; background: #FEE2E2; color: #DC2626; border-radius: 8px; margin: 20px;"><h2 style="margin-bottom: 10px;">JavaScript Error</h2><pre style="text-align: left; font-size: 12px; overflow: auto; white-space: pre-wrap;">' + message + '</pre></div>';
      return true;
    };
  </script>
  <script>
    async function downloadAsImage() {
      const btn = document.getElementById('downloadBtn');
      btn.disabled = true;
      btn.textContent = '⏳ Capturing...';

      try {
        // Hide toolbar temporarily
        const toolbar = document.querySelector('.screenshot-toolbar');
        toolbar.style.display = 'none';
        document.getElementById('root').style.paddingTop = '0';

        // Wait for any animations to settle
        await new Promise(r => setTimeout(r, 100));

        // Capture the content
        const canvas = await html2canvas(document.getElementById('root'), {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
        });

        // Restore toolbar
        toolbar.style.display = 'flex';
        document.getElementById('root').style.paddingTop = '48px';

        // Download the image
        const link = document.createElement('a');
        link.download = '${screenshotName.replace(/'/g, "\\'")}.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        btn.textContent = '✅ Downloaded!';
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = '📥 Download PNG';
        }, 2000);
      } catch (error) {
        console.error('Screenshot failed:', error);
        btn.disabled = false;
        btn.textContent = '❌ Failed - Try Again';
        setTimeout(() => {
          btn.textContent = '📥 Download PNG';
        }, 2000);
      }
    }
  </script>
  <script type="text/babel" data-presets="react,typescript" data-type="module">
    // Mock lucide-react icons
    const createIcon = (name, paths) => {
      return function Icon({ className, style, ...props }) {
        return React.createElement('svg', {
          xmlns: 'http://www.w3.org/2000/svg',
          width: 24,
          height: 24,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          className,
          style,
          ...props
        }, paths);
      };
    };

    // Common icons used in banking UIs
    const Home = createIcon('Home', [
      React.createElement('path', { key: '1', d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }),
      React.createElement('polyline', { key: '2', points: '9 22 9 12 15 12 15 22' })
    ]);
    const CreditCard = createIcon('CreditCard', [
      React.createElement('rect', { key: '1', width: '20', height: '14', x: '2', y: '5', rx: '2' }),
      React.createElement('line', { key: '2', x1: '2', x2: '22', y1: '10', y2: '10' })
    ]);
    const DollarSign = createIcon('DollarSign', [
      React.createElement('line', { key: '1', x1: '12', x2: '12', y1: '2', y2: '22' }),
      React.createElement('path', { key: '2', d: 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' })
    ]);
    const TrendingUp = createIcon('TrendingUp', [
      React.createElement('polyline', { key: '1', points: '22 7 13.5 15.5 8.5 10.5 2 17' }),
      React.createElement('polyline', { key: '2', points: '16 7 22 7 22 13' })
    ]);
    const TrendingDown = createIcon('TrendingDown', [
      React.createElement('polyline', { key: '1', points: '22 17 13.5 8.5 8.5 13.5 2 7' }),
      React.createElement('polyline', { key: '2', points: '16 17 22 17 22 11' })
    ]);
    const ArrowRight = createIcon('ArrowRight', [
      React.createElement('line', { key: '1', x1: '5', x2: '19', y1: '12', y2: '12' }),
      React.createElement('polyline', { key: '2', points: '12 5 19 12 12 19' })
    ]);
    const ArrowLeft = createIcon('ArrowLeft', [
      React.createElement('line', { key: '1', x1: '19', x2: '5', y1: '12', y2: '12' }),
      React.createElement('polyline', { key: '2', points: '12 19 5 12 12 5' })
    ]);
    const Bell = createIcon('Bell', [
      React.createElement('path', { key: '1', d: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' }),
      React.createElement('path', { key: '2', d: 'M10.3 21a1.94 1.94 0 0 0 3.4 0' })
    ]);
    const User = createIcon('User', [
      React.createElement('path', { key: '1', d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' }),
      React.createElement('circle', { key: '2', cx: '12', cy: '7', r: '4' })
    ]);
    const Users = createIcon('Users', [
      React.createElement('path', { key: '1', d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }),
      React.createElement('circle', { key: '2', cx: '9', cy: '7', r: '4' }),
      React.createElement('path', { key: '3', d: 'M22 21v-2a4 4 0 0 0-3-3.87' }),
      React.createElement('path', { key: '4', d: 'M16 3.13a4 4 0 0 1 0 7.75' })
    ]);
    const Settings = createIcon('Settings', [
      React.createElement('path', { key: '1', d: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' }),
      React.createElement('circle', { key: '2', cx: '12', cy: '12', r: '3' })
    ]);
    const Search = createIcon('Search', [
      React.createElement('circle', { key: '1', cx: '11', cy: '11', r: '8' }),
      React.createElement('line', { key: '2', x1: '21', x2: '16.65', y1: '21', y2: '16.65' })
    ]);
    const Menu = createIcon('Menu', [
      React.createElement('line', { key: '1', x1: '4', x2: '20', y1: '12', y2: '12' }),
      React.createElement('line', { key: '2', x1: '4', x2: '20', y1: '6', y2: '6' }),
      React.createElement('line', { key: '3', x1: '4', x2: '20', y1: '18', y2: '18' })
    ]);
    const X = createIcon('X', [
      React.createElement('line', { key: '1', x1: '18', x2: '6', y1: '6', y2: '18' }),
      React.createElement('line', { key: '2', x1: '6', x2: '18', y1: '6', y2: '18' })
    ]);
    const Check = createIcon('Check', [
      React.createElement('polyline', { key: '1', points: '20 6 9 17 4 12' })
    ]);
    const Plus = createIcon('Plus', [
      React.createElement('line', { key: '1', x1: '12', x2: '12', y1: '5', y2: '19' }),
      React.createElement('line', { key: '2', x1: '5', x2: '19', y1: '12', y2: '12' })
    ]);
    const Minus = createIcon('Minus', [
      React.createElement('line', { key: '1', x1: '5', x2: '19', y1: '12', y2: '12' })
    ]);
    const ChevronRight = createIcon('ChevronRight', [
      React.createElement('polyline', { key: '1', points: '9 18 15 12 9 6' })
    ]);
    const ChevronLeft = createIcon('ChevronLeft', [
      React.createElement('polyline', { key: '1', points: '15 18 9 12 15 6' })
    ]);
    const ChevronDown = createIcon('ChevronDown', [
      React.createElement('polyline', { key: '1', points: '6 9 12 15 18 9' })
    ]);
    const ChevronUp = createIcon('ChevronUp', [
      React.createElement('polyline', { key: '1', points: '18 15 12 9 6 15' })
    ]);
    const Calendar = createIcon('Calendar', [
      React.createElement('rect', { key: '1', width: '18', height: '18', x: '3', y: '4', rx: '2', ry: '2' }),
      React.createElement('line', { key: '2', x1: '16', x2: '16', y1: '2', y2: '6' }),
      React.createElement('line', { key: '3', x1: '8', x2: '8', y1: '2', y2: '6' }),
      React.createElement('line', { key: '4', x1: '3', x2: '21', y1: '10', y2: '10' })
    ]);
    const Clock = createIcon('Clock', [
      React.createElement('circle', { key: '1', cx: '12', cy: '12', r: '10' }),
      React.createElement('polyline', { key: '2', points: '12 6 12 12 16 14' })
    ]);
    const Send = createIcon('Send', [
      React.createElement('line', { key: '1', x1: '22', x2: '11', y1: '2', y2: '13' }),
      React.createElement('polygon', { key: '2', points: '22 2 15 22 11 13 2 9 22 2' })
    ]);
    const Wallet = createIcon('Wallet', [
      React.createElement('path', { key: '1', d: 'M21 12V7H5a2 2 0 0 1 0-4h14v4' }),
      React.createElement('path', { key: '2', d: 'M3 5v14a2 2 0 0 0 2 2h16v-5' }),
      React.createElement('path', { key: '3', d: 'M18 12a2 2 0 0 0 0 4h4v-4Z' })
    ]);
    const Building = createIcon('Building', [
      React.createElement('rect', { key: '1', width: '16', height: '20', x: '4', y: '2', rx: '2', ry: '2' }),
      React.createElement('path', { key: '2', d: 'M9 22v-4h6v4' }),
      React.createElement('path', { key: '3', d: 'M8 6h.01' }),
      React.createElement('path', { key: '4', d: 'M16 6h.01' }),
      React.createElement('path', { key: '5', d: 'M12 6h.01' }),
      React.createElement('path', { key: '6', d: 'M12 10h.01' }),
      React.createElement('path', { key: '7', d: 'M12 14h.01' }),
      React.createElement('path', { key: '8', d: 'M16 10h.01' }),
      React.createElement('path', { key: '9', d: 'M16 14h.01' }),
      React.createElement('path', { key: '10', d: 'M8 10h.01' }),
      React.createElement('path', { key: '11', d: 'M8 14h.01' })
    ]);
    const PiggyBank = createIcon('PiggyBank', [
      React.createElement('path', { key: '1', d: 'M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z' }),
      React.createElement('path', { key: '2', d: 'M2 9v1c0 1.1.9 2 2 2h1' }),
      React.createElement('path', { key: '3', d: 'M16 11h.01' })
    ]);
    const Target = createIcon('Target', [
      React.createElement('circle', { key: '1', cx: '12', cy: '12', r: '10' }),
      React.createElement('circle', { key: '2', cx: '12', cy: '12', r: '6' }),
      React.createElement('circle', { key: '3', cx: '12', cy: '12', r: '2' })
    ]);
    const BarChart3 = createIcon('BarChart3', [
      React.createElement('path', { key: '1', d: 'M3 3v18h18' }),
      React.createElement('path', { key: '2', d: 'M18 17V9' }),
      React.createElement('path', { key: '3', d: 'M13 17V5' }),
      React.createElement('path', { key: '4', d: 'M8 17v-3' })
    ]);
    const LineChart = createIcon('LineChart', [
      React.createElement('path', { key: '1', d: 'M3 3v18h18' }),
      React.createElement('path', { key: '2', d: 'M18.7 8l-5.1 5.2-2.8-2.7L7 14.3' })
    ]);
    const PieChart = createIcon('PieChart', [
      React.createElement('path', { key: '1', d: 'M21.21 15.89A10 10 0 1 1 8 2.83' }),
      React.createElement('path', { key: '2', d: 'M22 12A10 10 0 0 0 12 2v10z' })
    ]);
    const FileText = createIcon('FileText', [
      React.createElement('path', { key: '1', d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z' }),
      React.createElement('polyline', { key: '2', points: '14 2 14 8 20 8' }),
      React.createElement('line', { key: '3', x1: '16', x2: '8', y1: '13', y2: '13' }),
      React.createElement('line', { key: '4', x1: '16', x2: '8', y1: '17', y2: '17' }),
      React.createElement('line', { key: '5', x1: '10', x2: '8', y1: '9', y2: '9' })
    ]);
    const Download = createIcon('Download', [
      React.createElement('path', { key: '1', d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
      React.createElement('polyline', { key: '2', points: '7 10 12 15 17 10' }),
      React.createElement('line', { key: '3', x1: '12', x2: '12', y1: '15', y2: '3' })
    ]);
    const Upload = createIcon('Upload', [
      React.createElement('path', { key: '1', d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
      React.createElement('polyline', { key: '2', points: '17 8 12 3 7 8' }),
      React.createElement('line', { key: '3', x1: '12', x2: '12', y1: '3', y2: '15' })
    ]);
    const Eye = createIcon('Eye', [
      React.createElement('path', { key: '1', d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' }),
      React.createElement('circle', { key: '2', cx: '12', cy: '12', r: '3' })
    ]);
    const EyeOff = createIcon('EyeOff', [
      React.createElement('path', { key: '1', d: 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' }),
      React.createElement('line', { key: '2', x1: '1', x2: '23', y1: '1', y2: '23' })
    ]);
    const Phone = createIcon('Phone', [
      React.createElement('path', { key: '1', d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' })
    ]);
    const Mail = createIcon('Mail', [
      React.createElement('rect', { key: '1', width: '20', height: '16', x: '2', y: '4', rx: '2' }),
      React.createElement('path', { key: '2', d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' })
    ]);
    const MessageSquare = createIcon('MessageSquare', [
      React.createElement('path', { key: '1', d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' })
    ]);
    const Shield = createIcon('Shield', [
      React.createElement('path', { key: '1', d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' })
    ]);
    const Lock = createIcon('Lock', [
      React.createElement('rect', { key: '1', width: '18', height: '11', x: '3', y: '11', rx: '2', ry: '2' }),
      React.createElement('path', { key: '2', d: 'M7 11V7a5 5 0 0 1 10 0v4' })
    ]);
    const AlertCircle = createIcon('AlertCircle', [
      React.createElement('circle', { key: '1', cx: '12', cy: '12', r: '10' }),
      React.createElement('line', { key: '2', x1: '12', x2: '12', y1: '8', y2: '12' }),
      React.createElement('line', { key: '3', x1: '12', x2: '12.01', y1: '16', y2: '16' })
    ]);
    const Info = createIcon('Info', [
      React.createElement('circle', { key: '1', cx: '12', cy: '12', r: '10' }),
      React.createElement('line', { key: '2', x1: '12', x2: '12', y1: '16', y2: '12' }),
      React.createElement('line', { key: '3', x1: '12', x2: '12.01', y1: '8', y2: '8' })
    ]);
    const HelpCircle = createIcon('HelpCircle', [
      React.createElement('circle', { key: '1', cx: '12', cy: '12', r: '10' }),
      React.createElement('path', { key: '2', d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' }),
      React.createElement('line', { key: '3', x1: '12', x2: '12.01', y1: '17', y2: '17' })
    ]);
    const RefreshCw = createIcon('RefreshCw', [
      React.createElement('path', { key: '1', d: 'M21 2v6h-6' }),
      React.createElement('path', { key: '2', d: 'M3 12a9 9 0 0 1 15-6.7L21 8' }),
      React.createElement('path', { key: '3', d: 'M3 22v-6h6' }),
      React.createElement('path', { key: '4', d: 'M21 12a9 9 0 0 1-15 6.7L3 16' })
    ]);
    const MoreVertical = createIcon('MoreVertical', [
      React.createElement('circle', { key: '1', cx: '12', cy: '12', r: '1' }),
      React.createElement('circle', { key: '2', cx: '12', cy: '5', r: '1' }),
      React.createElement('circle', { key: '3', cx: '12', cy: '19', r: '1' })
    ]);
    const MoreHorizontal = createIcon('MoreHorizontal', [
      React.createElement('circle', { key: '1', cx: '12', cy: '12', r: '1' }),
      React.createElement('circle', { key: '2', cx: '5', cy: '12', r: '1' }),
      React.createElement('circle', { key: '3', cx: '19', cy: '12', r: '1' })
    ]);
    const Star = createIcon('Star', [
      React.createElement('polygon', { key: '1', points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' })
    ]);
    const Heart = createIcon('Heart', [
      React.createElement('path', { key: '1', d: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' })
    ]);
    const MapPin = createIcon('MapPin', [
      React.createElement('path', { key: '1', d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' }),
      React.createElement('circle', { key: '2', cx: '12', cy: '10', r: '3' })
    ]);
    const Gift = createIcon('Gift', [
      React.createElement('polyline', { key: '1', points: '20 12 20 22 4 22 4 12' }),
      React.createElement('rect', { key: '2', width: '20', height: '5', x: '2', y: '7' }),
      React.createElement('line', { key: '3', x1: '12', x2: '12', y1: '22', y2: '7' }),
      React.createElement('path', { key: '4', d: 'M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z' }),
      React.createElement('path', { key: '5', d: 'M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z' })
    ]);
    const Zap = createIcon('Zap', [
      React.createElement('polygon', { key: '1', points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' })
    ]);
    const Activity = createIcon('Activity', [
      React.createElement('polyline', { key: '1', points: '22 12 18 12 15 21 9 3 6 12 2 12' })
    ]);
    const Briefcase = createIcon('Briefcase', [
      React.createElement('rect', { key: '1', width: '20', height: '14', x: '2', y: '7', rx: '2', ry: '2' }),
      React.createElement('path', { key: '2', d: 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' })
    ]);
    const Building2 = createIcon('Building2', [
      React.createElement('path', { key: '1', d: 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z' }),
      React.createElement('path', { key: '2', d: 'M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2' }),
      React.createElement('path', { key: '3', d: 'M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2' }),
      React.createElement('path', { key: '4', d: 'M10 6h4' }),
      React.createElement('path', { key: '5', d: 'M10 10h4' }),
      React.createElement('path', { key: '6', d: 'M10 14h4' }),
      React.createElement('path', { key: '7', d: 'M10 18h4' })
    ]);
    const Landmark = createIcon('Landmark', [
      React.createElement('line', { key: '1', x1: '3', x2: '21', y1: '22', y2: '22' }),
      React.createElement('line', { key: '2', x1: '6', x2: '6', y1: '18', y2: '11' }),
      React.createElement('line', { key: '3', x1: '10', x2: '10', y1: '18', y2: '11' }),
      React.createElement('line', { key: '4', x1: '14', x2: '14', y1: '18', y2: '11' }),
      React.createElement('line', { key: '5', x1: '18', x2: '18', y1: '18', y2: '11' }),
      React.createElement('polygon', { key: '6', points: '12 2 20 7 4 7' })
    ]);
    const Receipt = createIcon('Receipt', [
      React.createElement('path', { key: '1', d: 'M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z' }),
      React.createElement('path', { key: '2', d: 'M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8' }),
      React.createElement('path', { key: '3', d: 'M12 17.5v-11' })
    ]);
    const Banknote = createIcon('Banknote', [
      React.createElement('rect', { key: '1', width: '20', height: '12', x: '2', y: '6', rx: '2' }),
      React.createElement('circle', { key: '2', cx: '12', cy: '12', r: '2' }),
      React.createElement('path', { key: '3', d: 'M6 12h.01M18 12h.01' })
    ]);
    const ArrowUpRight = createIcon('ArrowUpRight', [
      React.createElement('line', { key: '1', x1: '7', x2: '17', y1: '17', y2: '7' }),
      React.createElement('polyline', { key: '2', points: '7 7 17 7 17 17' })
    ]);
    const ArrowDownRight = createIcon('ArrowDownRight', [
      React.createElement('line', { key: '1', x1: '7', x2: '17', y1: '7', y2: '17' }),
      React.createElement('polyline', { key: '2', points: '17 7 17 17 7 17' })
    ]);
    const Sparkles = createIcon('Sparkles', [
      React.createElement('path', { key: '1', d: 'm12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z' }),
      React.createElement('path', { key: '2', d: 'M5 3v4' }),
      React.createElement('path', { key: '3', d: 'M19 17v4' }),
      React.createElement('path', { key: '4', d: 'M3 5h4' }),
      React.createElement('path', { key: '5', d: 'M17 19h4' })
    ]);
    const ExternalLink = createIcon('ExternalLink', [
      React.createElement('path', { key: '1', d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }),
      React.createElement('polyline', { key: '2', points: '15 3 21 3 21 9' }),
      React.createElement('line', { key: '3', x1: '10', x2: '21', y1: '14', y2: '3' })
    ]);
    const Percent = createIcon('Percent', [
      React.createElement('line', { key: '1', x1: '19', x2: '5', y1: '5', y2: '19' }),
      React.createElement('circle', { key: '2', cx: '6.5', cy: '6.5', r: '2.5' }),
      React.createElement('circle', { key: '3', cx: '17.5', cy: '17.5', r: '2.5' })
    ]);
    const Copy = createIcon('Copy', [
      React.createElement('rect', { key: '1', width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2' }),
      React.createElement('path', { key: '2', d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' })
    ]);
    const Trash2 = createIcon('Trash2', [
      React.createElement('path', { key: '1', d: 'M3 6h18' }),
      React.createElement('path', { key: '2', d: 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' }),
      React.createElement('path', { key: '3', d: 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' }),
      React.createElement('line', { key: '4', x1: '10', x2: '10', y1: '11', y2: '17' }),
      React.createElement('line', { key: '5', x1: '14', x2: '14', y1: '11', y2: '17' })
    ]);
    const Edit = createIcon('Edit', [
      React.createElement('path', { key: '1', d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' }),
      React.createElement('path', { key: '2', d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' })
    ]);
    const Filter = createIcon('Filter', [
      React.createElement('polygon', { key: '1', points: '22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3' })
    ]);
    const Share2 = createIcon('Share2', [
      React.createElement('circle', { key: '1', cx: '18', cy: '5', r: '3' }),
      React.createElement('circle', { key: '2', cx: '6', cy: '12', r: '3' }),
      React.createElement('circle', { key: '3', cx: '18', cy: '19', r: '3' }),
      React.createElement('line', { key: '4', x1: '8.59', x2: '15.42', y1: '13.51', y2: '17.49' }),
      React.createElement('line', { key: '5', x1: '15.41', x2: '8.59', y1: '6.51', y2: '10.49' })
    ]);
    const LogOut = createIcon('LogOut', [
      React.createElement('path', { key: '1', d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }),
      React.createElement('polyline', { key: '2', points: '16 17 21 12 16 7' }),
      React.createElement('line', { key: '3', x1: '21', x2: '9', y1: '12', y2: '12' })
    ]);
    const Globe = createIcon('Globe', [
      React.createElement('circle', { key: '1', cx: '12', cy: '12', r: '10' }),
      React.createElement('line', { key: '2', x1: '2', x2: '22', y1: '12', y2: '12' }),
      React.createElement('path', { key: '3', d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' })
    ]);
    const QrCode = createIcon('QrCode', [
      React.createElement('rect', { key: '1', width: '5', height: '5', x: '3', y: '3', rx: '1' }),
      React.createElement('rect', { key: '2', width: '5', height: '5', x: '16', y: '3', rx: '1' }),
      React.createElement('rect', { key: '3', width: '5', height: '5', x: '3', y: '16', rx: '1' }),
      React.createElement('path', { key: '4', d: 'M21 16h-3a2 2 0 0 0-2 2v3' }),
      React.createElement('path', { key: '5', d: 'M21 21v.01' }),
      React.createElement('path', { key: '6', d: 'M12 7v3a2 2 0 0 1-2 2H7' }),
      React.createElement('path', { key: '7', d: 'M3 12h.01' }),
      React.createElement('path', { key: '8', d: 'M12 3h.01' }),
      React.createElement('path', { key: '9', d: 'M12 16v.01' }),
      React.createElement('path', { key: '10', d: 'M16 12h1' }),
      React.createElement('path', { key: '11', d: 'M21 12v.01' }),
      React.createElement('path', { key: '12', d: 'M12 21v-1' })
    ]);
    const Smartphone = createIcon('Smartphone', [
      React.createElement('rect', { key: '1', width: '14', height: '20', x: '5', y: '2', rx: '2', ry: '2' }),
      React.createElement('path', { key: '2', d: 'M12 18h.01' })
    ]);
    const CreditCardIcon = CreditCard;

    // Mock recharts - create simple div placeholders
    const AreaChart = ({ children, ...props }) => React.createElement('div', { style: { width: '100%', height: '100%' }, ...props }, children);
    const Area = () => null;
    const XAxis = () => null;
    const YAxis = () => null;
    const CartesianGrid = () => null;
    const Tooltip = () => null;
    const ResponsiveContainer = ({ children, ...props }) => React.createElement('div', { style: { width: '100%', height: '100%' }, ...props }, children);
    const BarChart = ({ children, ...props }) => React.createElement('div', { style: { width: '100%', height: '100%' }, ...props }, children);
    const Bar = () => null;
    const LineChartComponent = ({ children, ...props }) => React.createElement('div', { style: { width: '100%', height: '100%' }, ...props }, children);
    const Line = () => null;
    const PieChartComponent = ({ children, ...props }) => React.createElement('div', { style: { width: '100%', height: '100%' }, ...props }, children);
    const Pie = () => null;
    const Cell = () => null;
    const Legend = () => null;

    // Mock clsx
    const clsx = (...args) => args.filter(Boolean).join(' ');
    const cn = clsx;

    // React Circular Progressbar (loaded from CDN)
    const CircularProgressbar = window.ReactCircularProgressbar?.CircularProgressbar || (({ value, text, styles }) =>
      React.createElement('div', {
        style: {
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '8px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 'bold'
        }
      }, text || value + '%')
    );
    const buildStyles = window.ReactCircularProgressbar?.buildStyles || ((config) => config);

    // Helper for useState
    const { useState, useEffect, useCallback, useMemo, useRef } = React;

    ${cleanCode}

    // Render the component
    const rootElement = document.getElementById('root');
    const root = ReactDOM.createRoot(rootElement);

    // Try to find the component by the extracted name, or fall back to common names
    // Log available functions for debugging
    console.log('Looking for component: ${componentName}');
    console.log('Available components:', {
      extracted: typeof ${componentName} !== 'undefined',
      App: typeof App !== 'undefined',
      Dashboard: typeof Dashboard !== 'undefined',
      BusinessDashboard: typeof BusinessDashboard !== 'undefined',
      RetailDashboard: typeof RetailDashboard !== 'undefined',
      FinancialPlanningHub: typeof FinancialPlanningHub !== 'undefined',
      FinancialPlanning: typeof FinancialPlanning !== 'undefined',
      PlanningHub: typeof PlanningHub !== 'undefined',
      Screen: typeof Screen !== 'undefined',
      Component: typeof Component !== 'undefined',
      Page: typeof Page !== 'undefined',
    });

    const ComponentToRender = typeof ${componentName} !== 'undefined' ? ${componentName}
      : typeof App !== 'undefined' ? App
      : typeof Dashboard !== 'undefined' ? Dashboard
      : typeof BusinessDashboard !== 'undefined' ? BusinessDashboard
      : typeof RetailDashboard !== 'undefined' ? RetailDashboard
      : typeof FinancialPlanningHub !== 'undefined' ? FinancialPlanningHub
      : typeof FinancialPlanning !== 'undefined' ? FinancialPlanning
      : typeof PlanningHub !== 'undefined' ? PlanningHub
      : typeof Screen !== 'undefined' ? Screen
      : typeof Component !== 'undefined' ? Component
      : typeof Page !== 'undefined' ? Page
      : typeof Main !== 'undefined' ? Main
      : typeof Home !== 'undefined' ? Home
      : () => React.createElement('div', { style: { padding: '20px', textAlign: 'center', color: 'red' } }, 'Component "${componentName}" not found. Check browser console for available components.');

    try {
      root.render(React.createElement(ComponentToRender));
    } catch (renderError) {
      console.error('Render error:', renderError);
      root.render(React.createElement('div', {
        style: {
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#FEE2E2',
          color: '#DC2626',
          borderRadius: '8px',
          margin: '20px'
        }
      }, [
        React.createElement('h2', { key: 'h', style: { marginBottom: '10px', fontSize: '18px' } }, 'Render Error'),
        React.createElement('pre', { key: 'p', style: { textAlign: 'left', fontSize: '12px', overflow: 'auto', whiteSpace: 'pre-wrap' } }, renderError.toString())
      ]));
    }
  </script>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Screenshot HTML generation error:', error);
    return new Response('Failed to generate screenshot HTML', { status: 500 });
  }
}
