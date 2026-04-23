"use client";
import React, { createContext, useContext, useState } from "react";

interface PreviewSliderType {
  isModalPreviewOpen: boolean;
  openPreviewModal: (id: number, activeVariantIndex?: number) => void;
  closePreviewModal: () => void;
  productId: number | null;
  activeVariantIndex: number;
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
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);

  const openPreviewModal = (id: number, activeVariantIndex: number = 0) => {
    setIsModalOpen(true);
    setProductId(id);
    setActiveVariantIndex(activeVariantIndex);
  };

  const closePreviewModal = () => {
    setIsModalOpen(false);
    setProductId(null);
    setActiveVariantIndex(0);
  };

  return (
    <PreviewSlider.Provider
      value={{ isModalPreviewOpen, openPreviewModal, closePreviewModal, productId, activeVariantIndex }}
    >
      {children}
    </PreviewSlider.Provider>
  );
};
