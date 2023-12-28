<script lang="ts" setup>
const props = defineProps<Props>()

const { getVibrantColor, color } = useColor()

interface Props {
  track: object
}

getVibrantColor(props.track?.album?.images[0].url)
</script>

<template>
  <div class="rounded-md border border-secondary shadow-default relative" :style="`background-color: ${color}`">
    <div class="p-3 ">
      <div class="flex items-center justify-between">
        <div class="block flex-shrink-0">
          <div class="flex items-center">
            <div>
              <img class="rounded-md w-12 h-12 object-cover" :src="track?.album?.images[0].url" alt="">
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-white">
                {{ track.name }}
              </p>
              <p class="text-xs font-medium text-white/80">
                {{ track?.artists[0].name }}
              </p>
            </div>
          </div>
        </div>

        <button>
          <PhPlay weight="duotone" size="20" color="white" />
        </button>
      </div>

      <div class="mt-5">
        <span class="text-white bg-white/30 px-3 py-2 rounded-full text-sm">Chorus</span>
        <p class="my-4 text-white font-bold text-2xl">
          Music no need permission to enter your spirit
          Anywhere, anyhow you know say you go feel me.
        </p>
      </div>
    </div>
  </div>
</template>
