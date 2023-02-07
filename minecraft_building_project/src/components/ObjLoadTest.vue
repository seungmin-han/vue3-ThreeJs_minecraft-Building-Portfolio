<template>
    <div class="item">
        <h2>{{props.fileName}}</h2>
        <div class="wrapper" ref="canvas" :class="isZoom ? 'zoom' : 'normal'">
            <div v-if="isLoadEnd" class="btn-group">  
                <button @click="setRotate(0.01)">회전</button>
                <button @click="setRotate(0)">멈춤</button>
                <button @click="zoom">{{ isZoom ? '축소' : '확대' }}</button>
            </div>
            <div v-else class="loading">
                Loading...
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

    const isLoadEnd = ref(false);

    const props = defineProps({
        fileName: String
    });

    const isZoom = ref(false);
    const rotate = ref(0);
    const setRotate = value => rotate.value = value;

    const zoomIn = () => {
        isZoom.value = false;
        camera.aspect = 300 / 500;
        renderer.setSize(300, 500);
    }

    const zoomOut = () => {
        isZoom.value = true;
        camera.aspect = window.innerWidth / window.innerHeight;
        renderer.setSize(window.innerWidth -100, window.innerHeight- 100);
    }

    const zoom = () => {
        if(isZoom.value) {
            zoomIn();
        } else {            
            zoomOut();
        }
        camera.updateProjectionMatrix();
    }

    let globalObj = reactive({});

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        300 / 500,
        0.1,
        2000
    );
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
    // const renderer = new THREE.WebGLRenderer({alpha:true});
    const light1 = new THREE.SpotLight(0xffffff, 3); // 스포트 라이트 조명
    const light2 = new THREE.SpotLight(0xffffff, 3); // 스포트 라이트 조명
    light1.lookAt(0,0,0);
    light2.lookAt(0,0,0);
    // const light = new THREE.AmbientLight(0xffffff, 3); // 맵 전체 조명
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
    scene.add(light1);
    scene.add(light2);

    const loadOBJ = async (materials) => {
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(`${process.env.VUE_APP_PUBLIC_PATH}/assets/${props.fileName}/`);
        objLoader.load(`${props.fileName}.obj`, 
            obj => {
                if(props.fileName == 'market') {
                    obj.rotation.y = 110;
                }
                let box = new THREE.Box3().setFromObject(obj);
                const size = box.getSize(new THREE.Vector3());
                const MAX_SIZE = Math.max(size.x, size.y, size.z);
                const center = box.getCenter(new THREE.Vector3());
                obj.position.set(-center.x, -center.y, -center.z);
                camera.position.y = size.y / 2;
                camera.position.z = MAX_SIZE;
                camera.position.x = MAX_SIZE;
                light1.position.set(MAX_SIZE,MAX_SIZE,MAX_SIZE);
                light2.position.set(-MAX_SIZE,MAX_SIZE,-MAX_SIZE);
                let tmp = new THREE.Group();
                scene.add(tmp);
                tmp.add(obj);
                // scene.add(obj);
                globalObj = tmp;
                globalObj.receiveShadow = true;
                isLoadEnd.value = true;
                controls.noZoom = false;
                controls.noPan = false;
                controls.noRotate = false;
                controls.staticMoving = true;
                canvas.value.appendChild(renderer.domElement);
                createControls();
                animate();
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

    const loadMTL = async () => {
        const mtlLoader = new MTLLoader();
        mtlLoader.setPath(`${process.env.VUE_APP_PUBLIC_PATH}/assets/${props.fileName}/`);
        mtlLoader.load(`${props.fileName}.mtl`, 
            materials => {
                materials.preload();
                loadOBJ(materials);
            }, 
            xhr => {
                // console.log(xhr.loaded / xhr.total * 100 + '% loaded')
            }, 
            err=>{
                console.log('mtl load error:', err);
            });
    }

    const createControls = () => {
        // controls = new TrackballControls(camera, renderer.domElement);
        controls = new OrbitControls(camera, renderer.domElement);
        controls.noZoom = true;
        controls.noPan = true;
        controls.noRotate = true;
        controls.staticMoving = false;
        // controls.rotateSpeed = 3.0;
        // controls.zoomSpeed = 5;
        // controls.panSpeed = 3;
        // controls.noPan = false;
        // controls.noRotate = false;
        // controls.staticMoving = true;
        // controls.dynamicDampingFactor = 0.3;
    }

    loadMTL();
    renderer.setSize(300, 500);
    camera.lookAt(0,25,0);
    scene.background = new THREE.Color('hsl(0, 100%, 100%)'); // 색, 채도, 명도 (hue, saturation, lightness)
    
    onMounted(() => {
        
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
        padding: 20px 20px 40px 20px;
        background-color: #333;
        margin: 10px;
    }
    .wrapper {
        position: relative;
        background-color: #fff;
    }

    .normal {
        width: 300px;
        height: 500px;
    }
    .zoom {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        border: #333 5px solid;
        z-index: 3000;
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
    .loading {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
</style>