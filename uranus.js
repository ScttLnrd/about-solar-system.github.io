import * as THREE from 'three';

const loader = new THREE.TextureLoader();

// Uranus planet group (for axial tilt)
export const uranusGroup = new THREE.Group();
const uranusTex = loader.load('assets/2k_uranus.jpg');   // 2K texture as specified
const uranusGeo = new THREE.SphereGeometry(0.85, 256, 256); // Slightly smaller than Saturn (0.92)
const uranusMat = new THREE.MeshStandardMaterial({ map: uranusTex, roughness: 0.5, metalness: 0.1 });
const uranusMesh = new THREE.Mesh(uranusGeo, uranusMat);
uranusGroup.add(uranusMesh);

// Axial tilt: 98 degrees = 1.710 rad (approx)
// Uranus rotates on its side, so we tilt the group.
const uranusTiltRad = 98 * Math.PI / 180;
uranusGroup.rotation.x = uranusTiltRad;
uranusGroup.rotation.z = 0.01;

// --- URANUS RING (using Saturn's ring texture, but narrower) ---
// Texture loaded from shared assets
const ringTexture = loader.load('assets/8k_saturn_ring_alpha.png');
const ringInnerRadius = 1.75;   // Inner edge of Uranus ring (close to planet)
const ringOuterRadius = 1.95;   // Outer edge of Uranus ring (thin)
const segments = 128;

const vertices = [];
const uvs = [];
const indices = [];

for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const v = i / segments;   // V goes 0→1 around the ring

    // Inner vertex (U = 0)
    vertices.push(cosA * ringInnerRadius, 0, sinA * ringInnerRadius);
    uvs.push(0, v);

    // Outer vertex (U = 1)
    vertices.push(cosA * ringOuterRadius, 0, sinA * ringOuterRadius);
    uvs.push(1, v);
}

// Build indices for quads (two triangles per segment)
for (let i = 0; i < segments; i++) {
    const base = i * 2;
    const next = ((i + 1) % segments) * 2;
    indices.push(base, base + 1, next + 1);
    indices.push(base, next + 1, next);
}

const ringGeo = new THREE.BufferGeometry();
ringGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
ringGeo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
ringGeo.setIndex(indices);
ringGeo.computeVertexNormals();

const ringMat = new THREE.MeshStandardMaterial({
    map: ringTexture,
    transparent: true,
    side: THREE.DoubleSide,
    opacity: 0.7,          // Slightly fainter than Saturn's rings
    depthWrite: false,
    depthTest: true
});
const uranusRing = new THREE.Mesh(ringGeo, ringMat);
uranusGroup.add(uranusRing);

// Orbit parameters (beyond Saturn)
export const uranusOrbitRadius = 68.0;   // Scaled (Saturn = 55)
export let uranusAngle = 1.2;
export const uranusSpeed = 0.00022;      // Slower than Saturn (~84 Earth years)

export function uranusUpdate(delta) {
    const step = uranusSpeed * (delta * 60);
    uranusAngle += step;
    if (uranusAngle > Math.PI*2) uranusAngle -= Math.PI*2;
    uranusGroup.position.set(Math.cos(uranusAngle)*uranusOrbitRadius, 0, Math.sin(uranusAngle)*uranusOrbitRadius);
    // Uranus rotation (retrograde? but we keep simple)
    uranusMesh.rotation.y += 0.002;
}