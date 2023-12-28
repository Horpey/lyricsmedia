import { SPOTIFY_API } from '~/constants'

export function useSpotify() {
  interface accessParam {
    code: string
  }

  const verifierCookie = useCookie('verifierCookie')
  const accessTokenCookie = useCookie('accessTokenCookie')

  const config = useRuntimeConfig()
  const clientId = config.public.spotifyClientID

  const isLoading = ref(false)
  const tracks = ref([])

  const router = useRouter()

  const generateCodeVerifier = (length: number) => {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length))

    return text
  }

  const generateCodeChallenge = async (codeVerifier: string) => {
    const data = new TextEncoder().encode(codeVerifier)
    const digest = await window.crypto.subtle.digest('SHA-256', data)
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }

  const initiateSpotifyAuth = async () => {
    const verifier = generateCodeVerifier(128)
    const challenge = await generateCodeChallenge(verifier)

    verifierCookie.value = verifier

    const params = new URLSearchParams()
    params.append('client_id', clientId)
    params.append('response_type', 'code')
    params.append('redirect_uri', 'http://localhost:3000')
    params.append('scope', 'user-read-private user-read-email')
    params.append('code_challenge_method', 'S256')
    params.append('code_challenge', challenge)

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`
  }

  const getAccessToken = async (param: accessParam) => {
    isLoading.value = true

    const params = new URLSearchParams()
    params.append('client_id', clientId)
    params.append('grant_type', 'authorization_code')
    params.append('code', param.code)
    params.append('redirect_uri', 'http://localhost:3000')
    params.append('code_verifier', verifierCookie.value!)

    const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    })

    isLoading.value = false
    if (result.ok) {
      const { access_token } = await result.json()

      accessTokenCookie.value = access_token
      router.push('/app')
    }
    else {
      // const error = await result.json()
      // TODO: handle error and display notification
    }
  }

  const getTracks = async () => {
    isLoading.value = true

    const result = await fetch(`${SPOTIFY_API}/tracks?market=NG&ids=7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessTokenCookie.value}` },
    })

    isLoading.value = false
    if (result.ok) {
      const response = await result.json()
      tracks.value = response?.tracks
    }
    else {
      // const error = await result.json()
      // console.log(error.error_description)
    }
  }

  return {
    initiateSpotifyAuth,
    getAccessToken,
    getTracks,
    tracks,
    isLoading,
  }
}
