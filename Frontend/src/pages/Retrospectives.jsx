    import React, { useMemo, useState } from "react";
    import SideBar from "../components/Sidebar";
    import { useSelector } from "react-redux";
    import { ChevronDown, Send, ThumbsUp, Star, Trash2, Share2 } from "lucide-react";

    const QUESTIONS = [
    "What went well?",
    "What didn't go well?",
    "Action items for next sprint",
    ];

    const TAGS = ["Positive", "Negative", "Improvement", "Action Item", "Teamwork"];

    const initialFeedback = [
    { id: "r1", author: "Alice", text: "Sprint went smoothly.", tag: "Positive", likes: 2, starred: false, reviewed: false },
    { id: "r2", author: "Bob", text: "We faced blockers due to unclear requirements.", tag: "Negative", likes: 1, starred: false, reviewed: false },
    { id: "r3", author: "Charlie", text: "Need to improve communication.", tag: "Improvement", likes: 0, starred: false, reviewed: false },
    ];

    export default function Retrospectives() {
    const [selectedQuestion, setSelectedQuestion] = useState(QUESTIONS[0]);
    const [feedbacks, setFeedbacks] = useState(initialFeedback);
    const [activeId, setActiveId] = useState(feedbacks[0]?.id || null);
    const [composer, setComposer] = useState("");

    const active = useMemo(() => feedbacks.find(f => f.id === activeId) || null, [feedbacks, activeId]);
    const isOpen = useSelector((state) => state.sidebar.isOpen);

    const toggleReview = () => {
        if (!active) return;
        setFeedbacks(f => f.map(item => item.id === active.id ? { ...item, reviewed: !item.reviewed } : item));
    };
    const addLike = () => {
        if (!active) return;
        setFeedbacks(f => f.map(item => item.id === active.id ? { ...item, likes: item.likes + 1 } : item));
    };
    const toggleStar = () => {
        if (!active) return;
        setFeedbacks(f => f.map(item => item.id === active.id ? { ...item, starred: !item.starred } : item));
    };
    const setTag = (id, tag) => {
        setFeedbacks(f => f.map(item => item.id === id ? { ...item, tag } : item));
    };
    const handleSend = () => {
        if (!composer.trim()) return;
        const next = {
        id: `r${Date.now()}`,
        author: "Anonymous",
        text: composer.trim(),
        tag: selectedQuestion === QUESTIONS[0] ? "Positive" :
            selectedQuestion === QUESTIONS[1] ? "Negative" : "Action Item",
        likes: 0,
        starred: false,
        reviewed: false,
        };
        setFeedbacks([...feedbacks, next]);
        setComposer("");
        setActiveId(next.id);
    };
    const handleClearAll = () => {
        if (!window.confirm("Clear all retrospectives?")) return;
        setFeedbacks([]);
        setActiveId(null);
    };
    const handleShare = () => {
        window.alert("Retrospective shared with the team ✅");
    };

    return (
        <div className="flex min-h-screen bg-[#121212] text-white">
  <SideBar />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"}`}>
            <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sprint Retrospectives</h1>
      <div className="max-w-6xl mx-auto px-4">
                {/* Top controls */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                    <select
                        className="appearance-none bg-[#2a2a2a] text-gray-200 text-sm px-3 py-2 pr-8 rounded-lg outline-none"
                        value={selectedQuestion}
                        onChange={(e) => setSelectedQuestion(e.target.value)}
                    >
                        {QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <input
                    value={composer}
                    onChange={e => setComposer(e.target.value)}
                    placeholder="Add your feedback..."
                    className="bg-[#2a2a2a] text-sm rounded-lg px-3 py-2 text-gray-200 outline-none w-full sm:w-64"
                    />
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                    onClick={handleShare}
                    className="bg-green-600 text-white text-sm px-4 py-2 rounded-full hover:bg-green-500 flex items-center gap-2"
                    >
                    <Share2 size={16} /> Share
                    </button>
                    <button
                    onClick={handleClearAll}
                    className="bg-red-600 text-white text-sm px-4 py-2 rounded-full hover:bg-red-500"
                    >
                    Clear all
                    </button>
                </div>
                </div>

                {/* Body */}
                <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: feedback list */}
                <div className="lg:col-span-7 space-y-5">
                    <p className="text-sm text-gray-400">{feedbacks.length} feedbacks collected</p>
                    {feedbacks.map(f => (
                    <div
                        key={f.id}
                        className={`rounded-xl px-4 py-3 bg-[#232323] hover:bg-[#262626] transition cursor-pointer border ${activeId === f.id ? "border-green-500" : "border-transparent"}`}
                        onClick={() => setActiveId(f.id)}
                    >
                        <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <p className="text-sm text-gray-300">{f.text}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                            {TAGS.map(t => (
                                <button key={t} onClick={(e) => { e.stopPropagation(); setTag(f.id, t); }}
                                className={`text-[11px] px-2 py-1 rounded-full border ${f.tag === t ? "bg-green-700 border-green-600 text-white" : "bg-[#2b2b2b] border-transparent text-gray-300 hover:bg-[#333]"}`}>
                                {t}
                                </button>
                            ))}
                            </div>
                        </div>
                        </div>
                    </div>
                    ))}
                    {feedbacks.length === 0 && <div className="text-center text-gray-400 py-10">No feedback yet. Start adding retrospectives below.</div>}
                </div>

                {/* Right: selected feedback + actions */}
                <div className="lg:col-span-5">
                    <div className="rounded-2xl bg-[#232323] p-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400 flex items-center gap-3">
                        <span className="font-semibold">{active?.author || "Anonymous"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                        <button onClick={toggleReview} className="bg-[#2e2e2e] text-xs px-3 py-2 rounded-full hover:bg-[#3a3a3a]">Review</button>
                        <button onClick={addLike} className="bg-[#2e2e2e] p-2 rounded-full hover:bg-[#3a3a3a]"><ThumbsUp size={16} /></button>
                        <button onClick={toggleStar} className={`p-2 rounded-full hover:bg-[#3a3a3a] ${active?.starred ? "text-yellow-400" : "text-gray-200"}`}><Star size={16} /></button>
                        </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-[#1f1f1f] p-4">
                        {active ? (
                        <>
                            <p className="text-sm text-gray-300">{active.text}</p>
                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                            <span className={`px-2 py-1 rounded-full border ${active.reviewed ? "bg-green-700 border-green-600 text-white" : "bg-[#2b2b2b] border-transparent text-gray-300"}`}>
                                {active.reviewed ? "Reviewed" : "Not reviewed"}
                            </span>
                            <span className="px-2 py-1 rounded-full bg-[#2b2b2b] text-gray-300">{active.tag}</span>
                            <span className="px-2 py-1 rounded-full bg-[#2b2b2b] text-gray-300">{active.likes} like{active.likes === 1 ? "" : "s"}</span>
                            </div>
                        </>
                        ) : (
                        <p className="text-sm text-gray-400">Select a feedback…</p>
                        )}
                    </div>

                    {/* Footer composer */}
                    <div className="mt-4 flex items-center gap-2">
                        <input
                        value={composer}
                        onChange={(e) => setComposer(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Type your feedback..."
                        className="flex-1 bg-[#1a1a1a] rounded-full px-4 py-3 text-sm text-gray-200 outline-none"
                        />
                        <button onClick={handleSend} className="bg-green-600 hover:bg-green-500 rounded-full p-3" aria-label="Send"><Send size={18} /></button>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>      
        </div>
    );
    }
