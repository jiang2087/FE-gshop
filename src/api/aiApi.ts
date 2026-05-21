import api from "./axiosInstace";

export const chatWithRAG = async (query: string, limit: number = 2) => {
  try {
    const response = await api.get("/chat/rag", {
      params: {
        q: query,
        limit: limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error calling RAG AI API:", error);
    throw error;
  }
};


export const deleteConversation = async (conversationId: string) => {
  try {
    const response = await api.delete("/chat/rag/conversations", {
      params: { conversationId },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting conversation:", error);
    throw error;
  }
};

export const chatWithAI = async (
  query: string,
  limit: number = 2,
  conversationId?: string,
) => {
  try {
    const response = await api.post("/chat/rag", {
      ...(conversationId ? { conversationId } : {}),
      query,
      limit,
    });

    return response.data;
  } catch (error) {
    console.error("Error calling RAG AI API:", error);
    throw error;
  }
};