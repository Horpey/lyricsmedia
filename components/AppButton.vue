<script lang="ts" setup>
import { defineProps } from 'vue'

defineProps({
  loading: Boolean,
})
</script>

<template>
  <button
    :class="{
      'opacity-50 cursor-not-allowed': loading,
    }" :disabled="loading"
    class="bg-primary border-secondary py-4 border-2 rounded-lg font-bold text-secondary shadow-default hover:shadow-none transtion duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50 flex items-center justify-center space-x-2"
  >
    <slot />
    <AppLoading v-if="loading" />
  </button>
</template>
