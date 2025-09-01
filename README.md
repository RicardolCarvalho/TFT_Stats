# TFT Stats

## Como rodar

1. **Instale dependências**  
   ```bash
   npm intall
   npm run dev
   ```

2. **Chave da Riot** — Crie um app em <https://developer.riotgames.com/> e pegue sua *Development API Key* (expira a cada 24h). Crie **.env** no painel da Vercel (ou localmente ao usar um proxy) com:
   ```
   RIOT_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Buscar por Riot ID** no formato `Nome#TAG` (ex: `Rafak#BR1`). Selecione a **região** (BR1 por padrão).
