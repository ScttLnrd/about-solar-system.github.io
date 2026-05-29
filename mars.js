import * as THREE from 'three';
const loader = new THREE.TextureLoader();
export const marsGroup = new THREE.Group();
const tex = loader.load('assets/8k_mars.jpg');
const geo = new THREE.SphereGeometry(0.45, 128, 128);
const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6, metalness: 0.1 });
const marsMesh = new THREE.Mesh(geo, mat);
marsGroup.add(marsMesh);
const tiltRad = 25.2 * Math.PI / 180;
marsGroup.rotation.x = tiltRad;
marsGroup.rotation.z = 0.01;

export const marsOrbitRadius = 54.4;
export let marsAngle = 4.5;
export const marsSpeed = 0.0009;

export function marsUpdate(delta) {
    const step = marsSpeed * (delta * 60);
    marsAngle += step;
    if (marsAngle > Math.PI*2) marsAngle -= Math.PI*2;
    marsGroup.position.set(Math.cos(marsAngle)*marsOrbitRadius, 0, Math.sin(marsAngle)*marsOrbitRadius);
    marsMesh.rotation.y += 0.004;
}