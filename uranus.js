import * as THREE from 'three';

const loader = new THREE.TextureLoader();
export const uranusGroup = new THREE.Group();
const uranusTex = loader.load('assets/2k_uranus.jpg');
const uranusGeo = new THREE.SphereGeometry(1.35, 256, 256);
const uranusMat = new THREE.MeshStandardMaterial({ map: uranusTex, roughness: 0.8, metalness: 0.1 });
const uranusMesh = new THREE.Mesh(uranusGeo, uranusMat);
uranusGroup.add(uranusMesh);

const uranusTiltRad = 98 * Math.PI / 180;
uranusGroup.rotation.x = uranusTiltRad;
uranusGroup.rotation.z = 0.01;

const ringTexture = loader.load('assets/8k_saturn_ring_alpha.png');
const ringInnerRadius = 2.63;
const ringOuterRadius = 2.78;
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
    opacity: 0.7,
    depthWrite: false,
    depthTest: true
});
const uranusRing = new THREE.Mesh(ringGeo, ringMat);
uranusGroup.add(uranusRing);

export const uranusOrbitRadius = 350;
export let uranusAngle = 1.2;
export const uranusSpeed = 0.00022;

export function uranusUpdate(delta) {
    const step = uranusSpeed * (delta * 60);
    uranusAngle += step;
    if (uranusAngle > Math.PI*2) uranusAngle -= Math.PI*2;
    uranusGroup.position.set(Math.cos(uranusAngle)*uranusOrbitRadius, 0, Math.sin(uranusAngle)*uranusOrbitRadius);
    uranusMesh.rotation.y += 0.002;
}