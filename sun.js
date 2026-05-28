import * as THREE from 'three';
const loader = new THREE.TextureLoader();
const sunTex = loader.load('assets/8k_sun.jpg');
const sunGeo = new THREE.SphereGeometry(3.0, 128, 128);
const sunMat = new THREE.MeshStandardMaterial({ map: sunTex, color: 0xffffff, emissive: 0xff5500, emissiveIntensity: 0.3, roughness: 1 });
export const sunMesh = new THREE.Mesh(sunGeo, sunMat);

let time = 0;
export function updateSun(delta) {
    time += delta;
    const glow = 0.75 + Math.sin(time * 1.2) * 0.1;
    sunMat.emissiveIntensity = glow;
    // Sun rotation (optional)
    sunMesh.rotation.y += 0.001;
}