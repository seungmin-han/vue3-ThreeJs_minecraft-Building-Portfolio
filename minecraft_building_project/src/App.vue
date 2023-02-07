<template>
    <div class="overlay" v-if="showOverlay"></div>
    <h1>Minecraft Buildings</h1>
    <div class="container">
        <BuildingItem 
            v-for="(fileName,index) in objList" 
            :key="index" 
            :fileName="fileName" 
            @zoom="zoom">
        </BuildingItem>
    </div>
    <footer>
        <div class="footer-wrap">
            <p>Copyright © SEUNGMIN HAN 2023. All rights reserved.</p>
            <ul class="social-media">
                <li><a href="https://github.com/seungmin-han" target="_blank">github</a></li>
                <li><a href="https://www.instagram.com/1seungm1n/" target="_blank">instagram</a></li>
            </ul>
        </div>
    </footer>
</template>

<script setup>
// import MainPage from './components/MainPage.vue';
import { ref } from '@vue/reactivity';
import BuildingItem from './components/BuildingItem.vue';

const showOverlay = ref(false);

const objList = [
  'exllu', 
  'nakagin',
  'hotel', 
  'house', 
  'market', 
  'villa', 
  'office_small', 
  'villa_12room', 
  'villa_4floor',
  'villa_3floor',
  'streetBlock',
  'apartment',
];

const zoom = (flag) => {
    showOverlay.value = flag;
}


</script>

<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
  text-decoration: none;
  box-sizing: border-box;
}
</style>
<style scoped>

h1 {
    text-align: center;
    padding: 20px;
}
.container {
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    min-height: 800px;
}

.item {
    background-color: #000;
}
.footer-wrap {
    margin-top: 20px;
    padding: 10px;
    width: 100%;
    background-color: #444;
}
.footer-wrap p {
    color: #fff;
    text-align: center;
    margin: 20px 0;
}

.footer-wrap > ul {
    text-align: center;
}

.footer-wrap > ul > li {
    color: #fff;
    display: inline-block;
    padding: 5px 10px;
}

a {
    color: #fff;
    text-decoration: underline;
}

.overlay {
    z-index: 10;
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.3);
}
</style>
