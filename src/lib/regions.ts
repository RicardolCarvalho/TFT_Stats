export type Platform =
  | 'br1' | 'na1' | 'euw1' | 'eun1' | 'kr' | 'jp1' | 'la1' | 'la2' | 'oc1' | 'tr1' | 'ru' | 'ph2' | 'sg2' | 'th2' | 'tw2' | 'vn2'

export type Region = 'americas' | 'europe' | 'asia'

const PLATFORM_TO_REGION: Record<Platform, Region> = {
  br1: 'americas',
  la1: 'americas',
  la2: 'americas',
  na1: 'americas',
  oc1: 'americas',
  ru: 'europe',
  tr1: 'europe',
  eun1: 'europe',
  euw1: 'europe',
  jp1: 'asia',
  kr: 'asia',
  ph2: 'asia',
  sg2: 'asia',
  th2: 'asia',
  tw2: 'asia',
  vn2: 'asia',
}

export function platformToRegion(p: Platform): Region {
  return PLATFORM_TO_REGION[p]
}
