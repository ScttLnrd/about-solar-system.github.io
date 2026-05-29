import * as THREE from 'three';
const loader = new THREE.TextureLoader();
export const jupiterGroup = new THREE.Group();
const tex = loader.load('assets/8k_jupiter.jpg');
const geo = new THREE.SphereGeometry(1.0, 256, 256);
const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, metalness: 0.1 });
const jupiterMesh = new THREE.Mesh(geo, mat);
jupiterGroup.add(jupiterMesh);
const tiltRad = 3.13 * Math.PI / 180;
jupiterGroup.rotation.x = tiltRad;
jupiterGroup.rotation.z = 0.01;

export const jupiterOrbitRadius = 91.2;
export let jupiterAngle = 5.2;
export const jupiterSpeed = 0.00045;

export function jupiterUpdate(delta) {
    const step = jupiterSpeed * (delta * 60);
    jupiterAngle += step;
    if (jupiterAngle > Math.PI*2) jupiterAngle -= Math.PI*2;
    jupiterGroup.position.set(Math.cos(jupiterAngle)*jupiterOrbitRadius, 0, Math.sin(jupiterAngle)*jupiterOrbitRadius);
    jupiterMesh.rotation.y += 0.003;
}