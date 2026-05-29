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
import { moonMesh, moonUpdate, moonOrbitRing, moonOrbitRadius, moonSpeed, moonAngle, moonTextureOffset , setMoonOrbitRing} from './moon.js';
import { asteroidGroup, updateAsteroidBelt } from './asteroidBelt.js';
import { createStarfield, updateStarfield } from './starfield.js';

// --- DATA FOR CELESTIAL BODIES (UPDATED SATURN, URANUS, NEPTUNE) ---
const bodyData = {
    sun: { 
        name: "Sun", 
        type: "G-type main-sequence star", 
        mass: "~1.989 × 10³⁰ kg", 
        elements: "Hydrogen, helium, oxygen, carbon, neon, iron, nitrogen, silicon, magnesium", 
        about: "The Sun is the massive star located at the center of the Solar System and is the primary source of energy for all planets and other celestial bodies orbiting it. Formed around 4.6 billion years ago from a giant cloud of gas and dust, the Sun generates energy through nuclear fusion in its core, where hydrogen atoms combine to form helium under extremely high temperatures and pressure. This process releases enormous amounts of heat and light that travel across the Solar System. The Sun’s gravity is so strong that it controls the motion of planets, moons, asteroids, and comets. Without the Sun, life on Earth would not exist because it provides warmth, drives weather systems, supports photosynthesis, and powers Earth’s climate. Scientists continue to study the Sun to understand solar storms, magnetic activity, and how stars evolve over time.", 
        funFact: "- The Sun contains about 99.8% of the Solar System’s total mass.\n- It takes roughly 225–250 million years for the Sun to orbit the center of the Milky Way galaxy.\n- The surface temperature is about 5,500°C, while the core reaches around 15 million°C.", 
        links: '<a href="https://science.nasa.gov/sun/" target="_blank" rel="noopener noreferrer">🔗 NASA Sun Overview</a> &nbsp; <a href="https://www.esa.int/Science_Exploration/Space_Science/Solar_Orbiter" target="_blank" rel="noopener noreferrer">🔗 ESA Solar Orbiter Mission</a>'
    },
    mercury: { 
        name: "Mercury", 
        type: "Terrestrial planet", 
        mass: "~3.30 × 10²³ kg", 
        elements: "Iron, nickel, silicate rock, sulfur, oxygen, sodium", 
        about: "Mercury is the smallest planet in the Solar System and the closest to the Sun. Despite being nearest to the Sun, Mercury is not the hottest planet because it lacks a thick atmosphere capable of trapping heat. Its surface is heavily cratered, resembling Earth’s Moon, showing evidence of countless asteroid impacts over billions of years. Mercury has an unusually large iron core that makes up most of the planet’s interior, giving it a strong magnetic field relative to its size. Because the planet rotates very slowly, a single day on Mercury lasts much longer than its year. Temperatures on the sunlit side become extremely hot, while the dark side becomes freezing cold. Scientists believe that water ice may exist inside permanently shadowed craters near Mercury’s poles.", 
        funFact: "- Mercury completes one orbit around the Sun in only 88 Earth days.\n- A day-night temperature difference on Mercury exceeds 600°C.\n- Mercury has almost no atmosphere, only a thin exosphere.", 
        links: '<a href="https://science.nasa.gov/mercury/" target="_blank" rel="noopener noreferrer">🔗 NASA Mercury Exploration</a>'
    },
    venus: { 
        name: "Venus", 
        type: "Terrestrial planet", 
        mass: "~4.87 × 10²⁴ kg", 
        elements: "Carbon dioxide, nitrogen, sulfuric acid, silicate rocks, iron", 
        about: "Venus is often called Earth’s “sister planet” because it is similar in size and structure to Earth, but its environment is extremely hostile. The planet is covered by thick clouds of sulfuric acid and possesses a dense atmosphere composed mainly of carbon dioxide. This atmosphere creates a runaway greenhouse effect that traps heat efficiently, making Venus the hottest planet in the Solar System, even hotter than Mercury. Surface temperatures are high enough to melt lead. Venus rotates very slowly and in the opposite direction compared to most planets, meaning the Sun appears to rise in the west and set in the east. Scientists study Venus to better understand climate change and atmospheric evolution because it demonstrates what can happen when greenhouse warming becomes extreme.", 
        funFact: "- Venus has crushing atmospheric pressure about 90 times stronger than Earth’s.\n- Its thick clouds reflect sunlight, making it the brightest planet visible from Earth.\n- A Venusian day lasts longer than its year.", 
        links: '<a href="https://science.nasa.gov/venus/" target="_blank" rel="noopener noreferrer">🔗 NASA Venus Overview</a>'
    },
    earth: { 
        name: "Earth", 
        type: "Terrestrial planet", 
        mass: "~5.97 × 10²⁴ kg", 
        elements: "Oxygen, silicon, iron, magnesium, aluminum, water, nitrogen", 
        about: "Earth is the only known planet in the universe confirmed to support life. Located within the Sun’s habitable zone, Earth has the perfect conditions for liquid water to exist on its surface. Its atmosphere protects living organisms by filtering harmful radiation and regulating temperature through natural greenhouse gases. Earth’s surface is highly dynamic, with oceans, mountains, volcanoes, and shifting tectonic plates constantly reshaping the planet. The presence of a strong magnetic field shields Earth from harmful solar particles emitted by the Sun. Scientists believe Earth formed about 4.5 billion years ago and that life began in its oceans billions of years later. Earth’s biodiversity and ecosystems make it unique among all known planets.", 
        funFact: "- About 71% of Earth’s surface is covered by water.\n- Earth is the densest planet in the Solar System.\n- The atmosphere contains about 78% nitrogen and 21% oxygen.", 
        links: '<a href="https://science.nasa.gov/earth/" target="_blank" rel="noopener noreferrer">🔗 NASA Earth Science</a>'
    },
    mars: { 
        name: "Mars", 
        type: "Terrestrial planet", 
        mass: "~6.42 × 10²³ kg", 
        elements: "Iron oxide, silicon, magnesium, oxygen, carbon dioxide, sulfur", 
        about: "Mars is known as the Red Planet because iron minerals in its soil rust and give the surface a reddish appearance. It has seasons, polar ice caps, dust storms, and evidence of ancient rivers and lakes, suggesting that liquid water once flowed on its surface billions of years ago. Mars is one of the most explored planets because scientists believe it may once have supported microbial life. The atmosphere is thin and mostly composed of carbon dioxide, making the planet cold and dry today. Mars is home to Olympus Mons, the tallest volcano in the Solar System, and Valles Marineris, one of the largest canyon systems ever discovered. Future space missions aim to send humans to Mars and possibly establish permanent bases.", 
        funFact: "- Mars has the largest volcano in the Solar System.\n- Dust storms on Mars can cover the entire planet.\n- Mars has two small moons named Phobos and Deimos.", 
        links: '<a href="https://science.nasa.gov/mars/" target="_blank" rel="noopener noreferrer">🔗 NASA Mars Exploration</a>'
    },
    jupiter: { 
        name: "Jupiter", 
        type: "Gas giant", 
        mass: "~1.90 × 10²⁷ kg", 
        elements: "Hydrogen, helium, methane, ammonia, water vapor, sulfur compounds, traces of carbon and oxygen", 
        about: "Jupiter is the largest planet in the Solar System and is so massive that more than 1,300 Earths could fit inside it. Formed around 4.5 billion years ago, Jupiter is composed mainly of hydrogen and helium, similar to the Sun, although it never became massive enough to ignite nuclear fusion and become a star. The planet has no solid surface like Earth; instead, its atmosphere gradually becomes denser deeper inside until materials behave like liquid and metallic hydrogen under enormous pressure. Jupiter’s atmosphere is famous for its colorful cloud bands and gigantic storms, including the Great Red Spot, a massive storm system that has existed for centuries and is larger than Earth itself.\n\nJupiter’s immense gravity strongly influences the Solar System by affecting asteroid paths and capturing many moons. Some scientists think Jupiter may have helped protect Earth by pulling dangerous comets and asteroids away from the inner Solar System. The planet has an extremely powerful magnetic field, much stronger than Earth’s, which traps radiation and creates intense auroras near its poles. Jupiter also rotates very quickly, completing one rotation in less than 10 hours, making it the fastest-spinning planet in the Solar System. This rapid rotation causes the planet to bulge at the equator.\n\nJupiter has a very large moon system, with dozens of known moons. Four of them — Io, Europa, Ganymede, and Callisto — are called the Galilean moons because they were discovered by Galileo Galilei in 1610. Europa is especially important to scientists because evidence suggests a deep ocean may exist beneath its icy surface, raising the possibility of extraterrestrial microbial life.", 
        funFact: "- Jupiter’s Great Red Spot is a storm that has lasted for at least 300 years.\n- Ganymede, one of Jupiter’s moons, is larger than the planet Mercury.\n- Jupiter emits more heat than it receives from the Sun.\n- A spacecraft would be crushed by pressure long before reaching Jupiter’s deep interior.", 
        links: '<a href="https://science.nasa.gov/jupiter/" target="_blank" rel="noopener noreferrer">🔗 NASA Jupiter Overview</a> &nbsp; <a href="https://science.nasa.gov/mission/juno/" target="_blank" rel="noopener noreferrer">🔗 NASA Juno Mission</a>'
    },
    saturn: { 
        name: "Saturn", 
        type: "Gas giant", 
        mass: "~5.68 × 10²⁶ kg", 
        elements: "Hydrogen, helium, methane, ammonia, water ice, hydrocarbons", 
        about: "Saturn is the second-largest planet in the Solar System and is best known for its spectacular ring system, which is made mostly of ice particles, rocky debris, and dust. Although all gas giants have rings, Saturn’s are by far the brightest and most complex. The rings extend hundreds of thousands of kilometers outward from the planet but are surprisingly thin compared to their enormous width. Scientists believe the rings may have formed from shattered moons, comets, or leftover material that never formed into a satellite.\n\nLike Jupiter, Saturn is composed mainly of hydrogen and helium and lacks a solid surface. Deep inside the planet, pressure becomes so intense that hydrogen may exist in a metallic liquid state. Saturn rotates very quickly, causing strong winds and storms in its atmosphere. One unusual feature is a giant hexagon-shaped storm near the planet’s north pole that has puzzled scientists for decades. Saturn is also less dense than water, meaning it would theoretically float if a giant enough ocean existed.\n\nSaturn has a large number of moons, with Titan being the most famous. Titan is larger than Mercury and possesses a thick atmosphere rich in nitrogen. Scientists have discovered rivers, lakes, and rain on Titan, although these are made of liquid methane and ethane instead of water. Another moon, Enceladus, ejects massive plumes of water vapor from beneath its icy surface, suggesting a hidden subsurface ocean that may contain conditions suitable for life.", 
        funFact: "- Saturn’s rings are made mostly of water ice.\n- Titan is the only moon in the Solar System with a dense atmosphere.\n- Saturn experiences extremely powerful winds reaching over 1,800 km/h.\n- The Cassini spacecraft studied Saturn for 13 years before ending its mission in 2017.", 
        links: '<a href="https://science.nasa.gov/saturn/" target="_blank" rel="noopener noreferrer">🔗 NASA Saturn Overview</a> &nbsp; <a href="https://science.nasa.gov/mission/cassini/" target="_blank" rel="noopener noreferrer">🔗 NASA Cassini Mission</a>'
    },
    uranus: { 
        name: "Uranus", 
        type: "Ice giant", 
        mass: "~8.68 × 10²⁵ kg", 
        elements: "Hydrogen, helium, methane, water, ammonia, hydrogen sulfide", 
        about: "Uranus is an unusual planet because it rotates almost completely sideways compared to the other planets in the Solar System. Scientists believe a massive collision with another large object early in its history may have knocked the planet onto its side. Because of this extreme tilt, Uranus experiences highly unusual seasons, with each pole receiving decades of continuous sunlight followed by decades of darkness during its long orbit around the Sun.\n\nThe planet appears blue-green because methane gas in its atmosphere absorbs red light and reflects blue light. Uranus is classified as an ice giant because, unlike Jupiter and Saturn, it contains larger amounts of icy materials such as water, ammonia, and methane deep inside. Temperatures on Uranus are among the coldest found anywhere in the Solar System, dropping below −220°C. Scientists are still uncertain why Uranus emits very little internal heat compared to other giant planets.\n\nUranus has faint rings and numerous moons named mostly after characters from the works of William Shakespeare and Alexander Pope. The planet was first discovered in 1781 by William Herschel, becoming the first planet found using a telescope rather than visible to ancient civilizations.", 
        funFact: "- Uranus rotates on its side with a tilt of about 98°.\n- One season on Uranus lasts around 21 Earth years.\n- Voyager 2 is the only spacecraft to have visited Uranus.\n- Uranus has faint dark rings that are difficult to observe from Earth.", 
        links: '<a href="https://science.nasa.gov/uranus/" target="_blank" rel="noopener noreferrer">🔗 NASA Uranus Overview</a>'
    },
    neptune: { 
        name: "Neptune", 
        type: "Ice giant", 
        mass: "~1.02 × 10²⁶ kg", 
        elements: "Hydrogen, helium, methane, water, ammonia, hydrocarbons", 
        about: "Neptune is the farthest known major planet from the Sun and is famous for its deep blue color and extremely violent weather systems. Like Uranus, Neptune is classified as an ice giant because it contains significant amounts of water, ammonia, and methane beneath its atmosphere. Methane in the upper atmosphere absorbs red wavelengths of light, giving the planet its striking blue appearance. Despite receiving very little sunlight due to its great distance from the Sun, Neptune is highly active and produces enormous storms and the fastest winds recorded in the Solar System, sometimes exceeding 2,000 kilometers per hour.\n\nNeptune was not discovered through direct observation at first. Instead, astronomers noticed strange gravitational effects on Uranus and mathematically predicted the existence and location of another planet. In 1846, Neptune was finally observed near the predicted position, making it the first planet discovered through mathematical calculations before visual confirmation.\n\nThe planet has several moons, with Triton being the largest and most unusual. Triton orbits Neptune backward compared to the planet’s rotation, suggesting it may have been captured from the Kuiper Belt long ago. Triton also has geysers that erupt nitrogen gas and ice from beneath its frozen surface. Neptune’s interior is believed to contain a superheated ocean-like layer of water, ammonia, and methane under immense pressure.", 
        funFact: "- Neptune takes about 165 Earth years to orbit the Sun once.\n- Winds on Neptune are the fastest in the Solar System.\n- Triton is slowly spiraling closer to Neptune and may eventually break apart.\n- Voyager 2 remains the only spacecraft to visit Neptune.", 
        links: '<a href="https://science.nasa.gov/neptune/" target="_blank" rel="noopener noreferrer">🔗 NASA Neptune Overview</a>'
    },
    moon: { 
        name: "Moon", 
        type: "Natural satellite", 
        mass: "~7.35 × 10²² kg", 
        elements: "Oxygen, silicon, magnesium, calcium, iron, titanium", 
        about: "The Moon is Earth’s only natural satellite and is believed to have formed after a massive collision between the young Earth and a Mars-sized object billions of years ago. The debris from that collision eventually combined to form the Moon. Its gravitational pull causes ocean tides on Earth and also helps stabilize Earth’s axial tilt, which contributes to long-term climate stability. The Moon’s surface contains vast plains formed by ancient lava flows, towering mountains, and countless impact craters caused by asteroid collisions. Because the Moon is tidally locked to Earth, the same side always faces our planet. Human exploration of the Moon during the Apollo missions provided valuable scientific knowledge about planetary formation and the early Solar System.", 
        funFact: "- Footprints left on the Moon can remain for millions of years due to the lack of wind.\n- The Moon is slowly moving away from Earth by about 3.8 centimeters per year.\n- Moonquakes occur due to tidal stresses and temperature changes.", 
        links: '<a href="https://science.nasa.gov/moon/" target="_blank" rel="noopener noreferrer">🔗 NASA Moon Exploration</a>'
    }
};


// --- SCENE ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x010008);
scene.fog = new THREE.FogExp2(0x010008, 0.0003);

// --- CAMERA ---
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
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
controls.minDistance = 50.0;
controls.maxDistance = 1000.0;
controls.maxPolarAngle = Math.PI;

// Overview camera (adjusted for new orbit distances)
const overviewCameraPos = new THREE.Vector3(0, 150, 600);
const overviewTarget = new THREE.Vector3(0, 0, 0);

// --- BLOOM (tuned for planets) ---
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.8, 1, 0.6);
bloomPass.threshold = 0.12;
bloomPass.strength = 0.478;
bloomPass.radius = 0.7;
const effectComposer = new EffectComposer(renderer);
effectComposer.addPass(renderScene);
effectComposer.addPass(bloomPass);

// --- TEXTURE LOADER & SKYBOX ---
const loader = new THREE.TextureLoader();
const skyTexture = loader.load('assets/8k_stars_milky_way.jpg');
const skyboxGeo = new THREE.SphereGeometry(2000, 64, 64);
const skyboxMat = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });
const skybox = new THREE.Mesh(skyboxGeo, skyboxMat);
scene.add(skybox);

// --- LIGHTING ---
const sunLight = new THREE.PointLight(0xffaa66, 1.45, 1080);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);
const ambientLight = new THREE.AmbientLight(0x111111);
scene.add(ambientLight);

// --- HELPER: ADD ORBIT RING ---
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
addOrbitRing(50, 0x88aaff);    // Mercury
addOrbitRing(75, 0xffaa88);    // Venus
addOrbitRing(100, 0x44aaff);   // Earth
addOrbitRing(125, 0xff6666);   // Mars
addOrbitRing(250, 0xccaaff);   // Jupiter
addOrbitRing(300, 0xddaaff);   // Saturn
addOrbitRing(350, 0xaaccff);   // Uranus
addOrbitRing(400, 0x88bbff);   // Neptune

// --- MOON ORBIT RING ---
const moonRingPoints = [];
for (let i = 0; i <= 128; i++) {
    const angle = (i / 128) * Math.PI * 2;
    const x = Math.cos(angle) * moonOrbitRadius;
    const z = Math.sin(angle) * moonOrbitRadius;
    moonRingPoints.push(x, 0, z);
}
const moonRingGeo = new THREE.BufferGeometry();
moonRingGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(moonRingPoints), 3));
const moonRingMat = new THREE.LineBasicMaterial({ color: 0xaaaaff, transparent: true, opacity: 0.4 });
const moonOrbitRingObj = new THREE.LineLoop(moonRingGeo, moonRingMat);
scene.add(moonOrbitRingObj);
setMoonOrbitRing(moonOrbitRingObj);

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
createStarfield(scene);

// Enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.bias = -0.0002;
earthGroup.traverse(child => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; } });
moonMesh.castShadow = true;
moonMesh.receiveShadow = true;

// --- CAMERA FOLLOW & SMOOTH TRANSITION ---
let followObject = null;
let followTargetOffset = new THREE.Vector3();
let followOffset = new THREE.Vector3();
let previousFollowPos = new THREE.Vector3();
let isTransitioning = false;
let transitionStartPos = new THREE.Vector3(), transitionStartTarget = new THREE.Vector3();
let transitionEndPos = new THREE.Vector3(), transitionEndTarget = new THREE.Vector3();
let transitionProgress = 0;
const transitionDuration = 0.25;
let nextFollowObject = null, nextFollowOffset = new THREE.Vector3(), nextFollowTargetOffset = new THREE.Vector3();

// Store original minDistance for reset
const originalMinDistance = 50.0;

// Per-body minimum zoom distances (closer for small bodies, farther for large/gas giants)
const bodyMinDistances = {
    sun: 50.0,
    mercury: 3.0,
    venus: 4.0,
    earth: 4.0,
    mars: 3.0,
    jupiter: 14.0,
    saturn: 16.0,
    uranus: 11.0,
    neptune: 11.0,
    moon: 1.4
};

function flyTo(object, offsetDir, distance, targetOffset, bodyId = null) {
    if (isTransitioning) return;
    const dir = offsetDir.clone().normalize();
    const newCamPos = object.position.clone().add(dir.multiplyScalar(distance));
    transitionStartPos.copy(camera.position);
    transitionStartTarget.copy(controls.target);
    transitionEndPos.copy(newCamPos);
    transitionEndTarget.copy(object.position.clone().add(targetOffset));
    isTransitioning = true;
    transitionProgress = 0;
    followObject = null;
    nextFollowObject = object;
    nextFollowOffset = dir.multiplyScalar(distance);
    nextFollowTargetOffset = targetOffset.clone();
    
    // Set min distance based on body (if provided)
    if (bodyId && bodyMinDistances[bodyId]) {
        controls.minDistance = bodyMinDistances[bodyId];
    } else {
        controls.minDistance = originalMinDistance;
    }
}

function flyToOverview() {
    if (isTransitioning) return;
    transitionStartPos.copy(camera.position);
    transitionStartTarget.copy(controls.target);
    transitionEndPos.copy(overviewCameraPos);
    transitionEndTarget.copy(overviewTarget);
    isTransitioning = true;
    transitionProgress = 0;
    followObject = null;
    nextFollowObject = null;
    // Reset min distance for overview
    controls.minDistance = originalMinDistance;
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
            followTargetOffset.copy(nextFollowTargetOffset);
            followOffset.copy(nextFollowOffset);
            previousFollowPos.copy(followObject.position);
            controls.target.copy(followObject.position.clone().add(followTargetOffset));
        } else {
            followObject = null;
        }
        isTransitioning = false;
        nextFollowObject = null;
        // Update trapezoid visibility after transition ends
        updateTrapezoidVisibility();
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
    controls.target.copy(cur.clone().add(followTargetOffset));
    previousFollowPos.copy(cur);
}

controls.addEventListener('change', () => {
    if (followObject && !isTransitioning) followOffset.copy(camera.position).sub(followObject.position);
});

// --- TOGGLE BUTTON LOGIC + INFO PANEL ---
let activeButton = null;
let activePlanet = null;
let activeFlyParams = null;
let currentBodyId = null;

const infoPanel = document.getElementById('infoPanel');
const infoTrapezoid = document.getElementById('infoTrapezoid');
const viewButton = document.getElementById('viewButtonInside');

function updateInfoPanel(bodyId) {
    const data = bodyData[bodyId];
    if (!data) return;
    document.getElementById('infoTitle').innerText = data.name;
    document.getElementById('infoType').innerText = data.type;
    document.getElementById('infoMass').innerText = data.mass;
    document.getElementById('infoElements').innerText = data.elements;
    document.getElementById('infoAbout').innerHTML = data.about;
    document.getElementById('infoFunFact').innerHTML = data.funFact.replace(/\n/g, '<br>');
    const linksDiv = document.getElementById('infoLinks');
    linksDiv.innerHTML = data.links ? data.links : '<span style="color:#aaa;">—</span>';
}

function showInfoPanel() {
    infoPanel.classList.remove('hidden');
    if (infoTrapezoid) infoTrapezoid.classList.add('hidden');
    controls.enabled = false;
}

function hideInfoPanel() {
    infoPanel.classList.add('hidden');
    updateTrapezoidVisibility(); // re-evaluate trapezoid visibility
    controls.enabled = true;
}

// NEW: Update trapezoid button visibility based on followObject and panel state
function updateTrapezoidVisibility() {
    if (!infoTrapezoid) return;
    // Show trapezoid only when: a planet is being followed AND the info panel is hidden
    const shouldShow = (followObject !== null) && infoPanel.classList.contains('hidden');
    if (shouldShow) {
        infoTrapezoid.classList.remove('hidden');
    } else {
        infoTrapezoid.classList.add('hidden');
    }
}

viewButton.addEventListener('click', () => {
    if (followObject) {
        followTargetOffset.set(0, 0, 0);
        controls.target.copy(followObject.position);
        controls.update();
        hideInfoPanel();
        controls.enabled = true;
    }
});

if (infoTrapezoid) {
    infoTrapezoid.addEventListener('click', () => {
        if (followObject) {
            followTargetOffset.set(2.4, 0, 0);
            controls.target.copy(followObject.position.clone().add(followTargetOffset));
            controls.update();
            showInfoPanel();
            controls.enabled = false;
        }
    });
}

function setActiveButton(button, planet, offsetDir, distance, targetOffset, bodyId) {
    document.querySelectorAll('.planet-buttons button').forEach(btn => btn.classList.remove('active'));
    if (button) {
        button.classList.add('active');
        activeButton = button;
        activePlanet = planet;
        activeFlyParams = { offsetDir, distance, targetOffset };
        currentBodyId = bodyId;
        updateInfoPanel(bodyId);
        showInfoPanel();
        controls.enabled = false;
        // Pass bodyId to flyTo for min distance
        flyTo(planet, offsetDir, distance, targetOffset, bodyId);
    } else {
        activeButton = null;
        activePlanet = null;
        activeFlyParams = null;
        currentBodyId = null;
        hideInfoPanel();
        controls.enabled = true;
        flyToOverview();
    }
    updateTrapezoidVisibility();
}

function onPlanetButtonClick(button, planet, offsetDir, distance, targetOffset, bodyId) {
    if (activeButton === button) {
        setActiveButton(null, null, null, null, null, null);
    } else {
        setActiveButton(button, planet, offsetDir, distance, targetOffset, bodyId);
    }
}

const rightOffset = new THREE.Vector3(1.6, 0, 0);
document.getElementById('btn-sun').addEventListener('click', () => onPlanetButtonClick(
    document.getElementById('btn-sun'), sunMesh, new THREE.Vector3(0,2,12), 12, rightOffset, 'sun'
));
document.getElementById('btn-mercury').addEventListener('click', () => onPlanetButtonClick(
    document.getElementById('btn-mercury'), mercuryMesh, new THREE.Vector3(-0.9,0.05,0.5), 2.6, rightOffset, 'mercury'
));
document.getElementById('btn-venus').addEventListener('click', () => onPlanetButtonClick(
    document.getElementById('btn-venus'), venusGroup, new THREE.Vector3(-0.82,0.05,0.5), 3.5, rightOffset, 'venus'
));
document.getElementById('btn-earth').addEventListener('click', () => onPlanetButtonClick(
    document.getElementById('btn-earth'), earthGroup, new THREE.Vector3(-0.85,0.03,0.5), 2.5, rightOffset, 'earth'
));
document.getElementById('btn-mars').addEventListener('click', () => onPlanetButtonClick(
    document.getElementById('btn-mars'), marsGroup, new THREE.Vector3(-0.9,0.03,0.5), 2.4, rightOffset, 'mars'
));
document.getElementById('btn-jupiter').addEventListener('click', () => onPlanetButtonClick(
    document.getElementById('btn-jupiter'), jupiterGroup, new THREE.Vector3(-0.8,0.02,0.6), 4.4, rightOffset, 'jupiter'
));
document.getElementById('btn-saturn').addEventListener('click', () => onPlanetButtonClick(
    document.getElementById('btn-saturn'), saturnGroup, new THREE.Vector3(0.9,0.05,0.4), 5.0, rightOffset, 'saturn'
));
document.getElementById('btn-uranus').addEventListener('click', () => onPlanetButtonClick(
    document.getElementById('btn-uranus'), uranusGroup, new THREE.Vector3(0.85,0.06,0.5), 5.0, rightOffset, 'uranus'
));
document.getElementById('btn-neptune').addEventListener('click', () => onPlanetButtonClick(
    document.getElementById('btn-neptune'), neptuneGroup, new THREE.Vector3(-0.8,0.02,0.5), 5.0, rightOffset, 'neptune'
));
document.getElementById('btn-moon').addEventListener('click', () => onPlanetButtonClick(
    document.getElementById('btn-moon'), moonMesh, new THREE.Vector3(-0.93,0.04,0.35), 3, rightOffset, 'moon'
));

camera.position.copy(overviewCameraPos);
controls.target.copy(overviewTarget);
controls.update();
// Ensure trapezoid is hidden initially (overview)
updateTrapezoidVisibility();

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

    if (moonOrbitRing) moonOrbitRing.position.copy(earthGroup.position);

    updateTransition(delta);
    updateFollowCamera();

    controls.update();
    updateDebugPanel();
    effectComposer.render();
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    effectComposer.setSize(window.innerWidth, window.innerHeight);
});

console.log('Solar system with per-body min zoom distance and fixed info trapezoid.');

// --- DEBUG: update UI panel with camera coordinates ---
function updateDebugPanel() {
    const pos = camera.position;
    const target = controls.target;
    const dir = new THREE.Vector3().subVectors(target, pos).normalize();
    document.getElementById('camPos').innerHTML = `${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}`;
    document.getElementById('camTarget').innerHTML = `${target.x.toFixed(2)}, ${target.y.toFixed(2)}, ${target.z.toFixed(2)}`;
    document.getElementById('camDir').innerHTML = `${dir.x.toFixed(3)}, ${dir.y.toFixed(3)}, ${dir.z.toFixed(3)}`;

    const distance = camera.position.distanceTo(controls.target);
    document.getElementById('camDistance').innerHTML = distance.toFixed(2);

    let offsetInfo = '—';
    if (followObject) {
    const dirFromPlanet = new THREE.Vector3().subVectors(camera.position, followObject.position).normalize();
    offsetInfo = `${dirFromPlanet.x.toFixed(3)}, ${dirFromPlanet.y.toFixed(3)}, ${dirFromPlanet.z.toFixed(3)}`;
    }
document.getElementById('camOffsetDir').innerHTML = offsetInfo;
}