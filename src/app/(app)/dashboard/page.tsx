"use client";

import { useEffect, useState } from "react";
import { RefreshCcw, Trash2, Loader2, Heart, Edit3, Share2, Copy, Filter, VenetianMask, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Message {
  _id: string;
  content: string;
  createdAt: string;
  conversationId?: string;
  reply?: { content: string; createdAt: string } | null;
}

export default function DashboardPage() {
  const [acceptMessages, setAcceptMessages] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [updatingAccept, setUpdatingAccept] = useState(false);

  // Minimal reply state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>("");
  const [submittingReply, setSubmittingReply] = useState<boolean>(false);

  const router = useRouter();
  const { data } = useSession();

  const username = data?.user?.username || "Alex";

  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/u/${username}`
      : "";

  //! fetch accept message status
  const fetchAcceptStatus = async () => {
    try {
      const res = await fetch("/api/accept-messages");
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setAcceptMessages(data.isAcceptingMessages);
    } catch (error) {
      toast.error("Failed to fetch acceptance status");
    }
  };

  //! toggle accept messages
  const handleToggleAccept = async () => {
    try {
      setUpdatingAccept(true);
      const newValue = !acceptMessages;
      const res = await fetch("/api/accept-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acceptMessages: newValue }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setAcceptMessages(newValue);
      toast.success(
        newValue ? "Now accepting anonymous messages" : "Stopped accepting messages"
      );
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingAccept(false);
    }
  };

  // ! fetch messages
  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);
      const res = await fetch("/api/get-messages");
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setMessages(data.messages);
      toast.success("Messages refreshed");
    } catch (error) {
      toast.error("Failed to fetch messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  //! delete message
  const deleteMessage = async (messageid: string) => {
    setMessages((prev) => prev.filter((msg) => msg._id !== messageid));
    try {
      const res = await fetch(`/api/delete-message/${messageid}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success("Message deleted successfully");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  //! handle reply
  const handleReply = async (conversationId: string | undefined) => {
    if (!conversationId) {
      toast.error("This message cannot be replied to.");
      return;
    }

    if (!replyContent.trim()) {
      toast.error("Reply cannot be empty.");
      return;
    }

    setSubmittingReply(true);

    try {
      const res = await fetch("/api/messages/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, replyContent }),
      });

      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success("Reply sent successfully!");
      setReplyingTo(null);
      setReplyContent("");
      fetchMessages(); // refresh to show the newly added reply
    } catch (error) {
      toast.error("Failed to send reply");
    } finally {
      setSubmittingReply(false);
    }
  };

  //! handle copy link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  //! initial fetch
  useEffect(() => {
    fetchAcceptStatus();
    fetchMessages();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-indigo-500/30 pb-20 overflow-hidden relative">

      {/* Decorative Glow Backgrounds */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-6 pt-12 pb-10">

        {/* Profile Header Box */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-[2rem] p-1 bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20 rotate-[-2deg] transition-transform hover:rotate-0">
              <div className="w-full h-full rounded-[1.8rem] bg-zinc-950 flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${username}`} alt="Avatar" className="w-[120%] h-[120%] object-cover opacity-90" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-black mb-1 flex items-center gap-2 tracking-tight text-white drop-shadow-sm">
                Hey, {username}! <span className="text-2xl animate-wave origin-bottom-right inline-block tracking-widest">👋</span>
              </h2>
              <p className="text-sm text-zinc-400 flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                Status: Receiving anonymous messages
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 shadow-sm">
              <Edit3 size={16} /> Edit Profile
            </button>
            <button
              onClick={fetchMessages}
              disabled={loadingMessages}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-950 text-sm font-bold shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:bg-zinc-200 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-70 disabled:pointer-events-none"
            >
              <RefreshCcw size={16} className={`${loadingMessages ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Settings / Link Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

          {/* Accepting Messages Toggle */}
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center justify-between shadow-xl">
            <div>
              <h3 className="text-base font-bold mb-1 text-white">Accepting Messages</h3>
              <p className="text-sm text-zinc-400 font-medium">Control your inbox visibility</p>
            </div>
            <button
              onClick={handleToggleAccept}
              disabled={updatingAccept}
              className={`relative w-[60px] h-[32px] rounded-full transition-all duration-300 p-1 flex items-center cursor-pointer ${acceptMessages ? 'bg-indigo-500 shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)]' : 'bg-white/10'}`}
            >
              <div className={`w-[24px] h-[24px] bg-white rounded-full shadow-md transition-transform duration-300 ${acceptMessages ? 'translate-x-[28px]' : 'translate-x-[0px]'}`}></div>
            </button>
          </div>

          {/* Unique Link Input */}
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
            <label className="text-sm font-bold text-zinc-400 mb-3 block">Your Unique Link</label>
            <div className="flex bg-zinc-950/50 rounded-xl border border-white/10 outline-none focus-within:border-indigo-500/50 transition-colors p-1 shadow-inner">
              <input
                readOnly
                value={profileUrl}
                className="flex-1 bg-transparent px-4 py-2 text-sm text-indigo-400 font-mono outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="bg-white text-zinc-950 p-2.5 rounded-lg hover:bg-zinc-200 cursor-pointer active:scale-95 transition-all shadow-sm"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Section */}
        <div className="mb-6 flex justify-between items-end border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black tracking-tight text-white drop-shadow-sm">Recent Messages</h3>
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold shadow-inner block">
              {messages.length} New
            </span>
          </div>
          <button className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-2 hover:bg-white/5 rounded-xl">
            <Filter size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {loadingMessages ? (
            <div className="col-span-full py-20 flex justify-center text-zinc-500">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : messages.length === 0 ? (
            <div className="col-span-full py-16 text-center text-zinc-500 border border-dashed border-white/10 bg-white/5 rounded-[2rem] flex flex-col items-center">
              <VenetianMask size={40} className="mb-4 opacity-50" />
              <p className="font-medium">No recent messages. Share your link to get some!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              // Accent styling
              const isPremium = index % 3 === 1;
              const isSpecial = index % 3 === 2;

              let borderColor = 'border-indigo-500/50';
              let badgeColor = 'bg-gradient-to-tr from-indigo-500 to-purple-600';
              let icon = <span className="font-bold text-sm">:)</span>;
              let userTitle = 'ANONYMOUS';

              if (isPremium) {
                borderColor = 'border-pink-500/50';
                badgeColor = 'bg-gradient-to-tr from-pink-500 to-rose-500';
                icon = <span className="font-bold text-sm">⚡</span>;
                userTitle = 'PREMIUM USER';
              } else if (isSpecial) {
                borderColor = 'border-purple-500/50';
                badgeColor = 'bg-gradient-to-tr from-purple-500 to-indigo-500';
                icon = <span className="font-bold text-sm">?</span>;
                userTitle = 'ANONYMOUS';
              }

              return (
                <div key={msg._id} className="group relative bg-zinc-900/50 backdrop-blur-md overflow-hidden rounded-[2rem] border border-white/5 flex flex-col p-[1px] hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300">
                  {/* Left accented border line via absolute div */}
                  <div className={`absolute left-0 top-0 bottom-0 w-[4px] opacity-80 ${isPremium ? 'bg-gradient-to-b from-pink-500 to-rose-500' : isSpecial ? 'bg-gradient-to-b from-purple-500 to-indigo-500' : 'bg-gradient-to-b from-indigo-500 to-purple-600'} group-hover:opacity-100 transition-opacity z-10`} />

                  <div className="bg-zinc-950/80 w-full h-full rounded-[1.95rem] p-6 flex flex-col relative z-20 hover:bg-zinc-900/80 transition-colors">
                    <button onClick={() => deleteMessage(msg._id)} className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 cursor-pointer transition-colors hidden group-hover:block p-2 rounded-xl hover:bg-red-500/10">
                      <Trash2 size={16} />
                    </button>

                    {/* Avatar & Info */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg text-white ${badgeColor}`}>
                        {icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-500 tracking-wider mb-0.5 uppercase">{userTitle}</p>
                        <p className="text-[11px] text-zinc-400 font-medium">
                          {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Message Content */}
                    <p className="text-[15px] font-medium leading-relaxed text-zinc-200 mb-6 flex-1 break-words">
                      "{msg.content}"
                    </p>

                    {/* Reply Block */}
                    {msg.reply && (
                      <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10 relative">
                        <div className="absolute -top-1.5 left-6 w-3 h-3 bg-zinc-900 rotate-45 border-l border-t border-white/10 pointer-events-none"></div>
                        <span className="font-bold text-[10px] uppercase tracking-widest text-indigo-400 block mb-2">You Replied &nbsp;✨</span>
                        <div className="max-h-32 overflow-y-auto pr-2">
                          <p className="leading-relaxed font-medium text-[13px] text-zinc-300 whitespace-pre-wrap break-words">{msg.reply.content}</p>
                        </div>
                      </div>
                    )}

                    {/* Reply Textarea Block */}
                    {replyingTo === msg._id && !msg.reply && (
                      <div className="mb-6 relative z-10 bg-zinc-950/50 p-4 rounded-2xl border border-indigo-500/30 shadow-inner">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Type your reply here..."
                          className="w-full bg-transparent p-2 text-sm font-medium outline-none resize-none min-h-[80px] text-white placeholder:text-zinc-600"
                        />
                        <div className="flex justify-end gap-3 mt-3 border-t border-white/5 pt-3">
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyContent("");
                            }}
                            className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl text-zinc-500 hover:bg-white/5 hover:text-white transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReply(msg.conversationId || msg._id)}
                            disabled={submittingReply}
                            className="px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl bg-white text-zinc-950 shadow-[0_0_15px_-3px_rgba(255,255,255,0.4)] transition-all hover:bg-zinc-200 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                          >
                            {submittingReply ? <Loader2 size={14} className="animate-spin" /> : "Send"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Reply Button Footer */}
                    <div className="flex items-center justify-between w-full mt-auto">
                      {!msg.reply && replyingTo !== msg._id ? (
                        <button
                          onClick={() => setReplyingTo(msg._id)}
                          className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer group/btn"
                        >
                          Reply Private <span className="text-base leading-none group-hover/btn:translate-x-1 transition-transform">→</span>
                        </button>
                      ) : (
                        <div />
                      )}
                      <Heart size={16} className="text-zinc-600 hover:text-rose-500 cursor-pointer transition-colors active:scale-90" />
                    </div>
                  </div>
                </div>
              )
            })
          )}

          {/* Blank waiting card */}
          <div className="bg-zinc-900/40 backdrop-blur-xl border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center p-8 min-h-[220px]">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 ring-1 ring-white/10 shadow-inner">
              <Plus size={20} className="text-zinc-500" />
            </div>
            <p className="text-sm font-medium text-zinc-500">Wait for more messages...</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center mt-6 pb-6">
          <button
            onClick={handleCopyLink}
            className="w-full md:w-auto px-12 py-5 rounded-2xl bg-white text-zinc-950 text-base font-black uppercase tracking-widest cursor-pointer shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.5)] hover:bg-zinc-200 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Share2 size={18} />
            Share Profile Link
          </button>
        </div>

      </div>
    </main>
  );
}
