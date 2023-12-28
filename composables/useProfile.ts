import { SPOTIFY_API } from '~/constants'

export function useProfile() {
  const accessTokenCookie = useCookie('accessTokenCookie')
  const userDataCookie = useCookie('userDataCookie')

  const isLoading = ref(false)
  const router = useRouter()

  const fetchProfile = async () => {
    isLoading.value = true

    const result = await fetch(`${SPOTIFY_API}/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessTokenCookie.value}` },
    })
    if (!result.ok) {
      isLoading.value = false

      router.push('/')
      // return
    }

    const data = await result.json()
    isLoading.value = false
    userDataCookie.value = data
  }

  onMounted(() => {
    if (accessTokenCookie.value)
      fetchProfile()
  })

  return {
    isLoading,
    user: userDataCookie as any,
  }
}
