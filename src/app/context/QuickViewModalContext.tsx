"use client";
import React, { createContext, useContext, useState } from "react";

interface ModalContextType {
  isModalOpen: boolean;
  openModal: (id: number | null) => void;
  closeModal: () => void;
  selectedProductId: number | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );

  const openModal = (id: number | null) => {
    setSelectedProductId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{ isModalOpen, openModal, closeModal, selectedProductId }}
    >
      {children}
    </ModalContext.Provider>
  );
};
