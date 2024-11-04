import { forwardRef, ReactNode, RefObject, useEffect } from "react";
import { IModal } from "../types";

interface IModalOrigin extends IModal {
  headerContent?: ReactNode;
  mainContent: ReactNode;
}

const Modal = forwardRef<HTMLDivElement, IModalOrigin>((props, ref) => {
  const { isVisible, closeModal, mainContent, headerContent } = props;
  const modalRef = ref as RefObject<HTMLDivElement | null>;

  useEffect(() => {
    // only called inside *this* useEffect. so, moved the function inside it.
    const handleClickOutside = (event: MouseEvent) => {
      // concise and pragmatic way (the target will NODE)
      if (
        modalRef?.current &&
        !modalRef.current?.contains(event?.target as Node)
      ) {
        closeModal();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, closeModal, modalRef]);

  return (
    <>
      {isVisible && (
        <>
          {headerContent && headerContent}
          {mainContent && mainContent}
        </>
      )}
    </>
  );
});

export default Modal;
