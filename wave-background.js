/**
 * Chromatic Aberration WebGL Sine Wave
 * High-performance 60fps procedural GLSL background
 * Official visual signature for Nave AI (nave.ozati.co)
 */

export function initWaveBackground(canvasElement) {
  if (!canvasElement) return null;

  const gl = canvasElement.getContext('webgl') || canvasElement.getContext('experimental-webgl');
  if (!gl) {
    console.warn('[Nave Wave] WebGL not supported, falling back.');
    return null;
  }

  // Vertex shader: Fullscreen quad
  const vsSource = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  // Fragment shader: Multi-octave Sine wave with Chromatic Aberration (RGB shift)
  const fsSource = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;

    float wave(float x, float t) {
      float y = sin(x * 3.2 + t * 1.1) * 0.22;
      y += sin(x * 6.5 - t * 0.7) * 0.09;
      y += sin(x * 1.8 + t * 0.3) * 0.14;
      return y;
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
      
      // Mouse interaction
      vec2 mouse = (u_mouse * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
      float mouseDist = length(uv - mouse);
      float mouseRipple = sin(mouseDist * 8.0 - u_time * 2.5) * exp(-mouseDist * 2.2) * 0.07;

      // Chromatic Aberration: Red, Green, Blue channel displacement
      float shift = 0.045;
      
      // Red Channel (shifted forward)
      float waveR = wave(uv.x + shift, u_time * 1.08) + mouseRipple;
      float distR = abs(uv.y - waveR);
      float r = 0.016 / (distR + 0.012);

      // Green Channel (center reference)
      float waveG = wave(uv.x, u_time * 1.0) + mouseRipple * 0.9;
      float distG = abs(uv.y - waveG);
      float g = 0.016 / (distG + 0.012);

      // Blue Channel (shifted backward)
      float waveB = wave(uv.x - shift, u_time * 0.92) + mouseRipple * 0.8;
      float distB = abs(uv.y - waveB);
      float b = 0.018 / (distB + 0.012);

      // Cyber/Aero tint (cyan & violet spectrum)
      vec3 color = vec3(r * 1.15, g * 0.95, b * 1.55);

      // Ambient radial darkness
      float vignette = smoothstep(1.5, 0.15, length(uv));
      color *= vignette;

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  // Compile Shader Helper
  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('[Nave Wave] Shader error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vs = compileShader(gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('[Nave Wave] Program link error:', gl.getProgramInfoLog(program));
    return null;
  }

  gl.useProgram(program);

  // Fullscreen quad buffer (-1 to 1)
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]),
    gl.STATIC_DRAW
  );

  const posAttr = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(posAttr);
  gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

  // Uniform locations
  const uResolution = gl.getUniformLocation(program, 'u_resolution');
  const uTime = gl.getUniformLocation(program, 'u_time');
  const uMouse = gl.getUniformLocation(program, 'u_mouse');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let animId = null;
  const startTime = performance.now();

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvasElement.clientWidth || window.innerWidth;
    const h = canvasElement.clientHeight || window.innerHeight;
    canvasElement.width = w * dpr;
    canvasElement.height = h * dpr;
    gl.viewport(0, 0, canvasElement.width, canvasElement.height);
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    const rect = canvasElement.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) * (canvasElement.width / rect.width);
    mouseY = (rect.height - (e.clientY - rect.top)) * (canvasElement.height / rect.height);
  });

  function render(time) {
    const elapsed = (time - startTime) * 0.001;

    gl.uniform2f(uResolution, canvasElement.width, canvasElement.height);
    gl.uniform1f(uTime, elapsed);
    gl.uniform2f(uMouse, mouseX, mouseY);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    animId = requestAnimationFrame(render);
  }

  animId = requestAnimationFrame(render);

  return {
    destroy() {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    }
  };
}
