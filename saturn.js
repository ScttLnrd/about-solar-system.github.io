import * as THREE from 'three';

const loader = new THREE.TextureLoader();

// Saturn planet
export const saturnGroup = new THREE.Group();
const saturnTex = loader.load('assets/8k_saturn.jpg');
const saturnGeo = new THREE.SphereGeometry(0.92, 256, 256);
const saturnMat = new THREE.MeshStandardMaterial({ map: saturnTex, roughness: 0.6, metalness: 0.1 });
const saturnMesh = new THREE.Mesh(saturnGeo, saturnMat);
saturnGroup.add(saturnMesh);
const tiltRad = 26.7 * Math.PI / 180;
saturnGroup.rotation.x = tiltRad;
saturnGroup.rotation.z = 0.02;

// --- SATURN RING with corrected UV mapping ---
// Texture is 8192x500. We want the 8192-pixel side to span radially (inner→outer)
// and the 500-pixel side to wrap around the circumference.
// So we map U (0→1) from inner radius to outer radius (radial)
// and V (0→1) around the ring (angular).
const ringTexture = loader.load('assets/8k_saturn_ring_alpha.png');
const ringInnerRadius = 0.8;   // Inner edge of ring (closest to planet)
const ringOuterRadius = 2.9;   // Outer edge of ring
const segments = 128;          // Smoothness around the ring

// Build vertices, UVs, and indices
const vertices = [];
const uvs = [];
const indices = [];

for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const v = i / segments;   // V goes 0→1 around the ring (circumference)

    // Inner vertex (U = 0)
    vertices.push(cosA * ringInnerRadius, 0, sinA * ringInnerRadius);
    uvs.push(0, v);   // U=0 (inner edge), V=angle

    // Outer vertex (U = 1)
    vertices.push(cosA * ringOuterRadius, 0, sinA * ringOuterRadius);
    uvs.push(1, v);   // U=1 (outer edge), V=angle
}

// Build indices for quads (two triangles per segment)
for (let i = 0; i < segments; i++) {
    const base = i * 2;
    const next = ((i + 1) % segments) * 2;
    // Triangles: (inner_i, outer_i, outer_{i+1}) and (inner_i, outer_{i+1}, inner_{i+1})
    indices.push(base, base + 1, next + 1);
    indices.push(base, next + 1, next);
}

const ringGeo = new THREE.BufferGeometry();
ringGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
ringGeo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
ringGeo.setIndex(indices);
ringGeo.computeVertexNormals(); // for lighting

const ringMat = new THREE.MeshStandardMaterial({
    map: ringTexture,
    transparent: true,
    side: THREE.DoubleSide,
    opacity: 0.9,
    depthWrite: false,
    depthTest: true
});
const saturnRing = new THREE.Mesh(ringGeo, ringMat);
saturnGroup.add(saturnRing);

export const saturnOrbitRadius = 55.0;
export let saturnAngle = 6.0;
export const saturnSpeed = 0.0003;

export function saturnUpdate(delta) {
    const step = saturnSpeed * (delta * 60);
    saturnAngle += step;
    if (saturnAngle > Math.PI*2) saturnAngle -= Math.PI*2;
    saturnGroup.position.set(Math.cos(saturnAngle)*saturnOrbitRadius, 0, Math.sin(saturnAngle)*saturnOrbitRadius);
    saturnMesh.rotation.y += 0.0025;
}