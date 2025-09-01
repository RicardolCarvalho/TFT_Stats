export type TftChampion = { id: string; name: string; tier: number; image: { full: string } }
export type TftItem = { id: string; name: string; image: { full: string } }
export type TftTrait = { id: string; name: string; image?: { full: string } }

export type TftDatabases = {
  version: string
  champions: Record<string, TftChampion> // key by apiName/id e.g., "TFT9_Irelia"
  items: Record<string, TftItem>
  traits: Record<string, TftTrait>
}

export async function getLatestDDragon(): Promise<string> {
  const res = await fetch('https://ddragon.leagueoflegends.com/api/versions.json')
  const versions: string[] = await res.json()
  return versions[0]
}

export async function loadTftData(version: string, locale: string): Promise<TftDatabases> {
  const base = `https://ddragon.leagueoflegends.com/cdn/${version}/data/${locale}`
  const [champJson, itemJson, traitJson] = await Promise.all([
    fetch(`${base}/tft-champion.json`).then(r => r.json()),
    fetch(`${base}/tft-item.json`).then(r => r.json()),
    fetch(`${base}/tft-trait.json`).then(r => r.json()),
  ])

  // champJson.data is an object keyed by apiName (e.g., TFT9_Irelia)
  const champions = champJson.data as Record<string, TftChampion>
  const items = itemJson.data as Record<string, TftItem>
  const traits = traitJson.data as Record<string, TftTrait>

  return { version, champions, items, traits }
}
