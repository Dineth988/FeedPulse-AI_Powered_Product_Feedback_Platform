import FeedbackForm from "../../components/FeedbackForm";

export const metadata = {
  title: 'Submit Feedback — FeedPulse',
  description: 'Share your product feedback, feature requests, or bug reports with our team.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px),
                            linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Amber glow top */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-start px-4 py-16">

        {/* Logo / Brand */}
        <div className="flex items-center gap-2.5 mb-12">
          <div className="w-12 h-12 rounded-[10px] bg-amber-800 flex items-center justify-center">
            <img src="https://img.icons8.com/?size=100&id=vjbhDe9kblMm&format=png&color=000000" className="w-8 h-8" alt="" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">FeedPulse</span>
        </div>

        {/* Card */}
        <div className="w-full max-w-lg">
          <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800/60 backdrop-blur-sm shadow-2xl shadow-black/40 overflow-hidden">

            {/* Card header */}
            <div className="px-8 pt-8 pb-6 border-b border-zinc-800/60">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                  Public
                </span>
                <span className="text-xs text-zinc-600">No sign-in required</span>
              </div>
              <h1 className="text-xl font-semibold text-white mt-3">Share your feedback</h1>
              <p className="text-sm text-zinc-400 mt-1">
                Found a bug? Have a feature idea? We read every submission — our AI analyses and prioritises them for the team.
              </p>
            </div>

            {/* Form */}
            <div className="px-8 py-7">
              <FeedbackForm />
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-zinc-700 mt-6">
            Powered by FeedPulse · AI analysis by Gemini
          </p>
        </div>
      </div>
    </main>
  );
}