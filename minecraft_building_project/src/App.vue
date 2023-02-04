<template>
    <!-- <MainPage></MainPage> -->
    <div>
      <ObjLoadTest v-for="(fileName,index) in objList" :key="index" :fileName="fileName"></ObjLoadTest>
      <!-- <ObjLoadTest fileName="nakagin"></ObjLoadTest> -->
    </div>
</template>

<script setup>
import MainPage from './components/MainPage.vue';
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
