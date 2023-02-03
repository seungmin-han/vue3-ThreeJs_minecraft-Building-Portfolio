<template>
    <div ref="canvas"></div>
</template>

<script setup>
    import { ref, onMounted, reactive } from 'vue';
    import { OBJLoader } from '../modules/OBJLoader';
    import { MTLLoader } from '../modules/MTLLoader';
    import * as THREE from 'three';
    // import { OBJLoader } from 'three-obj-mtl-loader';
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
    const light = new THREE.DirectionalLight('hsl(44, 100%, 100%)');
    let controls = reactive([]);
    const canvas = ref(null);

    scene.add(camera);
    scene.add(light);
    console.log(THREE.ObjectLoader);

    const mtlLoader = new MTLLoader();
    mtlLoader.setPath('/assets/');
    mtlLoader.load(`villa_12room.mtl`, 
            materials => {
                materials.preload();
                const objLoader = new OBJLoader();
                // console.log();
                objLoader.setMaterials(materials);
                objLoader.setPath('/assets/');
                objLoader.load(`villa_12room.obj`, 
                    obj => {
                        scene.add(obj);
                    }, 
                    xhr => {
                        console.log(xhr.loaded / xhr.total * 100 + '% loaded')
                    }, 
                    err=>{
                        console.log('obj load error:', err);
                    });
                    }, 
                    xhr => {
                        console.log(xhr.loaded / xhr.total * 100 + '% loaded')
                    }, 
                    err=>{
                        console.log('mtl load error:', err);
                    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    light.position.set(0, 5, 10);
    camera.position.z = 30;
    camera.position.x = 10;
    scene.background = new THREE.Color('hsl(0, 100%, 100%)');
    
    onMounted(() => {
        canvas.value.appendChild(renderer.domElement);
        controls = new TrackballControls(camera, renderer.domElement);
        controls.rotateSpeed = 3.0;
        controls.zoomSpeed = 5;
        controls.panSpeed = 3;
        controls.noZoom = false;
        controls.noPan = false;
        controls.noRotate = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
        animate();
    })
    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        controls.update();
    }
</script>

<style>

</style>