import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, type ReactNode } from "react";

type ModalSize = "sm" | "md" | "lg" | "xl";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
  colorBar?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  colorBar,
}: ModalProps) => {
  useEffect(() => {
    // Close on ESC
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full rounded-2xl bg-white shadow-xl ${sizeClasses[size]} overflow-hidden`}
      >
        {/* Optional color bar */}
        {colorBar && (
          <div
            className="h-2 transition-colors duration-300"
            style={{ backgroundColor: colorBar }}
          />
        )}

        <div className="p-6">
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="mb-6 flex items-center justify-between">
              {title && (
                <h2 className="text-xl font-semibold text-content">{title}</h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="ml-auto cursor-pointer rounded-lg p-2 transition-colors hover:bg-surface"
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="text-content-secondary"
                  />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
