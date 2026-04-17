export const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="font-mono text-xs uppercase tracking-[0.25em]">Sasha Deejay © {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6 font-mono text-xs uppercase tracking-widest">
          <a href="https://open.spotify.com/artist/2ZKG94In3z6Y55NjlWy6c6" target="_blank" rel="noreferrer" className="hover:text-foreground">Spotify</a>
          <a href="https://music.apple.com/gb/artist/sasha-deejay/1873458370" target="_blank" rel="noreferrer" className="hover:text-foreground">Apple</a>
          <a href="https://youtube.com/@sasha-deejay" target="_blank" rel="noreferrer" className="hover:text-foreground">YouTube</a>
        </div>
      </div>
    </footer>
  );
};
