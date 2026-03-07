"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, VenetianMask, Lock, Share2, AtSign, MessageCircle, Link2, MoreHorizontal } from "lucide-react";

interface Message {
    _id: string;
    content: string;
    createdAt: string;
    type: "message" | "reply";
}

export default function ConversationPage() {
    const { conversationId } = useParams();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const token = localStorage.getItem(`senderToken_${conversationId}`);
                if (!token) {
                    setError("You do not have permission to view this conversation or the link is invalid.");
                    setLoading(false);
                    return;
                }

                const res = await fetch(`/api/conversation/${conversationId}?token=${token}`);
                const data = await res.json();

                if (!data.success) {
                    setError(data.message);
                    return;
                }

                setMessages(data.messages);
            } catch (err) {
                setError("Failed to load conversation");
            } finally {
                setLoading(false);
            }
        };

        if (conversationId) {
            fetchConversation();
        }

    }, [conversationId]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <Loader2 className="animate-spin text-indigo-500" size={36} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white px-6">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                <div className="w-full max-w-md text-center border border-white/10 bg-zinc-900/50 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl relative z-10">
                    <VenetianMask size={48} className="text-rose-500 mx-auto mb-6 drop-shadow-lg" />
                    <h2 className="text-3xl font-black mb-4 tracking-tight">Access Denied</h2>
                    <p className="text-zinc-400 font-medium mb-10 leading-relaxed">{error}</p>
                    <button
                        onClick={() => router.push("/")}
                        className="bg-white text-zinc-950 px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 hover:bg-zinc-200 hover:scale-105 active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)] inline-block cursor-pointer"
                    >
                        Go to Homepage
                    </button>
                </div>
            </div>
        );
    }

    const hasReply = messages.some(m => m.type === "reply");

    return (
        <main className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-indigo-500/30 selection:text-white relative overflow-hidden pb-10">

            {/* Ambient Background Glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

            {/* Nav Header */}
            <nav className="max-w-4xl mx-auto px-6 py-8 flex justify-between items-center relative z-10 w-full">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] ring-1 ring-white/20">
                        <VenetianMask size={20} className="text-white drop-shadow-md" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">Secret Message</h1>
                </div>

                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors cursor-pointer shadow-sm">
                    <MoreHorizontal size={20} className="text-zinc-400" />
                </div>
            </nav>

            <div className="max-w-3xl mx-auto relative z-10 mt-6 px-6 sm:px-10">
                <div className="space-y-4">
                    {messages.map((msg, index) => {
                        const isReply = msg.type === "reply";
                        return (
                            <div
                                key={msg._id}
                                className={`flex flex-col w-full ${isReply ? "items-end" : "items-start"}`}
                            >
                                {!isReply && (
                                    <div className="flex items-center gap-2 mb-3 px-2">
                                        <Lock size={12} className="text-indigo-400" />
                                        <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400">
                                            Anonymous Message
                                        </span>
                                    </div>
                                )}

                                {isReply && (
                                    <div className="flex items-center gap-2 mb-3 px-2 justify-end w-full">
                                        <span className="text-[11px] font-black uppercase tracking-widest text-[#66C2FF]">
                                            Your Public Reply
                                        </span>
                                        <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
                                            <div className="bg-[#66C2FF] w-1.5 h-1.5 rounded-full shadow-[0_0_10px_rgba(102,194,255,0.8)]" />
                                        </div>
                                    </div>
                                )}

                                <div
                                    className={`w-full max-w-[90%] sm:max-w-[85%] p-6 sm:p-8 shadow-2xl relative ${isReply
                                        ? "bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-[2rem] rounded-br-md text-zinc-100"
                                        : "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-[2rem] rounded-bl-md shadow-indigo-500/20 shadow-[0_20px_60px_-15px_rgba(99,102,241,0.4)] border border-white/10"
                                        }`}
                                >
                                    {/* Arrow decoration for primary bubble */}
                                    {!isReply && (
                                        <div className="absolute -bottom-3 left-6 w-8 h-8 bg-indigo-600 rotate-45 -z-10 rounded-sm blur-[2px]" />
                                    )}
                                    {isReply && (
                                        <div className="absolute -bottom-2 right-8 w-6 h-6 bg-zinc-900 border-r border-b border-white/10 rotate-45 -z-10 rounded-sm" />
                                    )}

                                    <p className={`text-[17px] sm:text-lg lg:text-xl font-medium leading-relaxed tracking-tight ${!isReply ? 'italic drop-shadow-sm' : ''}`}>
                                        {!isReply ? `"${msg.content}"` : msg.content}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {!hasReply && (
                    <div className="mt-12 mb-16 w-full text-center p-12 border-2 border-dashed border-indigo-500/30 rounded-[2.5rem] bg-indigo-500/5 backdrop-blur-md shadow-inner group">
                        <Loader2 className="animate-spin text-indigo-400 mx-auto mb-4" size={32} />
                        <p className="text-white text-lg font-black tracking-wide drop-shadow-sm">
                            Waiting for them to reply... 👀
                        </p>
                        <p className="text-[13px] font-medium text-zinc-400 mt-3 max-w-sm mx-auto leading-relaxed group-hover:text-zinc-300 transition-colors">
                            We'll ping you if notifications are on, otherwise just refresh this page later!
                        </p>
                    </div>
                )}

                {hasReply && (
                    <div className="mt-16 w-full flex flex-col items-center">
                        <div className="flex items-center gap-10 sm:gap-14 mb-10 w-full justify-center text-zinc-500">
                            <div className="flex flex-col items-center gap-3 cursor-pointer hover:text-pink-400 hover:scale-110 transition-all group">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-lg group-hover:border-pink-400/30 group-hover:shadow-pink-400/20 ring-1 ring-black/50">
                                    <Share2 size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Instagram</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 cursor-pointer hover:text-[#66C2FF] hover:scale-110 transition-all group">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-lg group-hover:border-[#66C2FF]/30 group-hover:shadow-[#66C2FF]/20 ring-1 ring-black/50">
                                    <AtSign size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Twitter</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 cursor-pointer hover:text-[#25D366] hover:scale-110 transition-all group">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-lg group-hover:border-[#25D366]/30 group-hover:shadow-[#25D366]/20 ring-1 ring-black/50">
                                    <MessageCircle size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">WhatsApp</span>
                            </div>
                            <div
                                onClick={handleCopyLink}
                                className="flex flex-col items-center gap-3 cursor-pointer hover:text-white hover:scale-110 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-lg group-hover:border-white/30 ring-1 ring-black/50">
                                    <Link2 size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Link</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCopyLink}
                            className="w-full sm:max-w-md bg-white text-zinc-950 py-5 rounded-2xl text-[17px] font-black tracking-wide shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
                        >
                            <Share2 size={20} /> Share this Reply
                        </button>
                    </div>
                )}

                <div className="mt-16 w-full flex flex-col items-center border-t border-white/10 pt-10">
                    <p className="text-[13px] font-medium text-zinc-500 mb-6 uppercase tracking-widest">Want your own?</p>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full sm:max-w-md bg-transparent border border-white/20 text-white py-4 rounded-2xl text-[15px] font-bold hover:bg-white/5 hover:border-white active:scale-95 transition-all text-center cursor-pointer shadow-sm"
                    >
                        Send your own secret message
                    </button>
                </div>

            </div>
        </main>
    );
}
