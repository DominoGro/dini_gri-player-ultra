# Jak zbudować aplikację na Linux (.AppImage)

Na Linuxie jest to PROSTE — żadnych problemów z uprawnieniami jak na Windows.
Twój komputer ma normalny internet, więc Electron pobierze się bez problemu.

## Krok 1 — wejdź do folderu projektu w terminalu

Otwórz terminal i przejdź do folderu (podmień ścieżkę na swoją):

```bash
cd ~/Pulpit/dini-gri-player
```

(albo `cd ~/Desktop/dini-gri-player` — zależnie jak masz nazwany pulpit)

## Krok 2 — zainstaluj zależności (raz)

```bash
npm install
```

Pobierze Electron (~chwilę to trwa). Ostrzeżenia `npm warn deprecated` są normalne,
to NIE są błędy — zignoruj je.

## Krok 3 — sprawdź czy działa (opcjonalnie)

Zanim zbudujesz, możesz odpalić od razu:

```bash
npm start
```

Aplikacja otworzy się w oknie. Zamknij ją i przejdź dalej.

## Krok 4 — zbuduj AppImage

```bash
npm run dist:linux
```

Poczekaj — pierwszy raz pobiera dodatkowe narzędzia. Po skończeniu w folderze
`dist/` znajdziesz:

- **`DINI GRI PLAYER-1.0.0.AppImage`** — to jest twoja aplikacja, jeden plik
- **`.deb`** — gdybyś wolał zainstalować systemowo (Debian/Ubuntu/Mint)

## Krok 5 — uruchom AppImage

AppImage trzeba raz oznaczyć jako wykonywalny:

```bash
cd dist
chmod +x "DINI GRI PLAYER-1.0.0.AppImage"
./"DINI GRI PLAYER-1.0.0.AppImage"
```

Albo graficznie: kliknij plik prawym → Właściwości → Uprawnienia →
zaznacz „Zezwól na wykonywanie jako program", potem dwuklik.

Ten plik możesz **przenosić gdziekolwiek** i odpalać dwuklikiem — to samodzielna
aplikacja, nie potrzebuje Node.js ani niczego.

---

## Gdyby AppImage nie startował

Niektóre nowsze systemy potrzebują biblioteki FUSE:

```bash
sudo apt install libfuse2
```

(na Fedorze: `sudo dnf install fuse-libs`)

Potem spróbuj odpalić AppImage ponownie.

---

## Instalacja .deb (alternatywa)

Jeśli wolisz mieć aplikację w menu jak normalny program:

```bash
cd dist
sudo dpkg -i dini-gri-player_1.0.0_amd64.deb
```

Potem znajdziesz „DINI GRI PLAYER" w menu aplikacji.
