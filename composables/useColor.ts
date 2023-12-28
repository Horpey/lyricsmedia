import * as Vibrant from 'node-vibrant'

export function useColor() {
  const color = ref('#A4B55B')

  const getVibrantColor = async (image: string) => {
    const vibrant = await Vibrant.from(image).getPalette()
    color.value = vibrant?.Vibrant?.hex as string
  }

  return {
    getVibrantColor,
    color,
  }
}
