# DINI GRI PLAYER — wersja desktopowa (Electron)

Odtwarzacz muzyki z biblioteką, playlistami, EQ, crossfade i **pełnym dostępem do dysku**:
zapamiętuje folder z muzyką i sam go wczytuje przy starcie, wykrywa podłączony pendrive.

---

## 1. Co musisz mieć

- **Node.js** (wersja 18 lub nowsza). Sprawdź: `node -v`
  - Linux (Debian/Ubuntu): `sudo apt install nodejs npm`
  - Albo pobierz z https://nodejs.org

---

## 2. Pierwsze uruchomienie (development)

W terminalu, w folderze projektu:

```bash
npm install        # pobiera Electron (raz, ~chwilę to trwa)
npm start          # uruchamia aplikację
```

Aplikacja otworzy się w oknie. Działa od razu — kliknij „Wczytaj folder", wskaż folder z muzyką.
Od tej chwili przy każdym kolejnym uruchomieniu **sam go wczyta**.

Podłącz pendrive → na dole pojawi się pasek „Wykryto nośnik — wczytać muzykę?".

---

## 3. Zbudowanie aplikacji do zainstalowania

### Linux (AppImage — klikasz i działa, bez instalacji):

```bash
npm run dist:linux
```

Gotowe pliki znajdziesz w folderze `dist/`:
- `DINI GRI PLAYER-1.0.0.AppImage` — przenośny, uruchamiasz dwuklikiem
  (jeśli nie startuje: `chmod +x "DINI GRI PLAYER-1.0.0.AppImage"` i odpal)
- `.deb` — instalator dla Debian/Ubuntu: `sudo dpkg -i nazwa.deb`

### Windows (.exe):

**Najprościej zbudować na Windowsie.** Skopiuj projekt na komputer z Windows, zainstaluj
Node.js, i w folderze projektu:

```bash
npm install
npm run dist:win
```

W `dist/` pojawi się:
- instalator `.exe` (NSIS) — normalna instalacja
- wersja `portable` — pojedynczy `.exe`, działa bez instalacji

> Budowanie .exe z poziomu Linuxa jest możliwe (electron-builder z Wine), ale bywa kapryśne.
> Jeśli masz dostęp do Windowsa, zbuduj tam — to najpewniejsza droga.

---

## 4. Struktura projektu

```
dini-gri-player/
├── package.json     # zależności i komendy budowania
├── main.js          # proces główny: okno, skan folderów, wykrywanie USB
├── preload.js       # bezpieczny most do systemu plików
├── build/
│   └── icon.png     # ikona aplikacji
└── src/
    └── index.html   # cały odtwarzacz (interfejs + logika)
```

---

## 5. Czym różni się od wersji przeglądarkowej

| Funkcja | Przeglądarka | Aplikacja |
|---|---|---|
| Wczytywanie plików | trzeba wskazywać za każdym razem | **zapamiętany folder, auto-wczytanie** |
| Pendrive | brak | **automatyczne wykrycie i propozycja** |
| Dostęp do dysku | ograniczony | **pełny** |
| Pliki w pamięci | całe w RAM | czytane ze ścieżki na żądanie |

Cała reszta (EQ, wokal, tempo, crossfade equal-power, wyrównanie głośności, pomijanie ciszy,
okładki, tagi, playlisty z przeciąganiem, import/eksport) działa tak samo.

---

## 6. Najczęstsze problemy

- **`npm install` rzuca błędy** → upewnij się, że masz Node 18+ (`node -v`).
- **AppImage nie startuje** → `chmod +x plik.AppImage`, czasem trzeba `sudo apt install libfuse2`.
- **Aplikacja nie widzi pendrive'a** → sprawdź, czy jest zamontowany (zwykle `/media/twój-login/...`).
  Możesz też ręcznie kliknąć „Wczytaj folder" i wskazać go.
- **Muzyka nie gra** → to musi być prawdziwy plik audio na dysku (mp3/flac/wav/m4a/ogg).
