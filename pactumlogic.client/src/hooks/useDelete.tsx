import { useState } from "react";
import { deleteEntity, type EntityType } from "../utils/deleteUtil";
import ConfirmModal from "../components/common/ConfirmModal";


export const useDelete = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteData, setDeleteData] = useState<{
    type: EntityType;
    id: number;
    name: string;
    onSuccess?: () => void;
  } | null>(null);

  const openDeleteModal = (
    type: EntityType,
    id: number,
    name: string,
    onSuccess?: () => void
  ) => {
    setDeleteData({ type, id, name, onSuccess });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteData) return;

    setIsLoading(true);
    await deleteEntity(
      deleteData.type,
      deleteData.id,
      () => {
        deleteData.onSuccess?.();
        setIsModalOpen(false);
        setDeleteData(null);
      },
      (error) => {
        console.error("Delete error:", error);
        alert("Chyba pri mazaní");
      }
    );
    setIsLoading(false);
  };

  const Modal = () => (
    <ConfirmModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onConfirm={handleDelete}
      title='Zmazať položku'
      message={`Naozaj chcete zmazať "${deleteData?.name}"?`}
      isLoading={isLoading}
    />
  );

  return { openDeleteModal, Modal };
};
