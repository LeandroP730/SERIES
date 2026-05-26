export function parseEpisode(code: string) {
  const match = code.match(/S(\d+)E(\d+)/);

  return {
    season: match?.[1] ?? '',
    episode: match?.[2] ?? '',
  };
}