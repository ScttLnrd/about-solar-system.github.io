import * as THREE from 'three';

const loader = new THREE.TextureLoader();
export const neptuneGroup = new THREE.Group();
const neptuneTex = loader.load('assets/2k_neptune.jpg');
const neptuneGeo = new THREE.SphereGeometry(0.82, 256, 256);
const neptuneMat = new THREE.MeshStandardMaterial({ map: neptuneTex, roughness: 0.7, metalness: 0.1 });
const neptuneMesh = new THREE.Mesh(neptuneGeo, neptuneMat);
neptuneGroup.add(neptuneMesh);

const neptuneTiltRad = 28.3 * Math.PI / 180;
neptuneGroup.rotation.x = neptuneTiltRad;
neptuneGroup.rotation.z = 0.01;

export const neptuneOrbitRadius = 147.2;
export let neptuneAngle = 4.0;
export const neptuneSpeed = 0.00016;

export function neptuneUpdate(delta) {
    const step = neptuneSpeed * (delta * 60);
    neptuneAngle += step;
    if (neptuneAngle > Math.PI*2) neptuneAngle -= Math.PI*2;
    neptuneGroup.position.set(Math.cos(neptuneAngle)*neptuneOrbitRadius, 0, Math.sin(neptuneAngle)*neptuneOrbitRadius);
    neptuneMesh.rotation.y += 0.002;
}