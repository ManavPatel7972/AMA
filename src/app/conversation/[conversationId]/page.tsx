"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Shield, Lock, Share2, AtSign, MessageCircle, Link2, MoreHorizontal } from "lucide-react";

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
            <div className="min-h-screen flex items-center justify-center bg-[#120E17]">
                <Loader2 className="animate-spin text-[#B642F5]" size={36} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#120E17] text-white px-6">
                <div className="w-full max-w-md text-center border border-white/5 bg-[#1C1625] rounded-[2rem] p-10 shadow-xl">
                    <Shield size={48} className="text-[#FF5678] mx-auto mb-6" />
                    <h2 className="text-3xl font-black mb-4">Access Denied</h2>
                    <p className="text-white/40 font-medium mb-10 leading-relaxed">{error}</p>
                    <button
                        onClick={() => router.push("/")}
                        className="bg-gradient-to-r from-[#B642F5] to-[#E961FF] text-white px-10 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_30px_rgba(233,97,255,0.4)] hover:-translate-y-0.5 active:scale-95 inline-block cursor-pointer"
                    >
                        Go to Homepage
                    </button>
                </div>
            </div>
        );
    }

    const hasReply = messages.some(m => m.type === "reply");

    return (
        <main className="min-h-screen bg-[#120E17] text-white font-sans selection:bg-[#B642F5]/30 selection:text-[#B642F5] relative overflow-hidden pb-10">

            {/* Ambient Background Glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[#B642F5]/10 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />

            {/* Nav Header */}
            <nav className="max-w-4xl mx-auto px-6 py-8 flex justify-between items-center relative z-10 w-full">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B642F5] to-[#E961FF] flex items-center justify-center shadow-lg shadow-[#B642F5]/20">
                        <Shield size={20} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Secret Reply</h1>
                </div>

                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                    <MoreHorizontal size={20} className="text-white/60" />
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
                                        <Lock size={12} className="text-[#B642F5]" />
                                        <span className="text-[11px] font-black uppercase tracking-widest text-[#B642F5]">
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
                                            <div className="bg-[#66C2FF] w-1.5 h-1.5 rounded-full" />
                                        </div>
                                    </div>
                                )}

                                <div
                                    className={`w-full max-w-[90%] sm:max-w-[85%] p-6 sm:p-8 shadow-2xl relative ${isReply
                                        ? "bg-[#1C1625]/80 backdrop-blur-md border border-white/10 rounded-[2rem] rounded-br-md text-white/90"
                                        : "bg-gradient-to-br from-[#B642F5] to-[#7435DF] text-white rounded-[2rem] rounded-bl-md shadow-[#B642F5]/20 shadow-[0_20px_60px_-15px_rgba(182,66,245,0.4)]"
                                        }`}
                                >
                                    {/* Arrow decoration for primary bubble */}
                                    {!isReply && (
                                        <div className="absolute -bottom-3 left-6 w-8 h-8 bg-[#7435DF] rotate-45 -z-10 rounded-sm blur-[2px]" />
                                    )}
                                    {isReply && (
                                        <div className="absolute -bottom-2 right-8 w-6 h-6 bg-[#1C1625] border-r border-b border-white/10 rotate-45 -z-10 rounded-sm" />
                                    )}

                                    <p className={`text-[17px] sm:text-lg lg:text-xl font-bold leading-relaxed tracking-tight ${!isReply ? 'italic' : ''}`}>
                                        {!isReply ? `"${msg.content}"` : msg.content}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {!hasReply && (
                    <div className="mt-12 mb-16 w-full text-center p-12 border-2 border-dashed border-[#B642F5]/30 rounded-[2rem] bg-[#B642F5]/5 backdrop-blur-sm shadow-inner group">
                        <Loader2 className="animate-spin text-[#B642F5] mx-auto mb-4" size={28} />
                        <p className="text-white text-lg font-black tracking-wide">
                            Waiting for them to reply... 👀
                        </p>
                        <p className="text-[13px] font-medium text-white/40 mt-3 max-w-sm mx-auto leading-relaxed group-hover:text-white/60 transition-colors">
                            We'll ping you if notifications are on, otherwise just refresh this page later!
                        </p>
                    </div>
                )}

                {hasReply && (
                    <div className="mt-16 w-full flex flex-col items-center">
                        <div className="flex items-center gap-10 sm:gap-14 mb-10 w-full justify-center text-white/40">
                            <div className="flex flex-col items-center gap-3 cursor-pointer hover:text-[#E961FF] hover:scale-110 transition-all group">
                                <div className="w-12 h-12 rounded-full bg-[#1C1625] border border-white/5 flex items-center justify-center shadow-lg group-hover:border-[#E961FF]/30 group-hover:shadow-[#E961FF]/20">
                                    <Share2 size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Instagram</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 cursor-pointer hover:text-[#66C2FF] hover:scale-110 transition-all group">
                                <div className="w-12 h-12 rounded-full bg-[#1C1625] border border-white/5 flex items-center justify-center shadow-lg group-hover:border-[#66C2FF]/30 group-hover:shadow-[#66C2FF]/20">
                                    <AtSign size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Twitter</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 cursor-pointer hover:text-[#25D366] hover:scale-110 transition-all group">
                                <div className="w-12 h-12 rounded-full bg-[#1C1625] border border-white/5 flex items-center justify-center shadow-lg group-hover:border-[#25D366]/30 group-hover:shadow-[#25D366]/20">
                                    <MessageCircle size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">WhatsApp</span>
                            </div>
                            <div
                                onClick={handleCopyLink}
                                className="flex flex-col items-center gap-3 cursor-pointer hover:text-white hover:scale-110 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-full bg-[#1C1625] border border-white/5 flex items-center justify-center shadow-lg group-hover:border-white/30">
                                    <Link2 size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Link</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCopyLink}
                            className="w-full sm:max-w-md bg-gradient-to-r from-[#B642F5] to-[#E961FF] text-white py-5 rounded-2xl text-[17px] font-black tracking-wide shadow-[0_0_40px_rgba(233,97,255,0.4)] hover:shadow-[0_0_60px_rgba(233,97,255,0.6)] hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer border border-[#E961FF]/20"
                        >
                            <Share2 size={20} /> Share this Reply
                        </button>
                    </div>
                )}

                <div className="mt-16 w-full flex flex-col items-center border-t border-white/10 pt-10">
                    <p className="text-[13px] font-medium text-white/20 mb-6">Want your own?</p>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full sm:max-w-md bg-transparent border border-[#B642F5]/40 text-white py-4 rounded-2xl text-[15px] font-bold hover:bg-[#B642F5]/10 hover:border-[#B642F5] active:scale-95 transition-all text-center cursor-pointer shadow-[inset_0_0_20px_rgba(182,66,245,0.05)]"
                    >
                        Send your own secret message
                    </button>
                </div>

            </div>
        </main>
    );
}
