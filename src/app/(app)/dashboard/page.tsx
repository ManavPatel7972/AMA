"use client";

import { useEffect, useState } from "react";
import { RefreshCcw, Trash2, Loader2, Bell, Settings, Shield, Heart, Edit3, Share2, Copy, Filter, Grid2x2, Plus } from "lucide-react";
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
    <main className="min-h-screen bg-[#120E17] text-white font-sans selection:bg-[#B642F5]/30 selection:text-[#B642F5] pb-20">

      {/* Top Navigation Bar */}
      {/* <nav className="border-b border-white/5 bg-[#17131F]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7435DF] to-[#B642F5] flex items-center justify-center shadow-lg shadow-[#7435DF]/20">
              <Grid2x2 size={20} className="text-white relative z-10" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Inbox</h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-white/60 hover:text-white transition-colors">
              <Bell size={20} />
            </button>
            <button className="text-white/60 hover:text-white transition-colors">
              <Settings size={20} />
            </button>
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-tight">@{username}</p>
                <p className="text-xs text-[#B642F5] font-medium italic">Pro Member</p>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 bg-[#251D33] flex items-center justify-center p-0.5">
                <div className="w-full h-full rounded-full bg-gradient-to-b from-[#251D33] to-[#120E17] flex items-center justify-center">
                  <Shield size={16} className="text-white/40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav> */}

      <div className="max-w-4xl mx-auto px-6 pt-12 pb-10">

        {/* Profile Header Box */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-[2rem] p-1 bg-gradient-to-tr from-[#B642F5] via-[#7435DF] to-[#E961FF] shadow-xl shadow-[#7435DF]/20 rotate-[-2deg] transition-transform hover:rotate-0">
              <div className="w-full h-full rounded-[1.8rem] bg-[#120E17] flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${username}`} alt="Avatar" className="w-[120%] h-[120%] object-cover opacity-90" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-black mb-1 flex items-center gap-2">
                Hey, {username}! <span className="text-2xl animate-wave origin-bottom-right inline-block tracking-widest">👋</span>
              </h2>
              <p className="text-sm text-white/50 flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                Status: Receiving anonymous vibes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 bg-white/5 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/20">
              <Edit3 size={16} /> Edit Profile
            </button>
            <button
              onClick={fetchMessages}
              disabled={loadingMessages}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#B642F5] to-[#E961FF] text-white text-sm font-bold shadow-lg shadow-[#B642F5]/30 hover:shadow-[#B642F5]/50 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-70 disabled:pointer-events-none"
            >
              <RefreshCcw size={16} className={`${loadingMessages ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Settings / Link Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

          {/* Accepting Messages Toggle */}
          <div className="bg-[#1C1625] border border-white/5 rounded-3xl p-6 flex items-center justify-between shadow-xl">
            <div>
              <h3 className="text-base font-bold mb-1">Accepting Messages</h3>
              <p className="text-sm text-white/40 font-medium">Control your inbox visibility</p>
            </div>
            <button
              onClick={handleToggleAccept}
              disabled={updatingAccept}
              className={`relative w-[60px] h-[32px] rounded-full transition-all duration-300 p-1 flex items-center cursor-pointer ${acceptMessages ? 'bg-[#B642F5]' : 'bg-white/10'}`}
            >
              <div className={`w-[24px] h-[24px] bg-white rounded-full shadow-md transition-transform duration-300 ${acceptMessages ? 'translate-x-[28px]' : 'translate-x-[0px]'}`}></div>
            </button>
          </div>

          {/* Unique Link Input */}
          <div className="bg-[#1C1625] border border-white/5 rounded-3xl p-6 shadow-xl">
            <label className="text-sm font-bold text-white/40 mb-3 block">Your Unique Link</label>
            <div className="flex bg-[#251D33] rounded-xl border border-white/5 outline-none focus-within:border-[#B642F5]/50 transition-colors p-1">
              <input
                readOnly
                value={profileUrl}
                className="flex-1 bg-transparent px-4 py-2 text-sm text-[#E961FF] font-mono outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="bg-[#B642F5] text-white p-3 rounded-lg hover:brightness-110 cursor-pointer active:scale-95 transition-all"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Section */}
        <div className="mb-6 flex justify-between items-end border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black tracking-tight">Recent Messages</h3>
            <span className="px-3 py-1 rounded-full bg-[#37194D] text-[#E961FF] text-xs font-bold shadow-inner block">
              {messages.length} New
            </span>
          </div>
          <button className="text-white/40 hover:text-white transition-colors">
            <Filter size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loadingMessages ? (
            <div className="col-span-full py-12 flex justify-center text-white/50">
              <Loader2 className="animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="col-span-full py-12 text-center text-white/30 border border-dashed border-white/10 rounded-3xl">
              No recent messages. Share your link to get some!
            </div>
          ) : (
            messages.map((msg, index) => {
              // Alternate colors strictly for design showcase or styling consistency
              const isPremium = index % 3 === 1;
              const isSpecial = index % 3 === 2;

              let borderColor = 'border-[#7435DF]';
              let badgeColor = 'bg-[#7435DF] text-white';
              let icon = <span className="font-bold text-sm">:)</span>;
              let userTitle = 'ANONYMOUS';

              if (isPremium) {
                borderColor = 'border-[#FF5678]';
                badgeColor = 'bg-[#FF5678] text-white';
                icon = <span className="font-bold text-sm">⚡</span>;
                userTitle = 'PREMIUM USER';
              } else if (isSpecial) {
                borderColor = 'border-[#00D2FF]';
                badgeColor = 'bg-[#00D2FF] text-white';
                icon = <span className="font-bold text-sm">?</span>;
                userTitle = 'ANONYMOUS';
              }

              return (
                <div key={msg._id} className="group relative bg-[#1C1625] overflow-hidden rounded-[1.5rem] border border-white/5 flex flex-col p-[1px] hover:-translate-y-1 transition-all">
                  {/* Left accented border line via absolute div */}
                  <div className={`absolute left-0 top-0 bottom-0 w-[4px] opacity-80 ${isPremium ? 'bg-gradient-to-b from-[#FF5678] to-[#FF4465]/10' : borderColor} group-hover:opacity-100 transition-opacity z-10`} />

                  <div className="bg-[#1C1625] w-full h-full rounded-[1.45rem] p-6 flex flex-col relative z-20 hover:bg-[#201A29] transition-colors">
                    <button onClick={() => deleteMessage(msg._id)} className="absolute top-4 right-4 text-white/20 hover:text-red-400 cursor-pointer transition-colors hidden group-hover:block">
                      <Trash2 size={16} />
                    </button>

                    {/* Avatar & Info */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${badgeColor}`}>
                        {icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white/40 tracking-wider mb-0.5">{userTitle}</p>
                        <p className="text-[11px] text-[#E961FF]/70 font-medium">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Message Content */}
                    <p className="text-[14px] font-semibold leading-relaxed text-white/90 mb-6 flex-1 break-words">
                      "{msg.content}"
                    </p>

                    {/* Reply Block */}
                    {msg.reply && (
                      <div className="mb-6 p-4 bg-[#251D33] rounded-2xl border border-white/5 relative">
                        <div className="absolute -top-1.5 left-6 w-3 h-3 bg-[#251D33] rotate-45 border-l border-t border-white/5"></div>
                        <span className="font-bold text-[10px] uppercase tracking-widest text-[#B642F5] block mb-2">You Replied &nbsp;✨</span>
                        <div className="max-h-32 overflow-y-auto pr-2">
                          <p className="leading-relaxed font-semibold text-[13px] text-white/80 whitespace-pre-wrap break-words">{msg.reply.content}</p>
                        </div>
                      </div>
                    )}

                    {/* Reply Textarea Block */}
                    {replyingTo === msg._id && !msg.reply && (
                      <div className="mb-6 relative z-10 bg-[#120E17]/50 p-4 rounded-2xl border border-[#B642F5]/20 shadow-inner">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Type your reply here..."
                          className="w-full bg-[#120E17] border border-white/5 rounded-xl p-3 text-sm font-medium outline-none resize-none min-h-[80px] focus:border-[#B642F5]/50 transition-all text-white placeholder:text-white/30"
                        />
                        <div className="flex justify-end gap-3 mt-3">
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyContent("");
                            }}
                            className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg text-white/50 hover:bg-white/5 hover:text-white transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReply(msg.conversationId || msg._id)}
                            disabled={submittingReply}
                            className="px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg bg-gradient-to-r from-[#B642F5] to-[#E961FF] text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
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
                          className="text-[11px] font-bold text-[#B642F5] hover:text-[#E961FF] uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          Reply Private <span className="text-base leading-none">→</span>
                        </button>
                      ) : (
                        <div />
                      )}
                      <Heart size={14} className="text-white/20 hover:text-[#FF5678] cursor-pointer transition-colors" />
                    </div>
                  </div>
                </div>
              )
            })
          )}

          {/* Blank waiting card */}
          <div className="bg-[#1C1625]/50 border-2 border-dashed border-white/5 rounded-[1.5rem] flex flex-col items-center justify-center p-8 min-h-[220px]">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <Plus size={18} className="text-white/40" />
            </div>
            <p className="text-sm font-medium text-white/40">Wait for more vibes...</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center mt-6 pb-6">
          <button
            onClick={handleCopyLink}
            className="w-full md:w-auto px-12 py-5 rounded-2xl bg-gradient-to-r from-[#B642F5] to-[#E961FF] text-white text-sm font-black uppercase tracking-widest cursor-pointer shadow-[0_0_40px_rgba(182,66,245,0.4)] hover:shadow-[0_0_60px_rgba(182,66,245,0.6)] hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Share2 size={18} />
            Share Profile Link
          </button>
        </div>

      </div>
    </main>
  );
}
