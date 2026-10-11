import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowRight, ArrowUpRight, Check, CheckCircle2, Clock3, FileText, FileUp, Heart, Link2, LockKeyhole, Music2, ShieldCheck, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Re:Liked — importer polubionych utworów' },
    { name: 'description', content: 'Minimalistyczna makieta przenoszenia polubionych utworów między kontami Spotify.' },
    { property: 'og:title', content: 'Re:Liked — Twoja muzyka, nowe konto' },
    { property: 'og:description', content: 'Makieta importera Spotify: plik CSV, konto docelowe i podgląd importu.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Importer,
});

const tracks = [
  { title: 'Tame Impala', artist: 'The Less I Know The Better', time: '3:36', cover: 'rose' },
  { title: 'Daft Punk', artist: 'Instant Crush · feat. Julian Casablancas', time: '5:37', cover: 'blue' },
  { title: 'Mac Miller', artist: 'Good News', time: '5:42', cover: 'yellow' },
  { title: 'The xx', artist: 'Intro', time: '2:07', cover: 'gray' },
  { title: 'Frank Ocean', artist: 'Pink + White', time: '3:04', cover: 'green' },
  { title: 'Arctic Monkeys', artist: 'I Wanna Be Yours', time: '3:03', cover: 'red' },
];

function SpotifyIcon() {
  return <svg className="spotify-icon" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-label="Spotify"><circle cx="12" cy="12" r="12" /><g fill="none" stroke="var(--card)" strokeLinecap="round"><path d="M5 9c5-2 10-1 14 1" strokeWidth="1.8"/><path d="M6 12c4-1.6 8-1 12 1" strokeWidth="1.5"/><path d="M7 15c3-1 7-.6 10 1" strokeWidth="1.3"/></g></svg>;
}

function Importer() {
  const input = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState('');
  const [connected, setConnected] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const running = progress !== null && progress < 100;
  const done = progress === 100;
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setProgress(p => p === null ? null : Math.min(p + 20, 100)), 500);
    return () => window.clearInterval(timer);
  }, [running]);
  const choose = (file?: File) => {
    if (!file || running) return;
    if (!file.name.toLowerCase().endsWith('.csv')) { setError('Wybierz plik w formacie CSV.'); return; }
    setError(''); setFilename(file.name); setProgress(null);
  };
  const reset = () => { setFilename(''); setConnected(false); setProgress(null); setError(''); if (input.current) input.current.value = ''; };
  const step = done || running ? 2 : filename ? 1 : 0;
  return <>
    <header className="app-header">
      <div className="wordmark"><span className="brand-icon"><Music2 size={18}/></span>re:liked<span className="demo-badge">DEMO</span></div>
      <nav className="header-actions" aria-label="Materiały"><a href="/CLAUDE.md" download><FileText size={15}/>Dokumentacja<ArrowDownToLine size={13}/></a><a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" style={{display:'none'}}>GitHub</a></nav>
    </header>
    <main className="workspace">
      <section className="intro">
        <div className="eyebrow">Spotify playlist import</div>
        <h1>Nowe konto. Ta sama muzyka.</h1>
        <p>Przenieś polubione utwory i zabierz swoją kolekcję ze sobą.</p>
        <div className="intro-mark" aria-hidden="true"><div className="small-disc"><Heart size={13}/></div><ArrowRight size={18}/><div className="small-disc"><Music2 size={13}/></div></div>
      </section>
      <div className="steps" aria-label="Etapy importu">
        {['Wgraj plik CSV', 'Połącz konto', 'Importuj utwory'].map((label, i) => <div key={label} className="contents">{i > 0 && <div className="step-line"/>}<div className={`step ${i === step ? 'active' : ''} ${i < step || done ? 'complete' : ''}`} aria-current={i === step ? 'step' : undefined}><span className="step-circle">{i < step || done ? <Check size={12}/> : i+1}</span>{label}</div></div>)}
      </div>
      <div className="main-grid">
        <div>
          <section>
            <h2 className="section-title"><span className="section-number">01</span> Twoja kolekcja</h2>
            <div className={`dropzone ${dragging ? 'dragging' : ''}`} onDragOver={e => {e.preventDefault(); if (!running) setDragging(true);}} onDragLeave={() => setDragging(false)} onDrop={e => {e.preventDefault(); setDragging(false); choose(e.dataTransfer.files[0]);}}>
              <span className="upload-symbol">{filename ? <FileText size={21}/> : <Upload size={21}/>}</span>
              <strong className="max-w-full break-all px-4 text-center">{filename || 'Przeciągnij tutaj plik CSV'}</strong>
              <p>{filename ? 'Plik wybrany · podgląd zawiera dane przykładowe' : 'Eksport polubionych utworów z Exportify'}</p>
              <Button variant="outline" className="file-choice" disabled={running} onClick={() => input.current?.click()}><FileUp size={14}/>{filename ? 'Zmień plik' : 'Wybierz plik'}</Button>
              <input ref={input} type="file" accept=".csv" className="hidden" aria-label="Plik CSV" onChange={e => choose(e.target.files?.[0])}/>
            </div>
            {error && <p className="error-message" role="alert">{error}</p>}
            <div className="help-link"><span>Nie masz jeszcze pliku?</span><a href="https://exportify.net/" target="_blank" rel="noreferrer">Otwórz Exportify <ArrowUpRight size={12}/></a></div>
          </section>
          <section className="connection-section">
            <h2 className="section-title"><span className="section-number">02</span> Konto docelowe</h2>
            <div className="account-row"><SpotifyIcon/><div className="account-copy"><strong>{connected ? 'Konto przykładowe' : 'Twoje nowe konto Spotify'}</strong><p>{connected ? 'Połączono w trybie demonstracyjnym' : 'Tutaj trafią Twoje polubione utwory'}</p></div><Button variant="outline" disabled={!filename || running} onClick={() => {setConnected(c => !c); setProgress(null);}}>{connected ? <><X size={12}/>Odłącz</> : <><Link2 size={12}/>Połącz</>}</Button></div>
          </section>
          {done ? <><div className="success-message" role="status"><CheckCircle2 size={18}/>Symulacja zakończona. Dodano 6 z 6 utworów.</div><Button className="import-action" variant="outline" onClick={reset}>Rozpocznij od nowa<ArrowRight/></Button></> : <Button className="import-action" disabled={!filename || !connected || running} onClick={() => setProgress(0)}>{running ? 'Importowanie…' : 'Importuj polubione utwory'}<ArrowRight size={16}/></Button>}
          {running && <><div className="progress-track" role="progressbar" aria-valuenow={progress ?? 0} aria-valuemin={0} aria-valuemax={100} aria-label="Postęp symulacji"><div className="progress-bar" style={{width: `${progress ?? 0}%`}}/></div><p className="import-status" role="status">Symulacja importu · {progress}%</p></>}
          <p className="safety"><LockKeyhole size={11}/>Tryb demo · bez zmian na koncie Spotify</p>
        </div>
        <aside className="library" aria-label="Przykładowe utwory">
          <div className="library-header"><div className="library-heading"><h2>Polubione utwory</h2><span className="sample-label">Przykład</span></div><div className="library-meta"><Heart size={12}/>6 utworów<span>·</span>23 min</div></div>
          <div className="track-head"><span>UTWÓR / WYKONAWCA</span><Clock3 size={12}/></div>
          <div className="track-list">{tracks.map(track => <div className="track" key={track.title}><div className={`album album-${track.cover}`} aria-hidden="true"/><div className="track-info"><strong>{track.artist.split(' · ')[0]}</strong><span>{track.title}</span></div><span className="track-time">{track.time}</span></div>)}</div>
          <div className="library-footer"><ShieldCheck size={13}/>Twoja muzyka zostaje na starym koncie.</div>
        </aside>
      </div>
      <footer className="footer"><span>re:liked <span> / </span> Muzyka idzie z Tobą.</span><span>Makieta interfejsu · bez połączenia ze Spotify<ArrowUpRight size={11}/></span></footer>
    </main>
  </>;
}
