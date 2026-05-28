import * as THREE from 'three';
export const asteroidGroup = new THREE.Group();
const asteroidCount = 100;
const beltInnerRadius = 25.4;
const beltOuterRadius = 29.5;
const beltHeight = 1.2;

function createLumpyAsteroid(baseRadius, lumpStrength, detail, baseColor) {
    const geometry = new THREE.SphereGeometry(baseRadius, detail, detail);
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i], y = positions[i+1], z = positions[i+2];
        let dx = x, dy = y, dz = z;
        const len = Math.hypot(dx, dy, dz);
        if (len > 0) { dx /= len; dy /= len; dz /= len; }
        const theta = Math.atan2(z, x);
        const phi = Math.acos(y / len);
        const noise = Math.sin(theta * 5) * Math.cos(phi * 3) * 0.3 
                    + Math.sin(theta * 12) * 0.2 
                    + Math.cos(phi * 8) * 0.2;
        const random = (Math.sin(i * 0.01) * 0.5 + 0.5) * 0.2;
        const displace = lumpStrength * (0.6 + noise * 0.4 + random);
        const newLen = len + displace;
        positions[i] = dx * newLen;
        positions[i+1] = dy * newLen;
        positions[i+2] = dz * newLen;
    }
    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.7 + Math.random() * 0.3, metalness: 0.1, flatShading: false });
    return new THREE.Mesh(geometry, material);
}

const colors = [0xaaaaaa, 0x998877, 0xaa8866, 0xbb9988, 0x8a7f6d, 0x7c6e5e, 0x6b5e4a, 0x9c8e7a];
for (let i = 0; i < asteroidCount; i++) {
    const r = beltInnerRadius + Math.random() * (beltOuterRadius - beltInnerRadius);
    const angle = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * beltHeight;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const baseSize = 0.045 + Math.random() * 0.075;
    const lumpStrength = 0.25 + Math.random() * 0.35;
    const detail = 12 + Math.floor(Math.random() * 5);
    const color = colors[Math.floor(Math.random() * colors.length)];
    const asteroid = createLumpyAsteroid(baseSize, lumpStrength, detail, color);
    asteroid.position.set(x, y, z);
    asteroid.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
    asteroidGroup.add(asteroid);
}

export function updateAsteroidBelt(delta) {
    asteroidGroup.rotation.y += 0.0005;
}