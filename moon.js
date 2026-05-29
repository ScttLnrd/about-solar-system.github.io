import * as THREE from 'three';
const loader = new THREE.TextureLoader();
export const moonMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 128, 128),
    new THREE.MeshStandardMaterial({ map: loader.load('assets/8k_moon.jpg'), roughness: 0.8 })
);
const moonTiltRad = 1.5 * Math.PI / 180;
moonMesh.rotation.x = moonTiltRad;
moonMesh.rotation.z = 0.01;

export const moonOrbitRadius = 3.6;
export let moonAngle = 0;
export const moonSpeed = -0.00052;
export const moonTextureOffset = -0.2;

// Moon orbit ring visual (created in main, but we export it)
let moonOrbitRing = null;
export function setMoonOrbitRing(ring) { moonOrbitRing = ring; }
export { moonOrbitRing };

export function moonUpdate(delta, earthPos) {
    const step = moonSpeed * (delta * 60);
    moonAngle += step;
    if (moonAngle > Math.PI*2) moonAngle -= Math.PI*2;
    if (moonAngle < 0) moonAngle += Math.PI*2;
    const offsetX = Math.cos(moonAngle) * moonOrbitRadius;
    const offsetZ = Math.sin(moonAngle) * moonOrbitRadius;
    moonMesh.position.set(earthPos.x + offsetX, earthPos.y, earthPos.z + offsetZ);
    moonMesh.rotation.y = (moonAngle + Math.PI + moonTextureOffset) * -1;
}

