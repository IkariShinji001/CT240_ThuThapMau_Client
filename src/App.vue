<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="wrapper">
    <q-layout>
      <q-page-container>
        <RouterView />
      </q-page-container>
    </q-layout>
  </div>
</template>

<style>
*{
  font-family: 'Quicksand', sans-serif;
}

</style>
