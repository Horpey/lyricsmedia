<script lang="ts" setup>
const { initiateSpotifyAuth, getAccessToken, isLoading } = useSpotify()
const route = useRoute()

onMounted(() => {
  if (route.query.code)
    getAccessToken({ code: route.query.code.toString() })
})
</script>

<template>
  <div class="flex flex-col justify-between h-full py-20">
    <div>
      <AppLogo height="50" class="mx-auto" />
      <p class="font-light text-center text-sm mt-10">
        Explore, share, and discover lyrics with us. Let the music journey begin!"
      </p>
    </div>

    <AppButton :loading="isLoading" @click="initiateSpotifyAuth()">
      <span class="flex space-x-2 justify-center">
        <PhSpotifyLogo weight="fill" size="24" />
        <span>Continue with Spotify</span>
      </span>
    </AppButton>
  </div>
</template>
