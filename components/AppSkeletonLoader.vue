<script setup lang="ts">
interface Props {
  maxWidth?: number
  minWidth?: number
  height?: string
  width?: string
  customStyle?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  maxWidth: 100,
  minWidth: 80,
  height: '1em',
  width: undefined,
  customStyle: false,
})

const computedHeight = computed(() => {
  if (props.customStyle)
    return ''

  return props.height
})

const computedWidth = computed(() => {
  if (props.customStyle)
    return ''

  if (props.width)
    return props.width

  return `${Math.floor(Math.random() * (props.maxWidth - props.minWidth) + props.minWidth)}%`
})
</script>

<template>
  <span :style="{ height: computedHeight, width: computedWidth }" class="SkeletonBox" />
</template>

<style lang="scss">
.SkeletonBox {
  @apply bg-secondary/10 rounded inline-block relative align-middle overflow-hidden;
  &:after {
    content: '';
    background-image: linear-gradient(
      90deg,
      rgba(#fff, 0) 0,
      rgba(#fff, 0.2) 10%,
      rgba(#fff, 0.4) 70%,
      rgba(#fff, 0)
    );
    animation: shimmer 2s infinite;
    @apply absolute inset-0 -translate-x-full;
  }
  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
}
</style>
