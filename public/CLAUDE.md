# Re:Liked — dokumentacja makiety dla Claude

## Cel
Prosty interfejs TypeScript dla projektu `spotify-playlist-import` opisanego w dostarczonym README. Użytkownik zmienia konto Spotify, eksportuje polubione utwory do CSV przez Exportify, a następnie dodaje je do polubionych na nowym koncie. Makieta nie wykonuje rzeczywistych operacji i nie wymaga żadnych kluczy.

## Co jest gotowe
- Jeden ekran po polsku: wybór/przeciągnięcie CSV → konto docelowe → import.
- Walidacja rozszerzenia CSV (bez czytania zawartości).
- Podgląd sześciu przykładowych utworów, niezależny od wybranego pliku.
- Przycisk „Połącz” jedynie przełącza stan demonstracyjny; nie jest OAuth.
- Symulacja postępu, podsumowanie i reset.
- Obsługa mniejszych ekranów, klawiatury i ograniczenia animacji.
- Link do Exportify oraz pobrania tej dokumentacji.

## Uruchomienie
Projekt wymaga Bun i środowiska JavaScript zgodnego z użytym szablonem.
```sh
bun install
bun run dev
bun run test
```
Nie jest to aplikacja Python. Nie zastępuje skryptu z oryginalnego README.

## Pliki
- `src/routes/index.tsx` — ekran, przykładowe utwory i stan makiety.
- `src/styles.css` — semantyczne kolory OKLCH, typografia DM Sans, układ i stany.
- `src/components/ui/button.tsx` — wspólny przycisk.
- `src/routes/__root.tsx` — dokument HTML, style i font.
- `public/CLAUDE.md` — ta dokumentacja.

Stos: React 19, TypeScript, TanStack Start/Router, Tailwind CSS v4, Lucide. Nie zastępuj routera React Routerem i nie edytuj wygenerowanego `src/routeTree.gen.ts`.

## Stany i zachowanie
1. Początek: brak pliku, połączenie i import niedostępne.
2. Wybór CSV: nazwa pliku, przycisk „Zmień plik”, możliwe połączenie demonstracyjne.
3. Połączenie: pojawia się konto przykładowe, import jest dostępny.
4. Import: postęp rośnie co 500 ms o 20%; przyciski blokowane na czas symulacji.
5. Sukces: 6/6 przykładowych utworów, przycisk rozpoczynający od nowa.
6. Nieprawidłowy format: komunikat błędu, poprzedni wybór pozostaje.
Plik ani konto nie są zapisywane. Odświeżenie zeruje stan.

## Dalsza implementacja — NIE jest częścią makiety
Claude powinien połączyć UI z oryginalnym skryptem dopiero w osobnym zadaniu:
- Odczytaj oryginalny CSV Exportify i ustal faktyczne kolumny; użyj sprawdzonego parsera, nie split(',').
- W Pythonie użyj `spotipy`, `pandas`, `python-dotenv` zgodnie z oryginalnym README.
- Konfiguracja lokalnego skryptu: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REDIRECT_URI=http://127.0.0.1:8888/callback`, `CSV_FILE=Liked_Songs.csv`.
- Client Secret i tokeny muszą pozostać po stronie serwera/lokalnego procesu; nigdy w przeglądarce, repozytorium ani VITE_*.
- `.env` i `.cache` muszą być ignorowane przez Git.
- Obecny lokalny callback dotyczy skryptu Python, nie hostowanej strony. Osobno zaprojektuj komunikację UI–proces lokalny lub docelową autoryzację webową.
- Sprawdź aktualne wymagania Spotify, zakres uprawnień do biblioteki, limity, retry i obsługę częściowych niepowodzeń.
- Przed importem pokaż tożsamość rzeczywistego konta docelowego. Nie usuwaj utworów ze starego konta.
- Zastąp dane przykładowe prawdziwym podglądem i licznikami. Nie obiecuj sukcesu, dopóki API go nie potwierdzi.

## Instrukcja do wklejenia w Claude
„Otwórz dokumentację CLAUDE.md oraz źródła makiety Re:Liked. Zachowaj minimalistyczny wygląd i polskie etykiety. Na podstawie oryginalnego README projektu spotify-playlist-import zaproponuj bezpieczne połączenie UI z lokalnym skryptem Python. Nie umieszczaj Client Secret ani tokenów w kodzie klienta. Zastąp symulację prawdziwym podglądem CSV, autoryzacją, postępem i raportem częściowych błędów. Najpierw uzgodnij sposób uruchamiania UI wraz z procesem Python.”

## Zakres kosztów
Brak nowych pakietów, generowania obrazów, AI, bazy danych i usług płatnych. Dzienny limit Lovable zależy od konta — ta makieta ogranicza zużycie, ale nie daje gwarancji pozostania w limicie.
