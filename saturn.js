import * as THREE from 'three';

const loader = new THREE.TextureLoader();
export const saturnGroup = new THREE.Group();
const saturnTex = loader.load('assets/8k_saturn.jpg');
const saturnGeo = new THREE.SphereGeometry(1.92, 256, 256);
const saturnMat = new THREE.MeshStandardMaterial({ map: saturnTex, roughness: 0.8, metalness: 0.15 });
const saturnMesh = new THREE.Mesh(saturnGeo, saturnMat);
saturnGroup.add(saturnMesh);
const tiltRad = 26.7 * Math.PI / 180;
saturnGroup.rotation.x = tiltRad;
saturnGroup.rotation.z = 0.02;

const ringTexture = loader.load('assets/8k_saturn_ring_alpha.png');
const ringInnerRadius = 2;
const ringOuterRadius = 4;
const segments = 128;
const vertices = [];
const uvs = [];
const indices = [];

for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const v = i / segments;
    vertices.push(cosA * ringInnerRadius, 0, sinA * ringInnerRadius);
    uvs.push(0, v);
    vertices.push(cosA * ringOuterRadius, 0, sinA * ringOuterRadius);
    uvs.push(1, v);
}
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
    opacity: 0.9,
    depthWrite: false,
    depthTest: true
});
const saturnRing = new THREE.Mesh(ringGeo, ringMat);
saturnGroup.add(saturnRing);

export const saturnOrbitRadius = 300;
export let saturnAngle = 6.0;
export const saturnSpeed = 0.0003;

export function saturnUpdate(delta) {
    const step = saturnSpeed * (delta * 60);
    saturnAngle += step;
    if (saturnAngle > Math.PI*2) saturnAngle -= Math.PI*2;
    saturnGroup.position.set(Math.cos(saturnAngle)*saturnOrbitRadius, 0, Math.sin(saturnAngle)*saturnOrbitRadius);
    saturnMesh.rotation.y += 0.0025;
}