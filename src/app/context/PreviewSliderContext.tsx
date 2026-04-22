"use client";
import React, { createContext, useContext, useState } from "react";

interface PreviewSliderType {
  isModalPreviewOpen: boolean;
  openPreviewModal: (id: number) => void;
  closePreviewModal: () => void;
  productId: number | null;
}

const PreviewSlider = createContext<PreviewSliderType | undefined>(undefined);

export const usePreviewSlider = () => {
  const context = useContext(PreviewSlider);
  if (!context) {
    throw new Error("usePreviewSlider must be used within a ModalProvider");
  }
  return context;
};

export const PreviewSliderProvider = ({ children }) => {
  const [isModalPreviewOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState<number | null>(null);

  const openPreviewModal = (id: number) => {
    setIsModalOpen(true);
    setProductId(id);
  };

  const closePreviewModal = () => {
    setIsModalOpen(false);
    setProductId(null);
  };

  return (
    <PreviewSlider.Provider
      value={{ isModalPreviewOpen, openPreviewModal, closePreviewModal, productId }}
    >
      {children}
    </PreviewSlider.Provider>
  );
};
