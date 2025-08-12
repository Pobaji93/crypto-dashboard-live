# Manual Testing Checklist

- `npm run dev` starten und Anwendung im Browser öffnen.
- Eine Coin-Seite mit PriceChart aufrufen.
- Schnell zwischen verschiedenen Zeiträumen (1T, 1W, 1M, …) wechseln und sicherstellen, dass kein "Load failed" erscheint.
- Im Browser-Netzwerk-Tab prüfen, dass maximal drei Anfragen pro Sekunde an CoinGecko gesendet werden und keine 429-Fehler auftreten.
- Für "YTD" und "MAX" einmal laden, Seite neu laden und überprüfen, dass die Daten aus dem lokalen Cache (localStorage) geladen werden.
