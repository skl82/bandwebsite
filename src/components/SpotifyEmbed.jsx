export default function SpotifyEmbed({ uri = 'artist/placeholder', height = 352 }) {
  // Replace the default URI with the actual Spotify artist/album/track URI
  // Format: artist/ARTIST_ID, album/ALBUM_ID, or track/TRACK_ID
  return (
    <iframe
      src={`https://open.spotify.com/embed/${uri}?theme=0`}
      width="100%"
      height={height}
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className="rounded-lg"
    />
  )
}
