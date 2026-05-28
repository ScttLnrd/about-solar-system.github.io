import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Import planet modules
import { sunMesh, updateSun } from './sun.js';
import { mercuryMesh, mercuryUpdate, mercuryOrbitRadius, mercurySpeed, mercuryAngle } from './mercury.js';
import { venusGroup, venusUpdate, venusOrbitRadius, venusSpeed, venusAngle } from './venus.js';
import { earthGroup, earthUpdate, earthOrbitRadius, earthSpeed, earthAngle } from './earth.js';
import { marsGroup, marsUpdate, marsOrbitRadius, marsSpeed, marsAngle } from './mars.js';
import { jupiterGroup, jupiterUpdate, jupiterOrbitRadius, jupiterSpeed, jupiterAngle } from './jupiter.js';
import { saturnGroup, saturnUpdate, saturnOrbitRadius, saturnSpeed, saturnAngle } from './saturn.js';
import { uranusGroup, uranusUpdate, uranusOrbitRadius, uranusSpeed, uranusAngle } from './uranus.js';
import { neptuneGroup, neptuneUpdate, neptuneOrbitRadius, neptuneSpeed, neptuneAngle } from './neptune.js';
import { moonMesh, moonUpdate, moonOrbitRing, moonOrbitRadius, moonSpeed, moonAngle, moonTextureOffset } from './moon.js';
import { asteroidGroup, updateAsteroidBelt } from './asteroidBelt.js';
import { createStarfield, updateStarfield } from './starfield.js';


// --- SCENE ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x010008);
scene.fog = new THREE.FogExp2(0x010008, 0.0003);

// --- CAMERA ---
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 15);
camera.lookAt(0, 0, 0);

// --- RENDERER ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

// --- ORBIT CONTROLS ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enableZoom = true;
controls.enablePan = false;
controls.zoomSpeed = 1.2;
controls.rotateSpeed = 0.8;
controls.target.set(0, 0, 0);
controls.minDistance = 5.0;
controls.maxDistance = 280.0;

// --- BLOOM ---
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 0.5, 0.85);
bloomPass.threshold = 0.18;
bloomPass.strength = 0.55;
bloomPass.radius = 0.75;
const effectComposer = new EffectComposer(renderer);
effectComposer.addPass(renderScene);
effectComposer.addPass(bloomPass);

// --- TEXTURE LOADER & SKYBOX (shared) ---
const loader = new THREE.TextureLoader();
const skyTexture = loader.load('assets/8k_stars_milky_way.jpg');
const skyboxGeo = new THREE.SphereGeometry(450, 64, 64);
const skyboxMat = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });
const skybox = new THREE.Mesh(skyboxGeo, skyboxMat);
scene.add(skybox);

// --- LIGHTING (shared) ---
// Sun is the only directional light source – a point light at the center
const sunLight = new THREE.PointLight(0xffaa66, 2.6, 160);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);
// Ambient light adds a very faint fill so the dark side isn't completely black
const ambientLight = new THREE.AmbientLight(0x222222);
scene.add(ambientLight);
// No directional light – it would illuminate planets from the wrong direction.

// --- HELPER: ADD ORBIT RING (for planets around Sun) ---
function addOrbitRing(radius, color, yOffset = 0) {
    const points = [];
    for (let i = 0; i <= 128; i++) {
        const angle = (i / 128) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        points.push(x, yOffset, z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points), 3));
    const mat = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.3 });
    const ring = new THREE.LineLoop(geo, mat);
    scene.add(ring);
}
// Add rings for planets (done in respective planet modules? We'll do here to keep central)
addOrbitRing(5.5, 0x88aaff);
addOrbitRing(8.2, 0xffaa88);
addOrbitRing(11.2, 0x44aaff);
addOrbitRing(15.0, 0xff6666);
addOrbitRing(42.0, 0xccaaff);
addOrbitRing(55.0, 0xddaaff);
addOrbitRing(68.0, 0xaaccff);
addOrbitRing(82.0, 0x88bbff);

// --- ADD ALL PLANET MESHES TO SCENE ---
scene.add(sunMesh);
scene.add(mercuryMesh);
scene.add(venusGroup);
scene.add(earthGroup);
scene.add(marsGroup);
scene.add(jupiterGroup);
scene.add(saturnGroup);
scene.add(uranusGroup);
scene.add(neptuneGroup);
scene.add(moonMesh);
scene.add(asteroidGroup);
createStarfield(scene); // adds blinking sprites

// --- CAMERA FOLLOW & SMOOTH TRANSITION ---
let followObject = null;
let followOffset = new THREE.Vector3();
let previousFollowPos = new THREE.Vector3();
let isTransitioning = false;
let transitionStartPos = new THREE.Vector3(), transitionStartTarget = new THREE.Vector3();
let transitionEndPos = new THREE.Vector3(), transitionEndTarget = new THREE.Vector3();
let transitionProgress = 0;
const transitionDuration = 0.2;
let nextFollowObject = null, nextFollowOffset = new THREE.Vector3();

function smoothTransitionTo(object, offsetDir, distance) {
    if (isTransitioning) return;
    const dir = offsetDir.clone().normalize();
    const newCamPos = object.position.clone().add(dir.multiplyScalar(distance));
    transitionStartPos.copy(camera.position);
    transitionStartTarget.copy(controls.target);
    transitionEndPos.copy(newCamPos);
    transitionEndTarget.copy(object.position);
    isTransitioning = true;
    transitionProgress = 0;
    followObject = null;
    nextFollowObject = object;
    nextFollowOffset = dir.multiplyScalar(distance);
}

function updateTransition(delta) {
    if (!isTransitioning) return;
    transitionProgress += delta / transitionDuration;
    if (transitionProgress >= 1) {
        camera.position.copy(transitionEndPos);
        controls.target.copy(transitionEndTarget);
        controls.update();
        if (nextFollowObject) {
            followObject = nextFollowObject;
            followOffset.copy(nextFollowOffset);
            previousFollowPos.copy(followObject.position);
            controls.target.copy(followObject.position);
            nextFollowObject = null;
        }
        isTransitioning = false;
        return;
    }
    const t = transitionProgress < 0.5 ? 4*transitionProgress*transitionProgress*transitionProgress : 1 - Math.pow(-2*transitionProgress+2,3)/2;
    camera.position.lerpVectors(transitionStartPos, transitionEndPos, t);
    controls.target.lerpVectors(transitionStartTarget, transitionEndTarget, t);
    controls.update();
}

function updateFollowCamera() {
    if (!followObject || isTransitioning) return;
    const cur = followObject.position;
    const dx = cur.x - previousFollowPos.x;
    const dy = cur.y - previousFollowPos.y;
    const dz = cur.z - previousFollowPos.z;
    if (dx !== 0 || dy !== 0 || dz !== 0) {
        camera.position.x += dx;
        camera.position.y += dy;
        camera.position.z += dz;
    }
    controls.target.copy(cur);
    previousFollowPos.copy(cur);
}

controls.addEventListener('change', () => {
    if (followObject && !isTransitioning) followOffset.copy(camera.position).sub(followObject.position);
});

// Button event listeners (assuming buttons exist in HTML)
document.getElementById('btn-sun').addEventListener('click', () => smoothTransitionTo(sunMesh, new THREE.Vector3(0,2,12), 12));
document.getElementById('btn-mercury').addEventListener('click', () => smoothTransitionTo(mercuryMesh, new THREE.Vector3(3,1.5,3), 4.5));
document.getElementById('btn-venus').addEventListener('click', () => smoothTransitionTo(venusGroup, new THREE.Vector3(3.5,1.8,3.5), 5.2));
document.getElementById('btn-earth').addEventListener('click', () => smoothTransitionTo(earthGroup, new THREE.Vector3(4,2,4), 5.5));
document.getElementById('btn-mars').addEventListener('click', () => smoothTransitionTo(marsGroup, new THREE.Vector3(4.5,2.5,4.5), 6.0));
document.getElementById('btn-jupiter').addEventListener('click', () => smoothTransitionTo(jupiterGroup, new THREE.Vector3(7,3,7), 12.0));
document.getElementById('btn-saturn').addEventListener('click', () => smoothTransitionTo(saturnGroup, new THREE.Vector3(8,3.5,8), 14.0));
document.getElementById('btn-uranus').addEventListener('click', () => smoothTransitionTo(uranusGroup, new THREE.Vector3(8, 3.5, 8), 15.0));
document.getElementById('btn-neptune').addEventListener('click', () => smoothTransitionTo(neptuneGroup, new THREE.Vector3(8.5, 3.5, 8.5), 16.0));
document.getElementById('btn-moon').addEventListener('click', () => smoothTransitionTo(moonMesh, new THREE.Vector3(2,1.2,2), 2.8));


// --- SKYBOX ROTATION ---
function rotateSkybox() { skybox.rotation.y += 0.0002; skybox.rotation.x += 0.0001; requestAnimationFrame(rotateSkybox); }
rotateSkybox();

// --- ANIMATION LOOP ---
let lastTime = performance.now();
let time = 0;

function animate() {
    const now = performance.now();
    let delta = Math.min(0.033, (now - lastTime) / 1000);
    lastTime = now;
    requestAnimationFrame(animate);
    time += delta;

    // Update each planet (orbit, rotation)
    mercuryUpdate(delta);
    venusUpdate(delta);
    earthUpdate(delta);
    marsUpdate(delta);
    jupiterUpdate(delta);
    saturnUpdate(delta);
    uranusUpdate(delta);
    neptuneUpdate(delta);
    moonUpdate(delta, earthGroup.position);
    updateSun(delta);
    updateAsteroidBelt(delta);
    updateStarfield(time);

    // Moon orbit ring follows Earth
    if (moonOrbitRing) moonOrbitRing.position.copy(earthGroup.position);

    updateTransition(delta);
    updateFollowCamera();

    controls.update();
    effectComposer.render();
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    effectComposer.setSize(window.innerWidth, window.innerHeight);
});
