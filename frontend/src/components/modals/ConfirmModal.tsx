import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  icon?: IconDefinition;
  isLoading?: boolean;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  icon,
  isLoading = false,
}: ConfirmModalProps) => {
  const variantStyles = {
    danger: {
      iconBg: "bg-danger/10",
      iconColor: "text-danger",
      buttonBg: "bg-danger hover:bg-danger/90",
    },
    warning: {
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
      buttonBg: "bg-warning hover:bg-warning/90",
    },
    info: {
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
      buttonBg: "bg-accent hover:bg-accent-hover",
    },
  };

  const styles = variantStyles[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        {icon && (
          <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${styles.iconBg}`}>
            <FontAwesomeIcon icon={icon} className={`text-2xl ${styles.iconColor}`} />
          </div>
        )}

        <h3 className="mb-2 text-lg font-semibold text-content">{title}</h3>
        <p className="mb-6 text-sm text-content-secondary">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-medium text-content transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 ${styles.buttonBg}`}
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                Deleting...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
