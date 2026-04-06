import { useEffect, useRef } from 'react'

// ── Shared vertex shader ──────────────────────────────────────────────────────
const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

// ── Wave simulation (ping-pong) ───────────────────────────────────────────────
const SIM_FRAG = `
precision mediump float;
uniform sampler2D u_prev;
uniform sampler2D u_curr;
uniform vec2  u_res;
uniform vec2  u_mouse;
uniform float u_splash;

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 px = 1.0 / u_res;

  float cur  = texture2D(u_curr, uv).r * 2.0 - 1.0;
  float prev = texture2D(u_prev, uv).r * 2.0 - 1.0;
  float n    = texture2D(u_curr, uv + vec2(0.0,  px.y)).r * 2.0 - 1.0;
  float s    = texture2D(u_curr, uv - vec2(0.0,  px.y)).r * 2.0 - 1.0;
  float e    = texture2D(u_curr, uv + vec2(px.x, 0.0 )).r * 2.0 - 1.0;
  float w    = texture2D(u_curr, uv - vec2(px.x, 0.0 )).r * 2.0 - 1.0;

  float next = 2.0 * cur - prev + 0.35 * (n + s + e + w - 4.0 * cur);
  next *= 0.991;

  if (u_splash > 0.5) {
    float d = length(uv - u_mouse);
    next -= smoothstep(0.06, 0.0, d) * 0.9;
  }

  gl_FragColor = vec4(clamp(next * 0.5 + 0.5, 0.0, 1.0), 0.0, 0.0, 1.0);
}
`

// ── Display: gradient + water distortion + specular ──────────────────────────
const DISP_FRAG = `
precision mediump float;
uniform sampler2D u_water;
uniform vec2  u_res;
uniform float u_time;

vec3 palette(float t) {
  vec3 a = vec3(0.50, 0.52, 0.80);
  vec3 b = vec3(0.35, 0.30, 0.45);
  vec3 c = vec3(0.80, 0.70, 1.00);
  vec3 d = vec3(0.00, 0.15, 0.40);
  return a + b * cos(6.2832 * (c * t + d));
}

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x),
             mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.1 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  uv.y = 1.0 - uv.y;
  vec2 px = 1.0 / u_res;

  // Water normals
  float hr = texture2D(u_water, uv + vec2(px.x,  0.0 )).r * 2.0 - 1.0;
  float hl = texture2D(u_water, uv - vec2(px.x,  0.0 )).r * 2.0 - 1.0;
  float hu = texture2D(u_water, uv + vec2(0.0,   px.y)).r * 2.0 - 1.0;
  float hd = texture2D(u_water, uv - vec2(0.0,   px.y)).r * 2.0 - 1.0;
  vec2 grad = vec2(hr - hl, hu - hd);

  vec2 distorted = clamp(uv + grad * 0.22, 0.0, 1.0);

  // Animated gradient
  float t  = u_time * 0.07;
  vec2 q   = vec2(fbm(distorted + t * 0.5), fbm(distorted + vec2(5.2, 1.3) + t * 0.4));
  vec2 r   = vec2(fbm(distorted + 4.0 * q + vec2(1.7, 9.2) + t * 0.3),
                  fbm(distorted + 4.0 * q + vec2(8.3, 2.8) + t * 0.25));
  float f  = fbm(distorted + 4.0 * r);
  vec3 col = palette(f + 0.5 * length(r) + 0.1 * t);
  col      = mix(col, vec3(0.93, 0.95, 1.0), 0.58);

  // Specular highlight
  float h    = texture2D(u_water, uv).r * 2.0 - 1.0;
  vec3  norm = normalize(vec3(grad * 4.0, 1.0));
  vec3  ldir = normalize(vec3(0.4, 0.7, 1.0));
  float spec = pow(max(dot(reflect(-ldir, norm), vec3(0.0, 0.0, 1.0)), 0.0), 48.0);
  col += vec3(0.7) * spec * smoothstep(0.0, 0.08, abs(h));

  gl_FragColor = vec4(col, 1.0);
}
`

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeProgram(gl: WebGLRenderingContext, fragSrc: string): WebGLProgram {
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src); gl.compileShader(s); return s
  }
  const prog = gl.createProgram()!
  gl.attachShader(prog, compile(gl.VERTEX_SHADER,   VERT))
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc))
  gl.linkProgram(prog)
  return prog
}

function makeFBO(gl: WebGLRenderingContext, w: number, h: number) {
  const tex = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  const fbo = gl.createFramebuffer()!
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  return { tex, fbo }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function GradientShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl')
    if (!gl) return

    const simProg  = makeProgram(gl, SIM_FRAG)
    const dispProg = makeProgram(gl, DISP_FRAG)

    // Fullscreen quad
    const buf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)

    // Uniform locations
    const simU = {
      pos: gl.getAttribLocation(simProg, 'a_pos'),
      prev: gl.getUniformLocation(simProg, 'u_prev'),
      curr: gl.getUniformLocation(simProg, 'u_curr'),
      res:  gl.getUniformLocation(simProg, 'u_res'),
      mouse: gl.getUniformLocation(simProg, 'u_mouse'),
      splash: gl.getUniformLocation(simProg, 'u_splash'),
    }
    const dispU = {
      pos:   gl.getAttribLocation(dispProg, 'a_pos'),
      water: gl.getUniformLocation(dispProg, 'u_water'),
      res:   gl.getUniformLocation(dispProg, 'u_res'),
      time:  gl.getUniformLocation(dispProg, 'u_time'),
    }

    // 3-slot ping-pong FBOs
    let slots: ReturnType<typeof makeFBO>[] = []
    let W = 0, H = 0

    const resize = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      if (w === W && h === H) return
      canvas.width = W = w
      canvas.height = H = h
      slots = [makeFBO(gl, w, h), makeFBO(gl, w, h), makeFBO(gl, w, h)]
    }
    resize()

    // Mouse state
    const mouse = { x: 0.5, y: 0.5, active: false }
    let moveTimer: ReturnType<typeof setTimeout>

    const getUV = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: (e.clientX - rect.left) / rect.width,
        y: 1.0 - (e.clientY - rect.top) / rect.height,
      }
    }

    const onMove = (e: MouseEvent) => {
      const { x, y } = getUV(e)
      if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
        mouse.x = x; mouse.y = y; mouse.active = true
        clearTimeout(moveTimer)
        moveTimer = setTimeout(() => { mouse.active = false }, 80)
      }
    }

    const onClick = (e: MouseEvent) => {
      const { x, y } = getUV(e)
      if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
        mouse.x = x; mouse.y = y; mouse.active = true
        clearTimeout(moveTimer)
        moveTimer = setTimeout(() => { mouse.active = false }, 120)
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('click', onClick)

    // ping-pong index (points at "prev" slot)
    let idx = 0
    let raf: number
    const start = performance.now()

    const render = () => {
      resize()

      const prevI = idx
      const currI = (idx + 1) % 3
      const nextI = (idx + 2) % 3

      // ── Simulation pass ──
      gl.useProgram(simProg)
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.enableVertexAttribArray(simU.pos)
      gl.vertexAttribPointer(simU.pos, 2, gl.FLOAT, false, 0, 0)

      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, slots[prevI].tex); gl.uniform1i(simU.prev, 0)
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, slots[currI].tex); gl.uniform1i(simU.curr, 1)
      gl.uniform2f(simU.res, W, H)
      gl.uniform2f(simU.mouse, mouse.x, mouse.y)
      gl.uniform1f(simU.splash, mouse.active ? 1.0 : 0.0)

      gl.bindFramebuffer(gl.FRAMEBUFFER, slots[nextI].fbo)
      gl.viewport(0, 0, W, H)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      // ── Display pass ──
      gl.useProgram(dispProg)
      gl.enableVertexAttribArray(dispU.pos)
      gl.vertexAttribPointer(dispU.pos, 2, gl.FLOAT, false, 0, 0)

      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, slots[nextI].tex); gl.uniform1i(dispU.water, 0)
      gl.uniform2f(dispU.res, W, H)
      gl.uniform1f(dispU.time, (performance.now() - start) / 1000)

      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, W, H)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      idx = (idx + 1) % 3
      raf = requestAnimationFrame(render)
    }

    render()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
      clearTimeout(moveTimer)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
}
