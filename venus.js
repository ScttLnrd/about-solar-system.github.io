import * as THREE from 'three';
const loader = new THREE.TextureLoader();
export const venusGroup = new THREE.Group();
const tex = loader.load('assets/8k_venus_surface.jpg');
const geo = new THREE.SphereGeometry(0.42, 128, 128);
const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 });
const venusMesh = new THREE.Mesh(geo, mat);
venusGroup.add(venusMesh);
const tiltRad = 177 * Math.PI / 180;
venusGroup.rotation.x = tiltRad;
venusGroup.rotation.z = 0.03;

export const venusOrbitRadius = 25.9;
export let venusAngle = 1.8;
export const venusSpeed = 0.0018;

export function venusUpdate(delta) {
    const step = venusSpeed * (delta * 60);
    venusAngle += step;
    if (venusAngle > Math.PI*2) venusAngle -= Math.PI*2;
    venusGroup.position.set(Math.cos(venusAngle)*venusOrbitRadius, 0, Math.sin(venusAngle)*venusOrbitRadius);
    venusMesh.rotation.y += 0.003;
}