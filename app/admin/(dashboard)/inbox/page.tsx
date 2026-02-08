"use client";

import { MESSAGES } from "@/lib/admin-data";
import { Archive, ArrowLeft, Mail, MailOpen, MoreVertical, Reply, Search, Send, Star, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

// Extend the mock data type locally for the state
type Message = (typeof MESSAGES)[0] & {
  starred?: boolean;
};

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>(
    MESSAGES.map(m => ({ ...m, starred: false }))
  );
  const [activeMessageId, setActiveMessageId] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "starred">("all");
  
  const activeMessage = messages.find(m => m.id === activeMessageId) || messages[0];

  // Derived state
  const filteredMessages = useMemo(() => {
    return messages.filter(m => {
      const matchesSearch = m.sender.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            m.subject.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesTab = true;
      if (activeTab === "unread") matchesTab = m.unread;
      if (activeTab === "starred") matchesTab = !!m.starred;
      
      return matchesSearch && matchesTab;
    });
  }, [messages, searchQuery, activeTab]);

  const handleReadToggle = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMessages(prev => prev.map(m => 
      m.id === id ? { ...m, unread: !m.unread } : m
    ));
  };

  const handleStarToggle = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMessages(prev => prev.map(m => 
      m.id === id ? { ...m, starred: !m.starred } : m
    ));
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this message?")) {
      setMessages(prev => prev.filter(m => m.id !== id));
      if (activeMessageId === id) setActiveMessageId(null);
    }
  };

  const handleArchive = (id: number) => {
     setMessages(prev => prev.filter(m => m.id !== id));
     if (activeMessageId === id) setActiveMessageId(null);
     // alert("Message archived");
  };

  const handleSendReply = () => {
    if (!replyText) return;
    setIsReplying(true);
    setTimeout(() => {
       setIsReplying(false);
       setReplyText("");
       alert(`Reply sent to ${activeMessage.sender}!`);
    }, 1000);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      {/* Sidebar/List - Hidden on mobile when message is selected */}
      <div className={`w-full lg:w-96 flex flex-col bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] backdrop-blur-md overflow-hidden min-w-0 ${activeMessageId ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-2 md:p-4 border-b border-white/20 dark:border-white/10 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 overflow-hidden">
             <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 shrink-0">
                Inbox 
                <span className="text-gold text-[10px] md:text-sm font-normal bg-gold/10 px-2 py-0.5 rounded-full">
                   {messages.filter(m => m.unread).length}
                </span>
             </h2>

             <div className="flex gap-1 md:gap-2 text-[10px] md:text-xs font-bold overflow-x-auto no-scrollbar mask-linear-fade">
                <button onClick={() => setActiveTab("all")} className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full border transition-all whitespace-nowrap ${activeTab === 'all' ? 'bg-white text-black border-white' : 'text-white/40 border-white/20 dark:border-white/10 hover:border-white/30'}`}>All</button>
                <button onClick={() => setActiveTab("unread")} className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full border transition-all whitespace-nowrap ${activeTab === 'unread' ? 'bg-white text-black border-white' : 'text-white/40 border-white/20 dark:border-white/10 hover:border-white/30'}`}>Unread</button>
                <button onClick={() => setActiveTab("starred")} className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full border transition-all whitespace-nowrap ${activeTab === 'starred' ? 'bg-white text-black border-white' : 'text-white/40 border-white/20 dark:border-white/10 hover:border-white/30'}`}>Starred</button>
             </div>
          </div>
           
           <div className="relative">
            <Search className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-[8px] pl-7 md:pl-9 pr-2 md:pr-3 py-1.5 md:py-2 text-xs md:text-sm text-white focus:border-gold/50 outline-none placeholder:text-white/20"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredMessages.map((msg) => (
            <div 
              key={msg.id} 
              onClick={() => setActiveMessageId(msg.id)}
              className={`p-2 md:p-4 border-b border-white/5 cursor-pointer hover:bg-white/30 dark:bg-white/5 transition-all group relative ${
                activeMessageId === msg.id ? "bg-white/10" : ""
              } ${msg.unread ? "border-l-2 border-l-gold" : "opacity-80"}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className={`text-xs md:text-sm ${msg.unread ? "font-bold text-white" : "font-medium text-white/80"}`}>{msg.sender}</h4>
                <div className="flex items-center gap-2">
                   {msg.starred && <Star size={10} className="text-gold fill-gold" />}
                   <span className="text-xs text-white/40">{msg.date}</span>
                </div>
              </div>
              <p className={`text-xs ${msg.unread ? "text-white font-medium" : "text-white/60"} mb-1 truncate pr-6`}>{msg.subject}</p>
              <p className="text-xs text-white/40 truncate">{msg.preview}</p>
              
              {/* Quick Actions on Hover */}
              <div className="absolute right-2 bottom-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={(e) => handleStarToggle(msg.id, e)} className="p-1.5 hover:bg-white/20 rounded text-white/60 hover:text-gold"><Star size={12} className={msg.starred ? "fill-gold text-gold" : ""} /></button>
                 <button onClick={(e) => handleReadToggle(msg.id, e)} className="p-1.5 hover:bg-white/20 rounded text-white/60 hover:text-white" title={msg.unread ? "Mark Read" : "Mark Unread"}>
                    {msg.unread ? <MailOpen size={12} /> : <Mail size={12} />}
                 </button>
                 <button onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }} className="p-1.5 hover:bg-white/20 rounded text-white/60 hover:text-red-400"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
          {filteredMessages.length === 0 && (
             <div className="p-8 text-center text-white/40 text-sm">No messages found.</div>
          )}
        </div>
      </div>
      
      {/* Detail View - Mobile: Full screen when message selected, Desktop: Always visible */}
      <div className={`flex-1 flex-col bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] backdrop-blur-md overflow-hidden relative ${activeMessageId ? 'flex' : 'hidden lg:flex'}`}>
        {/* Toolbar */}
        {activeMessage ? (
        <>
            <div className="p-2 md:p-4 border-b border-white/20 dark:border-white/10 flex justify-between items-center bg-black/20">
            <div className="flex gap-1 md:gap-2 items-center">
                {/* Mobile Back Button */}
                <button onClick={() => setActiveMessageId(null)} className="p-1.5 md:p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-[6px] transition-colors lg:hidden" title="Back">
                   <ArrowLeft size={16} />
                </button>
                <button onClick={() => handleArchive(activeMessage.id)} className="p-1.5 md:p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-[6px] transition-colors" title="Archive"><Archive size={14} className="md:w-[18px] md:h-[18px]" /></button>
                <button onClick={() => handleDelete(activeMessage.id)} className="p-1.5 md:p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-[6px] transition-colors" title="Delete"><Trash2 size={14} className="md:w-[18px] md:h-[18px]" /></button>
                <div className="w-[1px] h-4 md:h-6 bg-white/10 mx-1 md:mx-2" />
                <button onClick={(e) => handleReadToggle(activeMessage.id)} className="p-1.5 md:p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-[6px] transition-colors" title={activeMessage.unread ? "Mark as Read" : "Mark as Unread"}>
                    {activeMessage.unread ? <MailOpen size={14} className="md:w-[18px] md:h-[18px]" /> : <Mail size={14} className="md:w-[18px] md:h-[18px]" />}
                </button>
                <button onClick={(e) => handleStarToggle(activeMessage.id)} className={`p-1.5 md:p-2 hover:bg-white/10 rounded-[6px] transition-colors ${activeMessage.starred ? "text-gold" : "text-white/60 hover:text-gold"}`} title="Star">
                    <Star size={14} className={`md:w-[18px] md:h-[18px] ${activeMessage.starred ? "fill-gold" : ""}`} />
                </button>
            </div>
            <button className="p-1.5 md:p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-[6px]"><MoreVertical size={14} className="md:w-[18px] md:h-[18px]" /></button>
            </div>
            
            {/* Message Content */}
            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-4 md:mb-8">
                <div className="flex gap-2 md:gap-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border font-bold text-sm md:text-lg shrink-0 ${activeMessage.color}`}>
                    {activeMessage.avatar}
                    </div>
                    <div className="min-w-0">
                    <h2 className="text-sm md:text-xl font-bold text-white leading-tight">{activeMessage.subject}</h2>
                    <div className="flex flex-wrap items-center gap-1 md:gap-2 text-[10px] md:text-sm text-white/60 mt-1">
                        <span className="text-white">{activeMessage.sender}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="truncate">&lt;{activeMessage.email}&gt;</span>
                    </div>
                    </div>
                </div>
                <span className="text-[10px] md:text-sm text-white/40 shrink-0">{activeMessage.date}</span>
                </div>
                
                <div className="text-white/80 leading-relaxed text-xs md:text-sm space-y-3 md:space-y-4 max-w-3xl border-t border-white/5 pt-4 md:pt-8">
                <p>Hi team,</p>
                <p>{activeMessage.preview}</p>
                <p>I would appreciate a quick response.</p>
                <p>Best,<br/>{activeMessage.sender.split(' ')[0]}</p>
                </div>
                
                {/* Reply Section */}
                <div className="mt-4 md:mt-8 pt-4 md:pt-8 border-t border-white/20 dark:border-white/10">
                   <div className="flex flex-col gap-3 md:gap-4">
                      <h4 className="text-[10px] md:text-sm font-bold text-white/60 uppercase flex items-center gap-1 md:gap-2"><Reply size={12} className="md:w-3.5 md:h-3.5" /> Reply to {activeMessage.sender.split(' ')[0]}</h4>
                      <textarea 
                         value={replyText}
                         onChange={(e) => setReplyText(e.target.value)}
                         placeholder="Type your response here..." 
                         className="w-full h-24 md:h-32 bg-black/20 border border-white/20 dark:border-white/10 rounded-[10px] p-3 md:p-4 text-white text-xs md:text-sm outline-none focus:border-gold/50 resize-none"
                      />
                      <div className="flex justify-end">
                         <button 
                             onClick={handleSendReply}
                             disabled={!replyText || isReplying}
                             className={`bg-gold text-black font-bold px-4 py-1.5 md:px-6 md:py-2 rounded-[8px] flex items-center gap-1 md:gap-2 hover:bg-white transition-colors text-[10px] md:text-sm ${(!replyText || isReplying) ? 'opacity-50 cursor-not-allowed' : ''}`}
                         >
                            {isReplying ? (
                                <>Sending...</>
                            ) : (
                                <><Send size={12} className="md:w-4 md:h-4" /> Send Reply</>
                            )}
                         </button>
                      </div>
                   </div>
                </div>
            </div>
        </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/40 gap-3 md:gap-4 p-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/30 dark:bg-white/5 flex items-center justify-center">
                 <Mail size={24} className="md:w-8 md:h-8" />
            </div>
            <p className="text-xs md:text-base">Select a message to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
