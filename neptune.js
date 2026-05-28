import * as THREE from 'three';

const loader = new THREE.TextureLoader();

// Neptune planet group (for axial tilt)
export const neptuneGroup = new THREE.Group();
const neptuneTex = loader.load('assets/2k_neptune.jpg');   // 2K texture
const neptuneGeo = new THREE.SphereGeometry(0.82, 256, 256); // Slightly smaller than Uranus (0.85)
const neptuneMat = new THREE.MeshStandardMaterial({ map: neptuneTex, roughness: 0.5, metalness: 0.1 });
const neptuneMesh = new THREE.Mesh(neptuneGeo, neptuneMat);
neptuneGroup.add(neptuneMesh);

// Axial tilt: 28.3 degrees = 0.494 rad
const neptuneTiltRad = 28.3 * Math.PI / 180;
neptuneGroup.rotation.x = neptuneTiltRad;
neptuneGroup.rotation.z = 0.01;

// Orbit parameters (beyond Uranus)
export const neptuneOrbitRadius = 82.0;   // Scaled (Uranus = 68)
export let neptuneAngle = 4.0;
export const neptuneSpeed = 0.00016;      // Slower than Uranus (~165 Earth years)

export function neptuneUpdate(delta) {
    const step = neptuneSpeed * (delta * 60);
    neptuneAngle += step;
    if (neptuneAngle > Math.PI*2) neptuneAngle -= Math.PI*2;
    neptuneGroup.position.set(Math.cos(neptuneAngle)*neptuneOrbitRadius, 0, Math.sin(neptuneAngle)*neptuneOrbitRadius);
    neptuneMesh.rotation.y += 0.002;
}