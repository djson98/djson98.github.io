import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
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

/** 히어로: 풀 바닥 + Capybara.glb */
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
    renderer.domElement.style.cursor = 'default'

    /** 레이캐스터 */
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    renderer.domElement.addEventListener('pointermove', (e) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObject(group, true)
      renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'default'
    })
    renderer.domElement.addEventListener('pointerdown', (e) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObject(group, true)
      if (hits.length > 0) {
        jumpVelocity = JUMP_FORCE
        isJumping = true
      }
    })

    scene.add(new THREE.AmbientLight(0xffffff, 0.72))
    const key = new THREE.DirectionalLight(0xffffff, 0.85)
    key.position.set(2.5, 5, 4)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xb8d4ff, 0.35)
    rim.position.set(-2, 1, -3)
    scene.add(rim)

    const groundGeo = new THREE.PlaneGeometry(5.5, 3.2)
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x4f9f6a,
      roughness: 0.95,
      metalness: 0,
    })
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.003
    scene.add(ground)

    const group = new THREE.Group()
    scene.add(group)

    /** +X 쪽을 볼 때 기준 Y (반대로 갈 때는 여기에 π 더함) */
    const facePlusX = Math.PI / 2

    let mixer: THREE.AnimationMixer | null = null
    let capyModel: THREE.Object3D | null = null
    let proceduralWalk = false
    let walkPhase = 0

    /** 점프 상태 */
    let jumpVelocity = 0
    let jumpY = 0
    let isJumping = false
    const JUMP_FORCE = 0.7
    const GRAVITY = 2.4

    const walkBounds = { min: -1.05, max: 1.05 }
    const walkSpeed = 0.09
    let walkDir = 1
    group.position.x = walkBounds.min

    /** 카메라가 따라가는 X (lerp용) */
    let camTargetX = walkBounds.min

    const loader = new GLTFLoader()
    loader.load(
      capybaraGlbUrl,
      (gltf) => {
        if (cancelled) {
          disposeObject3D(gltf.scene)
          return
        }

        const model = gltf.scene
        const box = new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z, 0.001)
        const target = 0.55
        model.scale.setScalar(target / maxDim)

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

      // 카피바라 이동
      let nextX = group.position.x + walkSpeed * delta * walkDir
      if (walkDir > 0 && nextX >= walkBounds.max) {
        nextX = walkBounds.max
        walkDir = -1
      } else if (walkDir < 0 && nextX <= walkBounds.min) {
        nextX = walkBounds.min
        walkDir = 1
      }
      group.position.x = nextX

      // 점프 물리
      if (isJumping) {
        jumpVelocity -= GRAVITY * delta
        jumpY += jumpVelocity * delta
        if (jumpY <= 0) {
          jumpY = 0
          jumpVelocity = 0
          isJumping = false
        }
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

      // 카메라가 카피바라 X를 부드럽게 따라감 (Y/Z 고정)
      const followLerp = 1 - Math.pow(0.02, delta)
      camTargetX += (group.position.x - camTargetX) * followLerp
      camera.position.x = camTargetX
      camera.lookAt(camTargetX, 0.12, 0)

      if (mixer) mixer.update(delta)
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
      if (capyModel) disposeObject3D(capyModel)
      groundGeo.dispose()
      groundMat.dispose()
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 h-full w-full" aria-hidden />
}
