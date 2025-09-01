// @ts-nocheck
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.RIOT_API_KEY && !process.env.RIOT_API_KEY) {
    process.env.RIOT_API_KEY = env.RIOT_API_KEY
  }

  return {
    plugins: [
    react(),
    {
      name: 'local-riot-proxy',
      configureServer(server) {
        server.middlewares.use('/api/riot-proxy', async (req, res) => {
          try {
            const errorMessage = (e: unknown) => {
              let msg = 'Internal error'
              if (e && typeof (e as any).message === 'string') {
                msg = (e as any).message
              }
              return msg
            }
            const REGION_HOSTS: Record<string, string> = {
              americas: 'https://americas.api.riotgames.com',
              europe: 'https://europe.api.riotgames.com',
              asia: 'https://asia.api.riotgames.com',
            }
            const PLATFORM_HOSTS: Record<string, string> = {
              br1: 'https://br1.api.riotgames.com',
              na1: 'https://na1.api.riotgames.com',
              euw1: 'https://euw1.api.riotgames.com',
              eun1: 'https://eun1.api.riotgames.com',
              kr: 'https://kr.api.riotgames.com',
              jp1: 'https://jp1.api.riotgames.com',
              la1: 'https://la1.api.riotgames.com',
              la2: 'https://la2.api.riotgames.com',
              oc1: 'https://oc1.api.riotgames.com',
              tr1: 'https://tr1.api.riotgames.com',
              ru: 'https://ru.api.riotgames.com',
              ph2: 'https://ph2.api.riotgames.com',
              sg2: 'https://sg2.api.riotgames.com',
              th2: 'https://th2.api.riotgames.com',
              tw2: 'https://tw2.api.riotgames.com',
              vn2: 'https://vn2.api.riotgames.com',
            }

            const forward = async (url: string) => {
              const r: any = await (globalThis as any).fetch(url, {
                headers: { 'X-Riot-Token': process.env.RIOT_API_KEY || '' },
              })
              const text = await r.text()
              if (!r.ok) {
                throw new Error(text || `Upstream error ${r.status}`)
              }
              return JSON.parse(text)
            }

            const urlObj = new URL(req.url || '', 'http://localhost')
            const params = Object.fromEntries(urlObj.searchParams.entries()) as Record<string, string>
            const route = params.route

            if (!process.env.RIOT_API_KEY) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Missing RIOT_API_KEY environment variable' }))
              return
            }

            if (route === 'account-by-riot-id') {
              const region = params.region
              const gameName = encodeURIComponent(params.gameName)
              const tagLine = encodeURIComponent(params.tagLine)
              const host = REGION_HOSTS[region]
              if (!host) throw new Error('Invalid region')
              const url = `${host}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`
              const data = await forward(url)
              res.statusCode = 200; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); return
            }

            if (route === 'summoner-by-puuid') {
              const platform = params.platform
              const puuid = encodeURIComponent(params.puuid)
              const host = PLATFORM_HOSTS[platform]
              if (!host) {
                throw new Error('Invalid platform')
              }
              const url = `${host}/tft/summoner/v1/summoners/by-puuid/${puuid}`
              const data = await forward(url)
              res.statusCode = 200; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); return
            }

            if (route === 'lol-summoner-by-puuid') {
              const platform = params.platform
              const puuid = encodeURIComponent(params.puuid)
              const host = PLATFORM_HOSTS[platform]
              if (!host) {
                throw new Error('Invalid platform')
              }
              const url = `${host}/lol/summoner/v4/summoners/by-puuid/${puuid}`
              const data = await forward(url)
              res.statusCode = 200; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); return
            }

            if (route === 'league-by-summoner') {
              const platform = params.platform
              const summonerId = encodeURIComponent(params.summonerId)
              const host = PLATFORM_HOSTS[platform]
              if (!host) {
                throw new Error('Invalid platform')
              }
              const url = `${host}/tft/league/v1/entries/by-summoner/${summonerId}`
              const data = await forward(url)
              res.statusCode = 200; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); return
            }

            if (route === 'tft-rated-by-puuid') {
              const platform = params.platform
              const puuid = encodeURIComponent(params.puuid)
              const host = PLATFORM_HOSTS[platform]
              if (!host) {
                throw new Error('Invalid platform')
              }
              const url = `${host}/tft/league/v1/rated/by-puuid/${puuid}`
              const data = await forward(url)
              res.statusCode = 200; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); return
            }

            if (route === 'league-by-puuid') {
              const platform = params.platform
              const puuid = encodeURIComponent(params.puuid)
              const host = PLATFORM_HOSTS[platform]
              if (!host) {
                throw new Error('Invalid platform')
              }
              const url = `${host}/tft/league/v1/by-puuid/${puuid}`
              const data = await forward(url)
              res.statusCode = 200; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); return
            }

            if (route === 'matches-by-puuid') {
              const region = params.region
              const puuid = encodeURIComponent(params.puuid)
              const count = params.count || '5'
              const host = REGION_HOSTS[region]
              if (!host) throw new Error('Invalid region')
              const url = `${host}/tft/match/v1/matches/by-puuid/${puuid}/ids?count=${count}`
              const data = await forward(url)
              res.statusCode = 200; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); return
            }

            if (route === 'match-by-id') {
              const region = params.region
              const id = encodeURIComponent(params.id)
              const host = REGION_HOSTS[region]
              if (!host) throw new Error('Invalid region')
              const url = `${host}/tft/match/v1/matches/${id}`
              const data = await forward(url)
              res.statusCode = 200; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); return
            }

            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Unknown route' }))
          } catch (e: unknown) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            const msg = (function () {
              let m = 'Internal error'
              if (e && typeof (e as any).message === 'string') {
                m = (e as any).message
              }
              return m
            })()
            res.end(JSON.stringify({ error: msg }))
          }
        })
      },
      configurePreviewServer(server) {
        server.middlewares.use('/api/riot-proxy', async (req, res) => {
          try {
            const errorMessage = (e: unknown) => {
              let msg = 'Internal error'
              if (e && typeof (e as any).message === 'string') {
                msg = (e as any).message
              }
              return msg
            }
            const REGION_HOSTS: Record<string, string> = {
              americas: 'https://americas.api.riotgames.com',
              europe: 'https://europe.api.riotgames.com',
              asia: 'https://asia.api.riotgames.com',
            }
            const PLATFORM_HOSTS: Record<string, string> = {
              br1: 'https://br1.api.riotgames.com',
              na1: 'https://na1.api.riotgames.com',
              euw1: 'https://euw1.api.riotgames.com',
              eun1: 'https://eun1.api.riotgames.com',
              kr: 'https://kr.api.riotgames.com',
              jp1: 'https://jp1.api.riotgames.com',
              la1: 'https://la1.api.riotgames.com',
              la2: 'https://la2.api.riotgames.com',
              oc1: 'https://oc1.api.riotgames.com',
              tr1: 'https://tr1.api.riotgames.com',
              ru: 'https://ru.api.riotgames.com',
              ph2: 'https://ph2.api.riotgames.com',
              sg2: 'https://sg2.api.riotgames.com',
              th2: 'https://th2.api.riotgames.com',
              tw2: 'https://tw2.api.riotgames.com',
              vn2: 'https://vn2.api.riotgames.com',
            }

            const forward = async (url: string) => {
              const r: any = await (globalThis as any).fetch(url, {
                headers: { 'X-Riot-Token': process.env.RIOT_API_KEY || '' },
              })
              const text = await r.text()
              if (!r.ok) {
                throw new Error(text || `Upstream error ${r.status}`)
              }
              return JSON.parse(text)
            }

            const urlObj = new URL(req.url || '', 'http://localhost')
            const params = Object.fromEntries(urlObj.searchParams.entries()) as Record<string, string>
            const route = params.route

            if (!process.env.RIOT_API_KEY) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Missing RIOT_API_KEY environment variable' }))
              return
            }

            if (route === 'account-by-riot-id') {
              const region = params.region
              const gameName = encodeURIComponent(params.gameName)
              const tagLine = encodeURIComponent(params.tagLine)
              const host = REGION_HOSTS[region]
              if (!host) throw new Error('Invalid region')
              const url = `${host}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`
              const data = await forward(url)
              res.statusCode = 200; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); return
            }

            if (route === 'summoner-by-puuid') {
              const platform = params.platform
              const puuid = encodeURIComponent(params.puuid)
              const host = PLATFORM_HOSTS[platform]
              if (!host) {
                throw new Error('Invalid platform')
              }
              const url = `${host}/tft/summoner/v1/summoners/by-puuid/${puuid}`
              const data = await forward(url)
              res.statusCode = 200; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); return
            }

            if (route === 'lol-summoner-by-puuid') {
              const platform = params.platform
              const puuid = encodeURIComponent(params.puuid)
              const host = PLATFORM_HOSTS[platform]
              if (!host) {
                throw new Error('Invalid platform')
              }
              const url = `${host}/lol/summoner/v4/summoners/by-puuid/${puuid}`
              const data = await forward(url)
              res.statusCode = 200; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); return
            }

            if (route === 'league-by-summoner') {
              const platform = params.platform
              const summonerId = encodeURIComponent(params.summonerId)
              const host = PLATFORM_HOSTS[platform]
              if (!host) {
                throw new Error('Invalid platform')
              }
              const url = `${host}/tft/league/v1/entries/by-summoner/${summonerId}`
              const data = await forward(url)
              res.statusCode = 200; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); return
            }

            if (route === 'tft-rated-by-puuid') {
              const platform = params.platform
              const puuid = encodeURIComponent(params.puuid)
              const host = PLATFORM_HOSTS[platform]
              if (!host) {
                throw new Error('Invalid platform')
              }
              const url = `${host}/tft/league/v1/rated/by-puuid/${puuid}`
              const data = await forward(url)
              res.statusCode = 200; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); return
            }

            if (route === 'league-by-puuid') {
              const platform = params.platform
              const puuid = encodeURIComponent(params.puuid)
              const host = PLATFORM_HOSTS[platform]
              if (!host) {
                throw new Error('Invalid platform')
              }
              const url = `${host}/tft/league/v1/by-puuid/${puuid}`
              const data = await forward(url)
              res.statusCode = 200; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); return
            }

            if (route === 'matches-by-puuid') {
              const region = params.region
              const puuid = encodeURIComponent(params.puuid)
              const count = params.count || '5'
              const host = REGION_HOSTS[region]
              if (!host) throw new Error('Invalid region')
              const url = `${host}/tft/match/v1/matches/by-puuid/${puuid}/ids?count=${count}`
              const data = await forward(url)
              res.statusCode = 200; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); return
            }

            if (route === 'match-by-id') {
              const region = params.region
              const id = encodeURIComponent(params.id)
              const host = REGION_HOSTS[region]
              if (!host) throw new Error('Invalid region')
              const url = `${host}/tft/match/v1/matches/${id}`
              const data = await forward(url)
              res.statusCode = 200; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); return
            }

            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Unknown route' }))
          } catch (e: unknown) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            let msg = 'Internal error'
            if (e && typeof (e as any).message === 'string') {
              msg = (e as any).message
            }
            res.end(JSON.stringify({ error: msg }))
          }
        })
      },
    },
  ],
  server: { port: 5173 },
  preview: { port: 5173 }
  }
})
