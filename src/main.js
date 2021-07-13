
import * as THREE from 'three'
import { AmbientLight, PointLightHelper, AudioListener, ExtrudeBufferGeometry, Shape, Vector3, Color, CubeReflectionMapping, Fog, Mesh, MeshPhysicalMaterial, Object3D, PointLight, TextureLoader } from 'three'
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import modelGLTF from '/src/assets/model2.gltf'
import matcap from '/src/assets/matcap7.png'
import matcap2 from '/src/assets/matcap8.jpeg'
import matcap3 from '/src/assets/matcap9.png'
import matcap4 from '/src/assets/matcap10.jpeg'
import matcap5 from '/src/assets/matcap11.jpeg'
import normal from '/src/assets/normal.jpeg'

let scene, camera, controls, renderer, effect, mixer
let light, amb, model, arbre, feuille, shadowLight, cube, sphere, torus, cylinder
const loader = new GLTFLoader()
const imgLoader = new THREE.TextureLoader()
const start = Date.now()
const body = document.querySelector('body')
scene = new THREE.Scene()

let matcapTexture = imgLoader.load(matcap)
let matcapTexture2 = imgLoader.load(matcap2)
let matcapTexture3 = imgLoader.load(matcap3)
let matcapTexture4 = imgLoader.load(matcap4)
let matcapTexture5 = imgLoader.load(matcap5)
let normalTexture = imgLoader.load(normal)


// GLTF
loader.load(
	modelGLTF,
	function (gltf) {
    model = gltf.scene
    arbre = gltf.scene.children[0]
    feuille = gltf.scene.children[1]
    sphere = gltf.scene.children[2]
    torus = gltf.scene.children[3]
    cylinder = gltf.scene.children[4]

    mixer = new THREE.AnimationMixer(gltf.scene)
    console.log(gltf.animations)

    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play()
    })

    arbre.children[0].material = new THREE.MeshMatcapMaterial({matcap: matcapTexture2})
    feuille.children[1].material = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
    sphere.material = new THREE.MeshMatcapMaterial({matcap: matcapTexture2})
    torus.material = new THREE.MeshMatcapMaterial({matcap: matcapTexture3})
    cylinder.material = new THREE.MeshMatcapMaterial({matcap: matcapTexture3})
    gltf.scene.children[5].material = new THREE.MeshMatcapMaterial({matcap: matcapTexture5})
    gltf.scene.children[6].material = new THREE.MeshMatcapMaterial({matcap: matcapTexture5})
    gltf.scene.children[7].material = new THREE.MeshMatcapMaterial({matcap: matcapTexture5})

    scene.add(gltf.scene)
    sceneInit()
	}
)

function sceneInit() {

  // RENDERER
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(2)
  document.body.appendChild(renderer.domElement)
  // renderer.shadowMap.enabled = true
  // renderer.shadowMap.type = THREE.PCFSoftShadowMapping



  // CAMERA
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight)
  camera.position.z = 10
  camera.position.x = 10
  camera.position.y = 10
  scene.add(camera)

  // CLOCK
  let clock = new THREE.Clock()


  // LIGHTS
  light = new PointLight(0xffffff, 1.3)
  light.position.set(20, 30 ,10)
  amb = new AmbientLight(0xffffff, 4)
  scene.add(light)

  light.castShadow = true
  light.shadow.mapSize.width = 2048
  light.shadow.mapSize.height = 2048


  // HELPERS

  // const sphereSize = 3
  // const pointLightHelper = new THREE.PointLightHelper(light, sphereSize)
  // scene.add(pointLightHelper)

  // const helper = new THREE.CameraHelper( light.shadow.camera );
  // scene.add( helper )


  // CONTROLS
  controls = new TrackballControls(camera, renderer.domElement)
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableZoom = true
  controls.enablePan = true
  controls.enableDamping = true
  controls.dampingFactor = 0.085

  function onWindowResize() {
    renderer.setSize( window.innerWidth, window.innerHeight )
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    animate()
  }

  window.addEventListener('resize', onWindowResize, false)

  function animate() {
    requestAnimationFrame(animate)
    render()
  }

  function render() {
    const timer = Date.now() - start
    controls.update()
    renderer.render(scene, camera)
    let delta = clock.getDelta()
    mixer.update(delta)
    // model.rotation.y = timer * 0.0001
  }

  animate()
}