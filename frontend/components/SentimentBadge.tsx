type Sentiment = 'Positive' | 'Neutral' | 'Negative' | undefined;

const config: Record<string, { label: string; classes: string }> = {
  Positive: {
    label: 'Positive',
    classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  Neutral: {
    label: 'Neutral',
    classes: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  },
  Negative: {
    label: 'Negative',
    classes: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
};

export default function SentimentBadge({ sentiment }: { sentiment?: Sentiment }) {
  if (!sentiment) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border bg-zinc-800/60 text-zinc-600 border-zinc-700/40">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-pulse" />
        Analysing
      </span>
    );
  }

  const { label, classes } = config[sentiment] ?? config.Neutral;

  const dot: Record<string, string> = {
    Positive: 'bg-emerald-400',
    Neutral:  'bg-zinc-400',
    Negative: 'bg-red-400',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border ${classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[sentiment]}`} />
      {label}
    </span>
  );
}