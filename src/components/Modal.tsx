import { ReactNode, useEffect, useRef } from "react";
import { IModal } from "../types";

interface IModalProps extends IModal {
  headerContent?: ReactNode;
  mainContent: ReactNode;
}

const Modal = ({
  isVisible,
  closeModal,
  headerContent,
  mainContent,
}: IModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, closeModal]);

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-[3px]"
      onClick={handleClickOutside}
    >
      <div ref={modalRef} className="bg-white rounded-md w-[90%] max-w-md p-4">
        {headerContent && (
          <div className="border-b pb-2 mb-4">{headerContent}</div>
        )}
        <div>{mainContent}</div>
      </div>
    </div>
  );
};

export default Modal;
