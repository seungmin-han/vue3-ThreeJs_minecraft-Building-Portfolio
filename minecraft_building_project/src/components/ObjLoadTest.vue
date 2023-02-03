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


    const ASSET_FOLDER_NAME = 'nakagin';
    const FILE_NAME = 'nakagin';

    let globalObj = reactive(null);

    const scene = new THREE.Scene();
    // const composer = new THREE.EffectComposer(new WebGLRenderer())
    // const effectPass = new THREE.EffectPass(camera, new BloomEffect())
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const light = new THREE.DirectionalLight('hsl(44, 100%, 100%)');
    let controls = reactive([]);
    const canvas = ref(null);
    const axes = new THREE.AxesHelper(5);
    scene.add(axes);
    scene.add(camera);
    scene.add(light);

    const mtlLoader = new MTLLoader();
    mtlLoader.setPath(`/assets/${ASSET_FOLDER_NAME}/`);
    mtlLoader.load(`${FILE_NAME}.mtl`, 
            materials => {
                materials.preload();
                const objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.setPath(`/assets/${ASSET_FOLDER_NAME}/`);
                objLoader.load(`${FILE_NAME}.obj`, 
                    obj => {
                        // const box3 = new THREE.Box3().setFromObject(obj);
                        // const size = box3.getSize(new THREE.Vector3());
                        // console.log(obj);
                        // const center = box3.getCenter(new THREE.Vector3());
                        // obj.position.set(-center.x, -center.y, -center.z);
                        // const MAX_SIZE = Math.max(size.x, size.y, size.z);
                        // obj.scale.x = 1 / MAX_SIZE;
                        // obj.scale.y = 1 / MAX_SIZE;
                        // obj.scale.z = 1 / MAX_SIZE;

                        let box = new THREE.Box3().setFromObject(obj);
                        const center = box.getCenter(new THREE.Vector3());
                        obj.position.set(-center.x, -center.y, -center.z);
                        let tmp = new THREE.Group();
                        scene.add(tmp);
                        tmp.add(obj);
                        // scene.add(obj);
                        globalObj = tmp;
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
    camera.position.y = 1000;
    camera.position.z = 0;
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
        try{
            globalObj.rotation.y += 0.01;
        } catch {
            //
        }
        
        controls.update();
    }
</script>

<style>

</style>