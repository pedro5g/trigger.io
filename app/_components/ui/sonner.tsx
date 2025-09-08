"use client";

import { useTheme } from "next-themes";
import {
  Toaster as Sonner,
  ToasterProps,
  toast as sonnerToast,
  type ExternalToast,
} from "sonner";
import { LORDICON_THEMES } from "@/constants";
import { AnimateIcon } from "../animate-icons/animation-icon";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <>
      <style jsx global>{`
        [data-sonner-toast] {
          background: rgba(15, 23, 42, 0.95) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.05) !important;
          font-weight: 500 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        [data-sonner-toast]:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.4) !important;
        }

        [data-sonner-toast][data-type="success"] {
          background: linear-gradient(
            135deg,
            rgba(34, 197, 94, 0.1) 0%,
            rgba(21, 128, 61, 0.05) 50%,
            rgba(15, 23, 42, 0.95) 100%
          ) !important;
          border-color: rgba(34, 197, 94, 0.2) !important;
          color: #f0fdf4 !important;
        }

        [data-sonner-toast][data-type="success"] [data-title] {
          color: #bbf7d0 !important;
        }

        [data-sonner-toast][data-type="success"] [data-description] {
          color: rgba(134, 239, 172, 0.8) !important;
        }

        [data-sonner-toast][data-type="error"] {
          background: linear-gradient(
            135deg,
            rgba(239, 68, 68, 0.1) 0%,
            rgba(185, 28, 28, 0.05) 50%,
            rgba(15, 23, 42, 0.95) 100%
          ) !important;
          border-color: rgba(239, 68, 68, 0.2) !important;
          color: #fef2f2 !important;
        }

        [data-sonner-toast][data-type="error"] [data-title] {
          color: #fecaca !important;
        }

        [data-sonner-toast][data-type="error"] [data-description] {
          color: rgba(252, 165, 165, 0.8) !important;
        }

        [data-sonner-toast][data-type="warning"] {
          background: linear-gradient(
            135deg,
            rgba(245, 158, 11, 0.1) 0%,
            rgba(180, 83, 9, 0.05) 50%,
            rgba(15, 23, 42, 0.95) 100%
          ) !important;
          border-color: rgba(245, 158, 11, 0.2) !important;
          color: #fffbeb !important;
        }

        [data-sonner-toast][data-type="warning"] [data-title] {
          color: #fed7aa !important;
        }

        [data-sonner-toast][data-type="warning"] [data-description] {
          color: rgba(253, 186, 116, 0.8) !important;
        }

        [data-sonner-toast][data-type="info"] {
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.1) 0%,
            rgba(29, 78, 216, 0.05) 50%,
            rgba(15, 23, 42, 0.95) 100%
          ) !important;
          border-color: rgba(59, 130, 246, 0.2) !important;
          color: #eff6ff !important;
        }

        [data-sonner-toast][data-type="info"] [data-title] {
          color: #bfdbfe !important;
        }

        [data-sonner-toast][data-type="info"] [data-description] {
          color: rgba(147, 197, 253, 0.8) !important;
        }

        [data-sonner-toast][data-type="loading"] {
          background: linear-gradient(
            135deg,
            rgba(156, 163, 175, 0.1) 0%,
            rgba(107, 114, 128, 0.05) 50%,
            rgba(15, 23, 42, 0.95) 100%
          ) !important;
          border-color: rgba(156, 163, 175, 0.2) !important;
          color: #f1f5f9 !important;
        }

        [data-sonner-toast][data-type="loading"] [data-title] {
          color: #e2e8f0 !important;
        }

        [data-sonner-toast][data-type="loading"] [data-description] {
          color: rgba(203, 213, 225, 0.8) !important;
        }

        [data-sonner-toast]:not([data-type]) {
          background: linear-gradient(
            135deg,
            rgba(156, 163, 175, 0.1) 0%,
            rgba(107, 114, 128, 0.05) 50%,
            rgba(15, 23, 42, 0.95) 100%
          ) !important;
          border-color: rgba(156, 163, 175, 0.2) !important;
          color: #f9fafb !important;
        }

        [data-sonner-toast]:not([data-type]) [data-title] {
          color: #e5e7eb !important;
        }

        [data-sonner-toast]:not([data-type]) [data-description] {
          color: rgba(209, 213, 219, 0.8) !important;
        }

        [data-sonner-toast] [data-close-button] {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: rgba(255, 255, 255, 0.7) !important;
          border-radius: 6px !important;
          transition: all 0.2s ease !important;
        }

        [data-sonner-toast] [data-close-button]:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          color: rgba(255, 255, 255, 0.9) !important;
          transform: scale(1.05) !important;
        }

        [data-sonner-toast] [data-title] {
          font-weight: 600 !important;
          font-size: 0.875rem !important;
        }

        [data-sonner-toast] [data-description] {
          font-size: 0.75rem !important;
          opacity: 0.9 !important;
        }

        @media (max-width: 640px) {
          [data-sonner-toast] {
            border-radius: 8px !important;
            margin: 0 16px !important;
          }
        }
      `}</style>

      <Sonner
        theme={theme as ToasterProps["theme"]}
        className="toaster group"
        closeButton
        expand={false}
        richColors={false}
        {...props}
      />
    </>
  );
};

export type ExternalToastWithoutDescription = Omit<
  ExternalToast,
  "description"
>;

const toast = {
  success(
    title: string,
    description?: string,
    overwrite?: ExternalToastWithoutDescription,
  ) {
    sonnerToast.success(title, {
      description,
      ...overwrite,
      icon: (
        <AnimateIcon
          src="success"
          size={20}
          colors={LORDICON_THEMES.success}
          speed={0.5}
          trigger="mount"
        />
      ),
    });
  },

  error(
    title: string,
    description?: string,
    overwrite?: ExternalToastWithoutDescription,
  ) {
    sonnerToast.error(title, {
      description,
      ...overwrite,
      icon: (
        <AnimateIcon
          src="close"
          size={20}
          colors={LORDICON_THEMES.error}
          speed={0.5}
          trigger="mount"
        />
      ),
    });
  },

  warning(
    title: string,
    description?: string,
    overwrite?: ExternalToastWithoutDescription,
  ) {
    sonnerToast.warning(title, {
      description,
      icon: (
        <AnimateIcon
          src="warning"
          size={20}
          colors={LORDICON_THEMES.warning}
          speed={0.5}
          trigger="mount"
        />
      ),
    });
  },

  info(
    title: string,
    description?: string,
    overwrite?: ExternalToastWithoutDescription,
  ) {
    sonnerToast.info(title, {
      description,
      ...overwrite,
      icon: (
        <AnimateIcon
          src="error"
          size={20}
          colors={LORDICON_THEMES.default}
          speed={0.5}
          trigger="mount"
        />
      ),
    });
  },

  default(
    title: string,
    description?: string,
    overwrite?: ExternalToastWithoutDescription,
  ) {
    sonnerToast(title, { description, ...overwrite });
  },

  loading(
    title: string,
    description?: string,
    overwrite?: ExternalToastWithoutDescription,
  ) {
    return sonnerToast.loading(title, { description, ...overwrite });
  },

  dismiss: (toastId?: string | number) => sonnerToast.dismiss(toastId),
  dismissAll: () => sonnerToast.dismiss(),
};

export { Toaster, toast };
