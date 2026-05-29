import * as THREE from 'three';
const loader = new THREE.TextureLoader();
export const earthGroup = new THREE.Group();
const dayTex = loader.load('assets/8k_earth_daymap.jpg');
const nightTex = loader.load('assets/8k_earth_nightmap.jpg');
const geo = new THREE.SphereGeometry(0.65, 128, 128);
const mat = new THREE.MeshStandardMaterial({
    map: dayTex,
    emissiveMap: nightTex,
    emissive: 0x88aaff,
    emissiveIntensity: 0.7,
    roughness: 0.7,
    metalness: 0.15
});
const earthMesh = new THREE.Mesh(geo, mat);
earthGroup.add(earthMesh);
const tiltRad = 23.5 * Math.PI / 180;
earthGroup.rotation.x = tiltRad;
earthGroup.rotation.z = 0.02;

export const earthOrbitRadius = 100;
export let earthAngle = 3.0;
export const earthSpeed = 0.0012;

export function earthUpdate(delta) {
    const step = earthSpeed * (delta * 60);
    earthAngle += step;
    if (earthAngle > Math.PI*2) earthAngle -= Math.PI*2;
    earthGroup.position.set(Math.cos(earthAngle)*earthOrbitRadius, 0, Math.sin(earthAngle)*earthOrbitRadius);
    earthMesh.rotation.y += 0.005;
}