export type ParticipantDto = {
  puuid: string
  placement: number
  level: number
  traits: Array<{ name: string; num_units: number; style: number; tier_current?: number; tier_total?: number }>
  units: Array<{
    character_id: string
    itemNames?: string[]
    items?: number[]
    tier: number
  }>
}

export type InfoDto = {
  game_datetime: number
  game_length: number
  game_version: string
  queue_id: number
  participants: ParticipantDto[]
  tft_set_number?: number
}

export type MetadataDto = {
  data_version: string
  match_id: string
  participants: string[]
}

export type MatchDto = { metadata: MetadataDto; info: InfoDto }

export type TftLeagueEntry = {
  queueType: string
  tier?: string
  rank?: string
  leaguePoints?: number
  ratedTier?: string
  ratedRating?: number
  wins?: number
  losses?: number
}
