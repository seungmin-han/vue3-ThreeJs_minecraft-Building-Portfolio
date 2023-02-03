<template>
    <div ref="canvas"></div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import * as THREE from 'three';
    import TrackballControls from 'three-trackballcontrols';
     const scene = new THREE.Scene();
    // const composer = new THREE.EffectComposer(new WebGLRenderer())
    // const effectPass = new THREE.EffectPass(camera, new BloomEffect())
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const light = new THREE.DirectionalLight('hsl(0, 100%, 100%)');
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
        side: THREE.FrontSide,
        color: 'hsl(0, 100%, 50%)',
        wireframe: false
    });
    const cube = new THREE.Mesh(geometry, material);
    const axes = new THREE.AxesHelper(5);
    const speed = 0.01;

    let controls = [];
    const canvas = ref(null);

    scene.add(camera);
    scene.add(light);
    scene.add(cube);
    scene.add(axes);
    renderer.setSize(window.innerWidth, window.innerHeight);
    light.position.set(0, 0, 10);
    camera.position.z = 5;
    scene.background = new THREE.Color('hsl(0, 100%, 100%)');

    controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 5;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    
    onMounted(() => {
        canvas.value.appendChild(renderer.domElement);
        animate();
    })
    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        cube.rotation.y += speed;
        controls.update();
    }

    // const rotate = computed({
    //     get() {
    //         if (this.speed === '') {
    //             return 0
    //         } else {
    //             return this.speed;
    //         }
    //     }
    // })
        
</script>

<style>

</style>