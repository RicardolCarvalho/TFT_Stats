import React from 'react'
import type { Platform } from '../lib/regions'

type Props = {
  riotId: string
  setRiotId: (v: string) => void
  platform: Platform
  setPlatform: React.Dispatch<React.SetStateAction<Platform>>
  onSearch: () => void
  loading: boolean
}

const platforms: Platform[] = [
  'br1','na1','euw1','eun1','kr','jp1','la1','la2','oc1','tr1','ru','ph2','sg2','th2','tw2','vn2'
]

export default function SearchBar({ riotId, setRiotId, platform, setPlatform, onSearch, loading }: Props) {
  return (
    <div className="search-row">
      <input
        className="input"
        value={riotId}
        onChange={(e) => setRiotId(e.target.value)}
        placeholder="Riot ID (ex.: Nome#TAG)"
      />
      <select className="select" value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
        {platforms.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
      </select>
      <button className="button" onClick={onSearch} disabled={loading}>
        {loading ? 'Buscando…' : 'Buscar'}
      </button>
    </div>
  )
}
