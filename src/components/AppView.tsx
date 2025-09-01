import React from 'react'
import type { Platform } from '../lib/regions'
import type { MatchDto } from '../lib/types'
import type { TftDatabases } from '../lib/ddragon'
import SearchBar from './SearchBar'
import MatchCard from './MatchCard'

type Props = {
  riotId: string
  setRiotId: (v: string) => void
  platform: Platform
  setPlatform: React.Dispatch<React.SetStateAction<Platform>>
  loading: boolean
  error: string | null
  shouldShowWelcome: boolean
  primaryName: string
  secondaryName: string | null
  rankText: string
  summonerPresent: boolean
  summonerProfileIconId: number
  summonerLevel: number
  dd: TftDatabases | null
  puuid: string | null
  matches: MatchDto[]
  onSearch: () => void
}

export default function AppView(props: Props) {
  const {
    riotId, setRiotId, platform, setPlatform, loading, error,
    shouldShowWelcome, primaryName, secondaryName, rankText,
    summonerPresent, summonerProfileIconId, summonerLevel,
    dd, puuid, matches, onSearch,
  } = props

  const canRenderMatches = Boolean(matches.length > 0 && dd && puuid)

  let welcomeBlock: React.ReactNode = null
  if (shouldShowWelcome) {
    welcomeBlock = (
      <div className="welcome">
        <div className="welcome-title">Bem-vindo(a) ao TFT Stats</div>
        <p className="welcome-p">Busque por Riot ID (ex: <code>Rafak#BR1</code>).</p>
        <div className="welcome-hint">Digite seu Riot ID acima e clique em Buscar para ver seu perfil e partidas recentes.</div>
      </div>
    )
  }

  let errorBlock: React.ReactNode = null
  if (error) {
    errorBlock = <div className="error-alert">{error}</div>
  }

  let secondarySpan: React.ReactNode = null
  if (secondaryName) {
    secondarySpan = <span className="name-secondary">{secondaryName}</span>
  }

  let profileBlock: React.ReactNode = null
  if (summonerPresent) {
    profileBlock = (
      <div className="profile">
        <img className="profile-icon" src={`https://ddragon.leagueoflegends.com/cdn/15.17.1/img/profileicon/${summonerProfileIconId}.png`} />
        <div>
          <div className="name-row">
            <span className="name-primary">{primaryName}</span>
            {secondarySpan}
            <span className="rank">{rankText}</span>
          </div>
          <div className="level">Level {summonerLevel}</div>
        </div>
      </div>
    )
  }

  let matchesBlock: React.ReactNode = null
  if (canRenderMatches) {
    matchesBlock = (
      <div className="matches-grid">
        {matches.map(m => (
          <MatchCard key={m.metadata.match_id} match={m} puuid={puuid as string} dd={dd as TftDatabases} />
        ))}
      </div>
    )
  }

  return (
    <div className="app-container">
      <h1 className="app-title">TFT Stats</h1>
      {welcomeBlock}

      <SearchBar
        riotId={riotId}
        setRiotId={setRiotId}
        platform={platform}
        setPlatform={setPlatform}
        onSearch={onSearch}
        loading={loading}
      />

      {errorBlock}
      {profileBlock}
      {matchesBlock}
    </div>
  )
}


