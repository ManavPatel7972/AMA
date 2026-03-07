"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Sparkles, Image as ImageIcon, Smile, Shield, Copy } from "lucide-react";

export default function PublicMessagePage() {
  const { username } = useParams();

  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [conversationLink, setConversationLink] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<string[]>([
    "My crush is...", "I regret...", "Today I felt...", "Hot take:"
  ]);

  //! send message
  const sendMessage = async (e: any) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    try {
      setSending(true);

      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, content }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.error);
        return;
      }

      toast.success("Anonymous message sent");
      setContent("");

      if (data.conversationId && data.senderToken) {
        localStorage.setItem(`senderToken_${data.conversationId}`, data.senderToken);
        setConversationLink(`${window.location.origin}/conversation/${data.conversationId}`);
      }

    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  //! Ai suggestion messages
  const generateSuggestions = async () => {
    try {
      setAiLoading(true);
      const res = await fetch("/api/ai-suggestions");
      const data = await res.json();

      if (!data.success) {
        toast.error("AI failed to generate suggestions");
        return;
      }

      setSuggestions(data.suggestions);
    } catch (error) {
      toast.error("AI suggestion failed");
    } finally {
      setAiLoading(false);
    }
  };

  // Preset quick fill
  const handlePresetClick = (preset: string) => {
    setContent((prev) => prev ? `${prev} ${preset}` : preset);
  };

  return (
    <main className="min-h-screen bg-[#120E17] text-white flex flex-col items-center selection:bg-[#E961FF]/30 selection:text-[#E961FF] relative overflow-hidden font-sans">

      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#B642F5]/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#E961FF]/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none delay-1000" />

      {/* Header Logo */}
      <nav className="w-full max-w-5xl mx-auto px-6 py-8 flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B642F5] to-[#E961FF] flex items-center justify-center shadow-lg shadow-[#B642F5]/20">
          <Shield size={20} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Secretly</h1>
      </nav>

      <div className="w-full max-w-2xl relative z-10 flex flex-col items-center mt-6">

        {/* Header Titles */}
        <div className="text-center mb-10 w-full px-4">
          <h1 className="text-7xl font-black tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-br from-[#B642F5] to-[#FF90D0] drop-shadow-sm pb-1">
            Send a Secret
          </h1>
          <p className="text-white/60 font-semibold text-lg">
            Your identity is hidden. Your voice is heard.
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full border border-white/5 bg-[#1C1625]/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl relative">

          <form onSubmit={sendMessage} className="flex flex-col">

            <label className="text-[11px] font-black uppercase tracking-widest text-[#B642F5] mb-3">
              Message Body
            </label>

            <div className="relative mb-6 group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#B642F5] to-[#E961FF] rounded-2xl opacity-10 group-focus-within:opacity-20 transition-opacity blur-sm"></div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? No one will know it was you..."
                rows={5}
                className="w-full relative z-10 bg-[#120E17]/50 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-[15px] font-medium text-white outline-none focus:border-[#E961FF]/50 transition-all placeholder:text-white/30 resize-y shadow-inner"
              />
            </div>

            {/* Prompt Pills */}
            <div className="mb-8">
              <label className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-3 flex items-center gap-2">
                Struggling? Try these
                {aiLoading && <Loader2 size={12} className="animate-spin text-white/50" />}
              </label>

              <div className="flex flex-wrap gap-2">
                {suggestions.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className="px-4 py-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Sparkles size={12} className="text-[#E961FF]" />
                    {preset}
                  </button>
                ))}

                {/* Generate more triggers the AI */}
                <button
                  type="button"
                  onClick={generateSuggestions}
                  className="px-3 py-2 rounded-full text-xs font-bold text-white/40 hover:text-white transition-all cursor-pointer"
                >
                  Get more
                </button>
              </div>
            </div>

            {/* Footer Form Controls */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-4 text-white/30">
                <button type="button" className="hover:text-white transition-colors"><ImageIcon size={20} /></button>
                <button type="button" className="hover:text-white transition-colors"><Smile size={20} /></button>
              </div>

              <button
                disabled={sending}
                className="bg-gradient-to-r from-[#B642F5] to-[#E961FF] text-white px-8 py-4 rounded-2xl text-[15px] font-black tracking-wide transition-all duration-300 hover:shadow-[0_0_30px_rgba(233,97,255,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer"
              >
                {sending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>Post Secretly <span className="text-xl leading-none">→</span></>
                )}
              </button>
            </div>
          </form>

          {/* Conversation Link Success overlay/section */}
          {conversationLink && (
            <div className="absolute inset-0 bg-[#1C1625]/95 backdrop-blur-xl rounded-[2rem] p-8 flex flex-col items-center justify-center text-center z-30 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#B642F5] to-[#E961FF] flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(233,97,255,0.4)]">
                <Shield size={32} className="text-white" />
              </div>

              <h3 className="text-3xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-br from-[#B642F5] to-[#FF90D0]">
                Message Sent!
              </h3>

              <p className="text-white/60 font-medium mb-8 max-w-md">
                Keep this secure link to check if <span className="font-bold text-white">@{username}</span> replies. This is the only way to view the reply.
              </p>

              <div className="w-full flex flex-col gap-3">
                <div className="relative">
                  <input
                    readOnly
                    value={conversationLink}
                    className="w-full bg-[#120E17] border border-white/10 rounded-xl px-4 py-4 pr-12 text-sm text-[#E961FF] font-mono outline-none shadow-inner"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigator.clipboard.writeText(conversationLink);
                      toast.success("Link copied!");
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    <Copy size={18} />
                  </button>
                </div>

                <button
                  onClick={() => setConversationLink(null)}
                  className="w-full px-6 py-4 rounded-xl border border-white/5 bg-white/5 text-sm font-bold mt-2 hover:bg-white/10 transition-colors cursor-pointer active:scale-95"
                >
                  Send another message
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Info Stats Footer */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-12 text-center border-t border-white/5 pt-10 w-full mb-12">
          <div>
            <p className="text-3xl font-black">1.2M+</p>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#B642F5] mt-1">Secrets Shared</p>
          </div>

          <div className="w-px h-10 bg-white/10 block"></div>

          <div>
            <p className="text-3xl font-black">100%</p>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#B642F5] mt-1">Encrypted</p>
          </div>

          <div className="w-px h-10 bg-white/10 block"></div>

          <div>
            <p className="text-3xl font-black">24/7</p>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#B642F5] mt-1">Moderated</p>
          </div>
        </div>

      </div>

    </main>
  );
}
