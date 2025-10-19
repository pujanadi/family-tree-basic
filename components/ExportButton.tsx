import { useState } from "react";

interface ExportButtonProps {
  onExport: () => Promise<void>;
  disabled?: boolean;
}

const ExportButton = ({ onExport, disabled }: ExportButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading || disabled) {
      return;
    }

    try {
      setIsLoading(true);
      await onExport();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isLoading}
      className="inline-flex items-center gap-2 rounded-md bg-misty-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-misty-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-misty-teal-300 disabled:cursor-not-allowed disabled:bg-misty-teal-300 dark:focus-visible:ring-offset-0"
    >
      <svg
        className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        {isLoading ? (
          <circle cx="12" cy="12" r="9" strokeDasharray="45 15" />
        ) : (
          <>
            <path d="M6 8v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 4v9" strokeLinecap="round" />
            <path d="M8.5 10.5 12 14l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
      </svg>
      {isLoading ? "Preparing…" : "Export PNG"}
    </button>
  );
};

export default ExportButton;
