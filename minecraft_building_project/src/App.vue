<template>
    <!-- <MainPage></MainPage> -->
    <h1>Minecraft Buildings</h1>
    <div class="container">
        <ObjLoadTest v-for="(fileName,index) in objList" :key="index" :fileName="fileName"></ObjLoadTest>
        <!-- <ObjLoadTest fileName="house"></ObjLoadTest> -->
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
import ObjLoadTest from './components/ObjLoadTest.vue';

const objList = [
  'exllu', 
  'nakagin',
  'house', 
  'market', 
  'hotel', 
  'villa', 
  'office_small', 
  'villa_12room', 
  'villa_4floor',
  'villa_3floor',
  'streetBlock',
  'apartment',
];

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
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
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

</style>
