import { useState } from "react";

const useResultModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("");
  const [modalData, setModalData] = useState({});

  const openModal = (type, modalData) => {
    setIsOpen(true);
    setType(type);
    setModalData(modalData);
  };

  const closeModal = () => {
    setIsOpen(false);
    setType("");
    setModalData({});
  };

  const setLoading = (loading) => {
    setIsOpen(prev => ({
      ...prev,
      loading
    }));
  };

  return {
    isOpen, setIsOpen,
    type, setType,
    modalData, setModalData,
    openModal,
    closeModal,
    setLoading,
  };
};

export default useResultModal;