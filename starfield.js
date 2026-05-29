import * as THREE from 'three';

let blinkSprites = [];
let starTex = null;

function createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffccaa';
    ctx.beginPath();
    ctx.arc(16, 16, 12, 0, 2*Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(16, 16, 6, 0, 2*Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
}

export function createStarfield(scene) {
    starTex = createStarTexture();
    const blinkCount = 250;
    for (let i = 0; i < blinkCount; i++) {
        const u = Math.random(), v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const dx = Math.sin(phi) * Math.cos(theta);
        const dy = Math.sin(phi) * Math.sin(theta);
        const dz = Math.cos(phi);
        const r = 50 + Math.random() * 200;
        const material = new THREE.SpriteMaterial({ map: starTex, color: 0xffccaa, transparent: true, opacity: 0.7 + Math.random() * 0.6, blending: THREE.AdditiveBlending });
        const sprite = new THREE.Sprite(material);
        sprite.position.set(dx * r, dy * r, dz * r);
        sprite.userData = {
            speed: 0.6 + Math.random() * 2.5,
            phase: Math.random() * Math.PI * 2,
            baseScale: 0.15 + Math.random() * 0.12
        };
        sprite.scale.set(sprite.userData.baseScale, sprite.userData.baseScale, 1);
        scene.add(sprite);
        blinkSprites.push(sprite);
    }
}

export function updateStarfield(time) {
    blinkSprites.forEach(sprite => {
        const d = sprite.userData;
        const blink = (Math.sin(time * d.speed + d.phase) + 1) / 2;
        sprite.material.opacity = 0.3 + blink * 0.7;
        const scale = d.baseScale * (0.6 + blink * 0.8);
        sprite.scale.set(scale, scale, 1);
    });
}