<template>
    <div ref="canvas"></div>
</template>

<script setup>
    import { ref, onMounted, reactive } from 'vue';
    import { OBJLoader } from '../modules/OBJLoader';
    import { MTLLoader } from '../modules/MTLLoader';
    import * as THREE from 'three';
    import TrackballControls from 'three-trackballcontrols';

    const props = defineProps({
      fileName: String
    })

    const ASSET_FOLDER_NAME = 'exllu';
    const FILE_NAME = 'exllu';

    let globalObj = reactive(null);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        300 / 500,
        0.1,
        2000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    // const light = new THREE.DirectionalLight('hsl(44, 100%, 100%)'); // 방향을 갖는 조명
    const light = new THREE.AmbientLight(0xffffff); // 맵 전체 조명
    // const light = new THREE.HemisphereLight(0xffffff, 0xff0000, 1); // 하늘 -> 땅 까지의 조명 (그라데이션?)
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
        objLoader.setPath(`/assets/${ASSET_FOLDER_NAME}/`);
        objLoader.load(`${FILE_NAME}.obj`, 
            obj => {
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
    }

    const loadMTL = () => {
        const mtlLoader = new MTLLoader();
        mtlLoader.setPath(`/assets/${ASSET_FOLDER_NAME}/`);
        mtlLoader.load(`${FILE_NAME}.mtl`, 
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
        controls = new TrackballControls(camera, renderer.domElement);
        controls.rotateSpeed = 3.0;
        controls.zoomSpeed = 5;
        controls.panSpeed = 3;
        controls.noZoom = false;
        controls.noPan = false;
        controls.noRotate = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
    }

    loadMTL();
    renderer.setSize(300, 500);
    // light.position.set(0, 5, 10);
    camera.position.y = 25;
    camera.position.z = 100;
    camera.position.x = 100;
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
            globalObj.rotation.y += 0.01;
        } catch {
            //
        }
        
        controls.update();
    }
</script>

<style>

</style>