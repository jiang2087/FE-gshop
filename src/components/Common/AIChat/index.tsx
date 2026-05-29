"use client";
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, RotateCcw, ExternalLink } from "lucide-react";
import Link from "next/link";
import "./AIChat.css";
import { useAppSelector } from "@/redux/store";
import { RootState } from "@/redux/store";
import { chatWithAI, deleteConversation } from "@/api/aiApi";
import { getProductById } from "@/api/productApi";
import ReactMarkdown from "react-markdown"; 
import remarkGfm from "remark-gfm";

// Compact product card – view only, no cart / wishlist
const AIProductCard = ({ product }: { product: any }) => {
  const variant = product?.productVariants?.[0];
  const image = variant?.image || "";
  const originalPrice = variant?.originalPrice || 0;
  const discountedPrice = variant?.discountedPrice || 0;
  const hasDiscount = discountedPrice > 0 && discountedPrice < originalPrice;
  const displayPrice = hasDiscount ? discountedPrice : originalPrice;

  return (
    <Link href={`/products?id=${product.id}`} className="ai-product-card" target="_blank" rel="noopener noreferrer">
      <div className="ai-product-card-img-wrap">
        {image ? (
          <img src={image} alt={product.name} className="ai-product-card-img" />
        ) : (
          <div className="ai-product-card-img-placeholder" />
        )}
        {hasDiscount && (
          <span className="ai-product-card-badge">
            -{Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)}%
          </span>
        )}
      </div>
      <div className="ai-product-card-body">
        <p className="ai-product-card-name">{product.name}</p>
        <div className="ai-product-card-price-row">
          <span className="ai-product-card-price">${displayPrice}</span>
          {hasDiscount && (
            <span className="ai-product-card-original">${originalPrice}</span>
          )}
        </div>
        <span className="ai-product-card-link">
          Xem chi tiết <ExternalLink size={12} />
        </span>
      </div>
    </Link>
  );
};

interface Message {
  id: number;
  text: string;
  sender: "ai" | "user";
  timestamp: Date;
  products?: any[];
}

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Xin chào! Tôi là trợ lý AI của G-Shop. Tôi có thể giúp gì cho bạn hôm nay?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const user = useAppSelector((state: RootState) => state.auth.user);

  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [isResetting, setIsResetting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReset = async () => {
    if (isResetting) return;
    setIsResetting(true);

    // Delete server-side conversation if one exists
    if (conversationId) {
      try {
        await deleteConversation(conversationId);
      } catch (e) {
        console.error("Could not delete server conversation:", e);
      }
    }

    setMessages([
      {
        id: Date.now(),
        text: "Xin chào! Tôi là trợ lý AI của G-Shop. Tôi có thể giúp gì cho bạn hôm nay?",
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
    setInputValue("");
    setIsTyping(false);
    setConversationId(undefined);
    setIsResetting(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    const newMessage: Message = {
      id: Date.now(),
      text: userMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await chatWithAI(userMessage, 2, conversationId);

      // Persist conversationId returned from server for subsequent turns
      if (response.conversationId) {
        setConversationId(response.conversationId);
      }

      const productsData = [];
      if (response.products && response.products.length > 0) {
        const topProducts = response.products.slice(0, 2);
        for (const p of topProducts) {
          try {
            const pData = await getProductById(p.id);
            if (pData) {
              productsData.push(pData);
            }
          } catch (e) {
            console.error("Fetch product error:", e);
          }
        }
      }

      const aiResponse: Message = {
        id: Date.now() + 1,
        text: response.answer || "Xin lỗi, tôi không tìm thấy thông tin phù hợp.",
        sender: "ai",
        timestamp: new Date(),
        products: productsData
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      const errorResponse: Message = {
        id: Date.now() + 1,
        text: "Đã có lỗi xảy ra khi kết nối với máy chủ AI. Vui lòng thử lại sau.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="ai-chat-container">
      {/* Chat Window */}
      <div className={`ai-chat-window ${isOpen ? "" : "hidden"}`}>
        <div className="ai-chat-header">
          <div className="ai-chat-header-info">
            <div className="ai-avatar">
              <Bot size={24} />
            </div>
            <div className="ai-status">
              <span className="ai-status-name">G-Shop AI</span>
              <div className="ai-status-dot">
                <div className="dot"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handleReset}
              title="Xóa & làm mới cuộc trò chuyện"
              disabled={isResetting}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: isResetting ? 'not-allowed' : 'pointer',
                display: 'flex',
                opacity: isResetting ? 0.5 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              <RotateCcw size={18} style={{ animation: isResetting ? 'spin 1s linear infinite' : 'none' }} />
            </button>
            <button className="close-btn" onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="ai-chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-container ${msg.sender}`}>
              <div className="message-icon">
                {msg.sender === "ai" ? (
                  <Bot size={18} />
                ) : user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="User"
                    className="user-avatar-img"
                  />
                ) : (
                  <User size={18} />
                )}
              </div>
              <div className={`message ${msg.sender}`}>
                <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    table: ({ children }) => (
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full my-4">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-gray-300 px-4 py-2 text-left">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-gray-300 px-4 py-2">
        {children}
      </td>
    ),
  }}
>
  {Array.isArray(msg.text) ? msg.text.join("\n") : msg.text}
</ReactMarkdown>
                {msg.sender === "ai" && msg.products && msg.products.length > 0 && (
                  <div className="ai-products-section">
                    <p className="ai-products-title">Sản phẩm gợi ý:</p>
                    <div className="ai-products-list">
                      {msg.products.map((p: any) => (
                        <AIProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message-container ai">
              <div className="message-icon">
                <Bot size={18} />
              </div>
              <div className="message ai">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-chat-input-area">
          <input
            type="text"
            className="ai-chat-input"
            placeholder="Nhập tin nhắn..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="ai-chat-send" onClick={handleSend}>
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Floating Button */}
      <button
        className="ai-chat-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Mở chat AI"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default AIChat;
