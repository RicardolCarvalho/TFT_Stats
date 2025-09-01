async function http(path: string, params: Record<string, string | number>) {
  const url = new URL(path, window.location.origin)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
  const res = await fetch(url.toString())
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  return res.json()
}

export async function accountByRiotId(region: string, gameName: string, tagLine: string) {
  return http('/api/riot-proxy', { route: 'account-by-riot-id', region, gameName, tagLine })
}

export async function summonerByPuuid(platform: string, puuid: string) {
  return http('/api/riot-proxy', { route: 'summoner-by-puuid', platform, puuid })
}

export async function matchesByPuuid(region: string, puuid: string, count: number) {
  return http('/api/riot-proxy', { route: 'matches-by-puuid', region, puuid, count })
}

export async function matchById(region: string, id: string) {
  return http('/api/riot-proxy', { route: 'match-by-id', region, id })
}

export async function leagueBySummoner(platform: string, summonerId: string) {
  return http('/api/riot-proxy', { route: 'league-by-summoner', platform, summonerId })
}

export async function lolSummonerByPuuid(platform: string, puuid: string) {
  return http('/api/riot-proxy', { route: 'lol-summoner-by-puuid', platform, puuid })
}

export async function tftRatedByPuuid(platform: string, puuid: string) {
  return http('/api/riot-proxy', { route: 'tft-rated-by-puuid', platform, puuid })
}

export async function leagueByPuuid(platform: string, puuid: string) {
  return http('/api/riot-proxy', { route: 'league-by-puuid', platform, puuid })
}
