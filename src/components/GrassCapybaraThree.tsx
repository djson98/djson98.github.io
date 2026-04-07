import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import capybaraGlbUrl from '../../asset/Capybara.glb?url'

function pickWalkClip(clips: THREE.AnimationClip[]): THREE.AnimationClip | null {
  if (clips.length === 0) return null
  const byName = clips.find((c) => /walk|run|locomotion|move|jog/i.test(c.name))
  if (byName) return byName
  const noIdle = clips.find((c) => !/idle|rest|sit|sleep/i.test(c.name))
  return noIdle ?? clips[0]
}

function disposeObject3D(root: THREE.Object3D) {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry?.dispose()
      const mat = obj.material
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
      else mat?.dispose()
    }
  })
}

/** 풀잎: 4단계 곡선형, 밑동 넓고 끝 살짝 앞으로 휘어짐 */
function createBladeGeometry(): THREE.BufferGeometry {
  const bw = 0.022
  const h = 0.10
  // 각 레벨: [left-x, right-x, y, z-curve]
  const levels = [
    [ -bw,      bw,      0,       0      ],  // 0,1 base
    [ -bw*0.7,  bw*0.7,  h*0.35,  0.005  ],  // 2,3 lower-mid
    [ -bw*0.35, bw*0.35, h*0.7,   0.014  ],  // 4,5 upper-mid
    [  0,       0,       h,       0.022  ],  // 6   tip (degenerate)
  ]
  const pos: number[] = []
  const uvs: number[] = []
  levels.forEach(([lx, rx, y, z], i) => {
    const v = i / (levels.length - 1)
    pos.push(lx, y, z,  rx, y, z)
    uvs.push(0, v,  1, v)
  })
  // tip: merge last two to single point
  // indices: pairs of quads across levels
  const idx: number[] = []
  for (let i = 0; i < levels.length - 1; i++) {
    const a = i * 2, b = i * 2 + 1, c = (i + 1) * 2, d = (i + 1) * 2 + 1
    idx.push(a, b, d,  a, d, c)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3))
  geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))
  geo.setIndex(idx)
  return geo
}

const GRASS_VERT = /* glsl */ `
uniform float uTime;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;

  // 높이에 비례해서 바람 세게 (밑동은 고정)
  float windPower = pos.y * pos.y * 4.0;
  vec3 iPos = instanceMatrix[3].xyz;
  pos.x += sin(uTime * 2.0 + iPos.x * 1.2 + iPos.z * 0.5) * 0.06 * windPower;
  pos.z += cos(uTime * 1.5 + iPos.z * 1.0 + iPos.x * 0.3) * 0.03 * windPower;

  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
}
`

const GRASS_FRAG = /* glsl */ `
varying vec2 vUv;

void main() {
  vec3 base = vec3(0.13, 0.42, 0.08);
  vec3 tip  = vec3(0.40, 0.78, 0.20);
  gl_FragColor = vec4(mix(base, tip, vUv.y), 1.0);
}
`

/** 히어로: 풀밭 + Capybara.glb */
export default function GrassCapybaraThree() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let cancelled = false

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xeef6fc)

    const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 50)
    camera.position.set(0, 0.22, 0.95)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0xeef6fc, 1)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    el.appendChild(renderer.domElement)
    renderer.domElement.style.cursor = 'grab'

    // 레이캐스터 (점프 클릭용)
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    let overCapybara = false

    renderer.domElement.addEventListener('pointermove', (e) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      overCapybara = raycaster.intersectObject(group, true).length > 0
      renderer.domElement.style.cursor = overCapybara ? 'pointer' : 'grab'
    })
    renderer.domElement.addEventListener('pointerdown', (e) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      if (raycaster.intersectObject(group, true).length > 0) {
        jumpVelocity = JUMP_FORCE
        isJumping = true
      } else {
        renderer.domElement.style.cursor = 'grabbing'
      }
    })
    renderer.domElement.addEventListener('pointerup', () => {
      renderer.domElement.style.cursor = overCapybara ? 'pointer' : 'grab'
    })
    renderer.domElement.addEventListener('pointerleave', () => {
      renderer.domElement.style.cursor = 'grab'
      overCapybara = false
    })

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0.12, 0)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.minDistance = 0.45
    controls.maxDistance = 2.8
    controls.minPolarAngle = 0.35
    controls.maxPolarAngle = Math.PI * 0.48
    controls.update()

    scene.add(new THREE.AmbientLight(0xffffff, 0.72))
    const key = new THREE.DirectionalLight(0xffffff, 0.85)
    key.position.set(2.5, 5, 4)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xb8d4ff, 0.35)
    rim.position.set(-2, 1, -3)
    scene.add(rim)

    // 흙 바닥 (풀잎 아래로 살짝 보임)
    const groundGeo = new THREE.PlaneGeometry(5.5, 3.2)
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x3a7a2e, roughness: 0.98, metalness: 0 })
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.003
    scene.add(ground)

    // 풀잎 InstancedMesh
    const BLADE_COUNT = 2500
    const bladeGeo = createBladeGeometry()
    const grassUniforms = { uTime: { value: 0 } }
    const grassMat = new THREE.ShaderMaterial({
      uniforms: grassUniforms,
      vertexShader: GRASS_VERT,
      fragmentShader: GRASS_FRAG,
      side: THREE.DoubleSide,
    })
    const grassMesh = new THREE.InstancedMesh(bladeGeo, grassMat, BLADE_COUNT)
    grassMesh.frustumCulled = false
    const dummy = new THREE.Object3D()
    for (let i = 0; i < BLADE_COUNT; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 5.2,
        0,
        (Math.random() - 0.5) * 3.0,
      )
      // Y: 랜덤 방향, X: 살짝 랜덤 기울기 (자연스럽게 눕는 느낌)
      dummy.rotation.set(
        (Math.random() - 0.5) * 0.3,
        Math.random() * Math.PI * 2,
        0,
      )
      dummy.scale.setScalar(0.45 + Math.random() * 0.45)
      dummy.updateMatrix()
      grassMesh.setMatrixAt(i, dummy.matrix)
    }
    grassMesh.instanceMatrix.needsUpdate = true
    scene.add(grassMesh)

    // 카피바라 그룹
    const group = new THREE.Group()
    scene.add(group)

    const facePlusX = Math.PI / 2

    let mixer: THREE.AnimationMixer | null = null
    let capyModel: THREE.Object3D | null = null
    let proceduralWalk = false
    let walkPhase = 0

    // 점프
    let jumpVelocity = 0
    let jumpY = 0
    let isJumping = false
    const JUMP_FORCE = 0.7
    const GRAVITY = 2.4

    const walkBounds = { min: -1.05, max: 1.05 }
    const walkSpeed = 0.09
    let walkDir = 1
    group.position.x = walkBounds.min

    const loader = new GLTFLoader()
    loader.load(
      capybaraGlbUrl,
      (gltf) => {
        if (cancelled) { disposeObject3D(gltf.scene); return }

        const model = gltf.scene
        const box = new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z, 0.001)
        model.scale.setScalar(0.55 / maxDim)

        const box2 = new THREE.Box3().setFromObject(model)
        model.position.set(
          -box2.getCenter(new THREE.Vector3()).x,
          -box2.min.y,
          -box2.getCenter(new THREE.Vector3()).z,
        )

        group.add(model)
        capyModel = model

        const clip = pickWalkClip(gltf.animations)
        if (clip) {
          mixer = new THREE.AnimationMixer(model)
          const action = mixer.clipAction(clip)
          action.setLoop(THREE.LoopRepeat, Infinity)
          action.clampWhenFinished = false
          action.play()
        } else {
          proceduralWalk = true
        }
      },
      undefined,
      (err) => console.error('Capybara.glb load failed:', err),
    )

    let raf = 0
    let lastFrame = performance.now()
    let elapsed = 0

    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (w < 1 || h < 1) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }
    resize()

    const tick = (now: number) => {
      const delta = Math.min((now - lastFrame) / 1000, 0.1)
      lastFrame = now
      elapsed += delta

      // 풀 바람 시간 업데이트
      grassUniforms.uTime.value = elapsed

      // 카피바라 이동
      let nextX = group.position.x + walkSpeed * delta * walkDir
      if (walkDir > 0 && nextX >= walkBounds.max) { nextX = walkBounds.max; walkDir = -1 }
      else if (walkDir < 0 && nextX <= walkBounds.min) { nextX = walkBounds.min; walkDir = 1 }
      group.position.x = nextX

      // 점프 물리
      if (isJumping) {
        jumpVelocity -= GRAVITY * delta
        jumpY += jumpVelocity * delta
        if (jumpY <= 0) { jumpY = 0; jumpVelocity = 0; isJumping = false }
      }

      if (proceduralWalk) {
        walkPhase += delta * Math.PI * 2 * 0.85
        const s = Math.sin(walkPhase)
        group.position.y = jumpY + s * 0.016
        group.rotation.z = isJumping ? 0 : s * 0.045
      } else {
        group.position.y = jumpY
        group.rotation.z = 0
      }

      group.rotation.y = facePlusX + (walkDir < 0 ? Math.PI : 0)

      controls.target.set(0, 0.12, 0)
      if (mixer) mixer.update(delta)
      controls.update()
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const ro = new ResizeObserver(resize)
    ro.observe(el)
    window.addEventListener('resize', resize)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', resize)
      mixer?.stopAllAction()
      controls.dispose()
      if (capyModel) disposeObject3D(capyModel)
      groundGeo.dispose()
      groundMat.dispose()
      bladeGeo.dispose()
      grassMat.dispose()
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 h-full w-full" aria-hidden />
}
