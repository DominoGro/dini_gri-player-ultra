# Jak zbudować plik .exe (Windows)

Ten czerwony błąd, który widziałeś (`Cannot create symbolic link : Klient nie ma
wymaganych uprawnień`), bierze się z podpisywania kodu, które wymaga uprawnień.
Poprawiłem konfigurację, żeby tego nie robić. Teraz zrób tak:

## Krok 1 — włącz Tryb programisty w Windows (raz)

To pozwala tworzyć symlinki bez admina i usuwa źródło błędu:

1. Naciśnij **Win + I** (Ustawienia)
2. Wejdź w **Prywatność i zabezpieczenia → Dla deweloperów**
   (lub wyszukaj „Tryb programisty" / „Developer Mode" w wyszukiwarce ustawień)
3. Włącz **Tryb programisty**
4. Zrestartuj komputer

## Krok 2 — wyczyść stary, uszkodzony cache

Stary błąd zostawił popsute pliki. Usuń je:

1. Otwórz **Eksplorator plików**
2. W pasku adresu wklej:
   ```
   %LocalAppData%\electron-builder\Cache
   ```
3. Usuń **cały folder Cache** (zostanie pobrany na nowo, czysty)

## Krok 3 — zbuduj .exe

1. Otwórz folder `dini-gri-player`
2. Kliknij pasek adresu, wpisz `cmd`, Enter
3. Jeśli nie masz jeszcze `node_modules` (czyli świeży projekt):
   ```
   npm install
   ```
4. Zbuduj:
   ```
   npm run dist:win
   ```

Poczekaj — pierwszy raz pobiera dodatkowe pliki, może potrwać.

## Krok 4 — gotowe pliki

W folderze `dini-gri-player\dist` znajdziesz:

- **`DINI GRI PLAYER Setup 1.0.0.exe`** — instalator. Klikasz, instaluje się jak
  normalny program, pojawia się w menu Start.
- **`DINI GRI PLAYER 1.0.0.exe`** (portable, w podfolderze) — pojedynczy plik,
  odpalasz bez instalacji, możesz nosić na pendrive.

Ten plik `.exe` działa **bez Node.js i bez żadnych komend** — to już samodzielny program.

---

## Gdyby DALEJ był błąd

Jeśli mimo Trybu programisty build się sypie na tym samym, spróbuj uruchomić terminal
**jako administrator**:

1. Wyszukaj „cmd" w menu Start
2. Kliknij prawym → **Uruchom jako administrator**
3. Przejdź do folderu projektu komendą (podmień ścieżkę na swoją):
   ```
   cd C:\Users\domin\Desktop\dini-gri-player
   ```
4. `npm run dist:win`

To na pewno przejdzie.

---

## Nie chcesz się męczyć z .exe?

Pamiętaj, że aplikacja **już działa** przez `npm start`. Możesz jej tak używać na co dzień —
plik .exe jest wygodniejszy (dwuklik, menu Start), ale nie jest konieczny do działania.
