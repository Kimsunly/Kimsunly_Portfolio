<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BootSequence from '@/components/layout/BootSequence.vue'
</script>

<template>
  <BootSequence />
  <DefaultLayout>
    <router-view />
  </DefaultLayout>
</template>
