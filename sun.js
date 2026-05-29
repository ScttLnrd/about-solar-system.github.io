import * as THREE from 'three';

const loader = new THREE.TextureLoader();
const sunTex = loader.load('assets/8k_sun.jpg');

// Higher resolution sphere for better texture detail
const sunGeo = new THREE.SphereGeometry(3.0, 256, 256);

const sunMat = new THREE.MeshStandardMaterial({
    map: sunTex,
    color: 0xffffff,           // pure white – texture shows true colors
    emissive: 0xff5508,      // warm white (less orange)
    emissiveIntensity: 0.45,   // balanced – enough glow but texture visible
    roughness: 0.5,
    metalness: 0.0
});
export const sunMesh = new THREE.Mesh(sunGeo, sunMat);

let time = 0;
export function updateSun(delta) {
    time += delta;
    // Gentle pulsation – range 0.6 to 0.7 (subtle)
    const glow = 1.15 + Math.sin(time * 1.2) * 0.07;
    sunMat.emissiveIntensity = glow;
    sunMesh.rotation.y += 0.001;
}