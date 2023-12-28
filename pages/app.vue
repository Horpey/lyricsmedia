<script lang="ts" setup>
const { user, isLoading } = useProfile()
const { getTracks, tracks, isLoading: tracksLoading } = useSpotify()

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
          v-if="user?.images?.length"
          class="rounded-md w-12 h-12 object-cover border-secondary border shadow-default" :src="user?.images[0]?.url"
          :alt="user?.display_name"
        >
        <span v-else class="rounded-md w-12 h-12 object-cover border-secondary border shadow-default bg-primary flex items-center justify-center">
          <PhUser weight="duotone" size="20" class="text-secondary" />
        </span>
      </div>

      <div class="flex space-y-5 flex-col my-12">
        <template v-if="tracksLoading">
          <AppSkeletonLoader v-for="i in 6" :key="i" width="100%" height="72px" />
        </template>

        <AppLyricsCard v-for="(track, index) in tracks" v-else :key="index" :track="track?.track" />
      </div>
    </div>
  </div>
</template>
