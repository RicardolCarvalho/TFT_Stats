import React, { useMemo } from 'react'
import type { MatchDto } from '../lib/types'
import type { TftDatabases } from '../lib/ddragon'

function timeAgo(ts: number) {
  const d = new Date(ts)
  const diff = Date.now() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m atrás`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h atrás`
  const days = Math.floor(hours / 24)
  return `${days}d atrás`
}

function tftModeName(queueId: number) {
  switch (queueId) {
    case 1090: return 'Normal'
    case 1100: return 'Ranqueada'
    case 1130: return 'Hyper Roll'
    case 1160: return 'Dupla'
    case 1180: return 'Modo especial'
    default: return `Desconhecido (${queueId})`
  }
}

type Props = {
  match: MatchDto
  puuid: string
  dd: TftDatabases
}

export default function MatchCard({ match, puuid, dd }: Props) {
  const me = useMemo(() => match.info.participants.find(p => p.puuid === puuid), [match, puuid])
  const date = new Date(match.info.game_datetime)
  const mode = tftModeName(match.info.queue_id)

  if (!me) {
    return (
      <div className="not-found">
        <div className="not-found-text">Jogador não encontrado nesta partida.</div>
      </div>
    )
  }

  return (
    <div className="match-card">
      <div className="match-card-header">
        <div style={{ fontWeight: 700 }}>Colocação: {me.placement}º</div>
        <div className="muted">{mode} • {timeAgo(date.getTime())}</div>
      </div>

      <div className="units-row">
        {me.units.map((u) => {
          const champ = dd.champions[u.character_id]
          const img = champ ? `https://ddragon.leagueoflegends.com/cdn/${dd.version}/img/tft-champion/${champ.image.full}` : ''
          return (
            <div key={u.character_id + (u.itemNames ? u.itemNames.join('-') : '')} className="unit">
              {img ? <img className="unit-img" src={img} width={40} height={40} /> : null}
              <div>
                <div className="unit-name">{champ ? champ.name : u.character_id}</div>
                <div className="unit-stars">Estrelas: {u.tier}</div>
              </div>
            </div>
          )
        })}
      </div>

      {me.traits.length > 0 ? (
        <div className="traits">
          <div className="traits-title">Sinergias ativas</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {me.traits.filter(t => t.style > 0).map(t => {
              const tr = dd.traits[t.name]
              const traitName = tr ? tr.name : t.name
              return <span key={t.name} className="trait-chip">
                {traitName} ({t.num_units})
              </span>
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
