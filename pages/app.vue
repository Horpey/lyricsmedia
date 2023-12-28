<script lang="ts" setup>
const { user, isLoading } = useProfile()
const { getTracks, tracks } = useSpotify()

getTracks()
</script>

<template>
  <div class="flex h-full pb-6 w-full flex-col">
    <div v-if="isLoading" class="flex justify-center items-center w-full h-full">
      <AppLoading text="Loading data" />
    </div>

    <div v-else-if="user">
      <div class="flex items-center justify-between sticky top-0 pt-6 z-10">
        <NuxtLink to="/app">
          <AppLogo height="30" />
        </NuxtLink>

        <img
          class="rounded-md w-12 h-12 object-cover border-secondary border shadow-default" :src="user?.images[0]?.url"
          :alt="user?.display_name"
        >
      </div>

      <div class="flex space-y-5 flex-col my-12">
        <AppLyricsCard v-for="(track, index) in tracks" :key="index" :track="track" />
      </div>
    </div>
  </div>
</template>
