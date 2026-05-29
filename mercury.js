import * as THREE from 'three';
const loader = new THREE.TextureLoader();
const tex = loader.load('assets/8k_mercury.jpg');
// Reduced radius from 0.35 to 0.24 for more realistic scale
const geo = new THREE.SphereGeometry(0.24, 128, 128);
const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 });
export const mercuryMesh = new THREE.Mesh(geo, mat);
mercuryMesh.rotation.x = 0.15;
mercuryMesh.rotation.z = 0.02;

export const mercuryOrbitRadius = 16.8;   // scaled up
export let mercuryAngle = 1.2;
export const mercurySpeed = 0.0025;

export function mercuryUpdate(delta) {
    const step = mercurySpeed * (delta * 60);
    mercuryAngle += step;
    if (mercuryAngle > Math.PI*2) mercuryAngle -= Math.PI*2;
    mercuryMesh.position.set(Math.cos(mercuryAngle)*mercuryOrbitRadius, 0, Math.sin(mercuryAngle)*mercuryOrbitRadius);
    mercuryMesh.rotation.y += 0.004;
}