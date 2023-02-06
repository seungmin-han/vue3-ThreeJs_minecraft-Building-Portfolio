<template>
    <div class="item">
        <h2>{{props.fileName}}</h2>
        <div class="wrapper" ref="canvas">
            <div class="btn-group">  
                <button @click="setRotate(0.01)">회전</button>
                <button @click="setRotate(0)">멈춤</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, reactive } from 'vue';
    import { OBJLoader } from '../modules/OBJLoader';
    import { MTLLoader } from '../modules/MTLLoader';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    // import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

    const props = defineProps({
        fileName: String
    });

    const rotate = ref(0);
    const setRotate = value => rotate.value = value;

    let globalObj = reactive(null);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        300 / 500,
        0.1,
        2000
    );
    const renderer = new THREE.WebGLRenderer({antialias: true});
    const light = new THREE.AmbientLight(0xffffff); // 맵 전체 조명
    /**  const light = new THREE.DirectionalLight('hsl(44, 100%, 100%)'); // 방향을 갖는 조명
     * const light = new THREE.SpotLight(0xffffff); // 스포트 라이트 조명
     * const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1); // 하늘 -> 땅 까지의 조명 (그라데이션?)
     */

    let controls = reactive([]);
    const canvas = ref(null);

    // 축 객체 (테스트 시 활성화)

    // const axes = new THREE.AxesHelper(5);
    // scene.add(axes);
    scene.add(camera);
    scene.add(light);

    const loadOBJ = (materials) => {
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(`/assets/${props.fileName}/`);
        objLoader.load(`${props.fileName}.obj`, 
            obj => {
                let box = new THREE.Box3().setFromObject(obj);
                const size = box.getSize(new THREE.Vector3());
                const MAX_SIZE = Math.max(size.x, size.y, size.z);
                const center = box.getCenter(new THREE.Vector3());
                obj.position.set(-center.x, -center.y, -center.z);
                camera.position.y = size.y / 2;
                camera.position.z = MAX_SIZE;
                camera.position.x = MAX_SIZE;
                let tmp = new THREE.Group();
                scene.add(tmp);
                tmp.add(obj);
                // scene.add(obj);
                globalObj = tmp;
            }, 
            // xhr => {
            //     console.log(xhr.loaded / xhr.total * 100 + '% loaded');
            // }, 
            () => {
                //
            }, 
            err=>{
                console.log('obj load error:', err);
        });
    }

    const loadMTL = () => {
        const mtlLoader = new MTLLoader();
        mtlLoader.setPath(`/assets/${props.fileName}/`);
        mtlLoader.load(`${props.fileName}.mtl`, 
            materials => {
                materials.preload();
                loadOBJ(materials);
            }, 
            xhr => {
                console.log(xhr.loaded / xhr.total * 100 + '% loaded')
            }, 
            err=>{
                console.log('mtl load error:', err);
            });
    }

    const createControls = () => {
        // controls = new TrackballControls(camera, renderer.domElement);
        controls = new OrbitControls(camera, renderer.domElement);
        // controls.rotateSpeed = 3.0;
        // controls.zoomSpeed = 5;
        // controls.panSpeed = 3;
        // controls.noZoom = false;
        // controls.noPan = false;
        // controls.noRotate = false;
        // controls.staticMoving = true;
        // controls.dynamicDampingFactor = 0.3;
    }

    loadMTL();
    renderer.setSize(300, 500);
    camera.lookAt(0,25,0);
    scene.background = new THREE.Color('hsl(0, 100%, 100%)');
    
    onMounted(() => {
        canvas.value.appendChild(renderer.domElement);
        createControls();
        animate();
    })
    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        try{
            globalObj.rotation.y += rotate.value;
        } catch {
            //
        }
        
        controls.update();
    }
</script>

<style scoped>
    .item {
        padding: 20px;
        background-color: #333;
        margin: 10px;
    }
    .wrapper {
        position: relative;
    }
    .btn-group {
        position: absolute;
        top: 0;
        right: 0;
    }
    .btn-group > btn {
        display: block;
    }
    h2 {
        color: #fff;
        padding: 10px;
    }
</style>