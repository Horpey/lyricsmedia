<script lang="ts" setup>
const props = defineProps<Props>()

const { getVibrantColor, color } = useColor()
const { getTrackLyrics, lyrics, isLoading } = useSpotify()

interface Props {
  track: object
}

getVibrantColor(props.track?.album?.images[0].url)
getTrackLyrics(props.track?.id)
</script>

<template>
  <div class="rounded-md border border-secondary shadow-default relative" :style="`background-color: ${color}`">
    <div class="p-3 ">
      <div class="flex items-center justify-between">
        <div class=" flex-shrink-0 w-[80%]">
          <div class="flex items-center">
            <div>
              <img class="rounded-md w-12 h-12 object-cover" :src="track?.album?.images[0].url" alt="">
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-white text-ellipsis overflow-hidden">
                {{ track.name }}
              </p>
              <p class="text-xs font-medium text-white/80">
                {{ track?.artists[0].name }}
              </p>
            </div>
          </div>
        </div>

        <a :href="track?.external_urls?.spotify" target="_blank">
          <PhPlay weight="duotone" size="20" color="white" />
        </a>
      </div>

      <div v-if="isLoading" class="mt-5 mb-4 flex flex-col space-y-2">
        <AppSkeletonLoader width="100%" height="32px" />
        <AppSkeletonLoader width="75%" height="32px" />
      </div>

      <p v-if="lyrics.length" class="mb-4 text-white font-bold text-2xl flex flex-col mt-5">
        <template v-for="(field, index) in lyrics">
          <span v-if="index < 6" :key="index">
            {{ field.words }}
          </span>
        </template>
      </p>
    </div>
  </div>
</template>
