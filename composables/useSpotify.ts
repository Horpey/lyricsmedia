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
  const lyrics = ref([])
  const redirect_uri = 'https://lyricsmedia.vercel.app' // 'http://localhost:3000'

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
    params.append('redirect_uri', redirect_uri)
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
    params.append('redirect_uri', redirect_uri)
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
    // tracks?market=NG&ids=1IMRi5UVOV77PsAgdWDvzh

    const result = await fetch(`${SPOTIFY_API}/playlists/6GVEa4uiNYJnWnoZmEz2H7`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessTokenCookie.value}` },
    })

    isLoading.value = false
    if (result.ok) {
      const response = await result.json()

      tracks.value = response?.tracks?.items
    }
    else {
      // const error = await result.json()
      // console.log(error.error_description)
    }
  }

  const getTrackLyrics = async (trackId: string) => {
    isLoading.value = true
    // ${SPOTIFY_API}/tracks/${trackId}
    const result = await fetch(`https://spotify-lyric-api-984e7b4face0.herokuapp.com/?trackid=${trackId}`, {
      method: 'GET',
    })

    isLoading.value = false
    if (result.ok) {
      const response = await result.json()
      lyrics.value = response?.lines
    }
  }

  return {
    initiateSpotifyAuth,
    getAccessToken,
    getTracks,
    getTrackLyrics,
    lyrics,
    tracks,
    isLoading,
  }
}
