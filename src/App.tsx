import React, { useEffect, useMemo, useState } from 'react'
import { platformToRegion } from './lib/regions'
import type { Platform } from './lib/regions'
import { getLatestDDragon, loadTftData, type TftDatabases } from './lib/ddragon'
import { accountByRiotId, summonerByPuuid, matchesByPuuid, matchById, leagueBySummoner, lolSummonerByPuuid, tftRatedByPuuid, leagueByPuuid } from './lib/api'
import type { TftLeagueEntry } from './lib/types'
import type { MatchDto } from './lib/types'
import AppView from './components/AppView'

export default function App() {
  const [riotId, setRiotId] = useState('')
  const [platform, setPlatform] = useState<Platform>('br1')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [puuid, setPuuid] = useState<string | null>(null)
  const [summoner, setSummoner] = useState<any>(null)
  const [matches, setMatches] = useState<MatchDto[]>([])
  const [dd, setDd] = useState<TftDatabases | null>(null)
  const [league, setLeague] = useState<TftLeagueEntry | null>(null)
  const [riotAccount, setRiotAccount] = useState<{ gameName: string; tagLine: string } | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const version = await getLatestDDragon()
        const data = await loadTftData(version, 'pt_BR')
        setDd(data)
      } catch (e) {
        console.error(e)
        setError('Falha ao carregar Data Dragon.')
      }
    })()
  }, [])

  const region = useMemo(() => platformToRegion(platform), [platform])

  async function onSearch() {
    if (!riotId.trim()) {
      setError(null)
      setPuuid(null)
      setSummoner(null)
      setMatches([])
      setLeague(null)
      setRiotAccount(null)
      return
    }
    setLoading(true); setError(null)
    try {
      let gameName = riotId
      let tagLine = 'BR1'
      if (riotId.includes('#')) {
        const parts = riotId.split('#')
        gameName = parts[0]
        if (parts.length > 1) {
          tagLine = parts[1]
        }
      }
      const account = await accountByRiotId(region, gameName, tagLine)
      setPuuid(account.puuid)
      setRiotAccount({ gameName: account.gameName, tagLine: account.tagLine })
      const summ = await summonerByPuuid(platform, account.puuid)
      setSummoner(summ)
      const ids = await matchesByPuuid(region, account.puuid, 5)
      const matchDtos = await Promise.all(ids.map((id: string) => matchById(region, id)))
      setMatches(matchDtos)
      try {
        let encryptedId: string | undefined = undefined
        if (summ && (summ as any).id) {
          encryptedId = (summ as any).id as string
        }
        if (!encryptedId) {
          const lolSumm = await lolSummonerByPuuid(platform, account.puuid)
          if (lolSumm && (lolSumm as any).id) {
            encryptedId = (lolSumm as any).id as string
          }
        }
        if (encryptedId) {
          const entries: TftLeagueEntry[] = await leagueBySummoner(platform, encryptedId)
          const preference = ['RANKED_TFT','RANKED_TFT_STANDARD','RANKED_TFT_DOUBLE_UP','RANKED_TFT_TURBO','RANKED_TFT_PAIRS']
          function preferenceIndex(queueType: string): number {
            const i = preference.indexOf(queueType)
            if (i === -1) {
              return Number.MAX_SAFE_INTEGER
            }
            return i
          }
          const sorted = [...entries].sort((a, b) => preferenceIndex(a.queueType) - preferenceIndex(b.queueType))
          let selected: TftLeagueEntry | null = null
          if (sorted.length > 0) {
            selected = sorted[0]
          }
          setLeague(selected)
        } else {
          const byPuuid: TftLeagueEntry[] = await leagueByPuuid(platform, account.puuid)
          let selected: TftLeagueEntry | null = null
          if (byPuuid && byPuuid.length > 0) {
            selected = byPuuid[0]
          }
          if (!selected) {
            const rated = await tftRatedByPuuid(platform, account.puuid)
            if (rated && rated.ratedTier) {
              selected = { queueType: 'RANKED_TFT_TURBO', ratedTier: rated.ratedTier, ratedRating: rated.ratedRating }
            }
          }
          setLeague(selected)
        }
      } catch (_err) {
        setLeague(null)
      }
    } catch (e: unknown) {
      console.error(e)
      let message = 'Erro na busca.'
      if (e instanceof Error) {
        message = e.message
      }
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const shouldShowWelcome = !summoner && matches.length === 0
  let primaryName = riotId
  if (riotAccount) {
    primaryName = `${riotAccount.gameName}#${riotAccount.tagLine}`
  } else if (summoner && (summoner as any).name) {
    primaryName = (summoner as any).name
  }
  let secondaryName: string | null = null
  if (summoner && (summoner as any).name) {
    secondaryName = (summoner as any).name
  }
  let rankText = 'Unranked'
  if (league) {
    rankText = formatRank(league)
  }
  let summonerProfileIconId = 0
  if (summoner && (summoner as any).profileIconId !== undefined && (summoner as any).profileIconId !== null) {
    summonerProfileIconId = (summoner as any).profileIconId as number
  }
  let summonerLevel = 0
  if (summoner && (summoner as any).summonerLevel !== undefined && (summoner as any).summonerLevel !== null) {
    summonerLevel = (summoner as any).summonerLevel as number
  }

  return (
    <AppView
      riotId={riotId}
      setRiotId={setRiotId}
      platform={platform}
      setPlatform={setPlatform}
      loading={loading}
      error={error}
      shouldShowWelcome={shouldShowWelcome}
      primaryName={primaryName}
      secondaryName={secondaryName}
      rankText={rankText}
      summonerPresent={Boolean(summoner)}
      summonerProfileIconId={summonerProfileIconId}
      summonerLevel={summonerLevel}
      dd={dd}
      puuid={puuid}
      matches={matches}
      onSearch={onSearch}
    />
  )
}

function formatRank(e: TftLeagueEntry) {
  const cap = (s: string | undefined) => s ? s.charAt(0) + s.slice(1).toLowerCase() : ''
  const tier = cap(e.tier)
  if (!tier) return 'Unranked'
  let lp = 0
  if (typeof e.leaguePoints === 'number') {
    lp = e.leaguePoints
  }
  if (['Master','Grandmaster','Challenger'].includes(tier)) {
    return `${tier} ${lp}LP`
  }
  let roman = ''
  if (typeof e.rank === 'string' && e.rank) {
    roman = e.rank
  }
  return `${tier} ${roman} ${lp}LP`
}
