import { useState, useEffect } from "react";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { LORDICON_THEMES } from "@/constants";
import { AnimateIcon } from "../animate-icons/animation-icon";

const DESKTOP_NOTIFICATIONS = [
  {
    id: 1,
    title: "New sale made!",
    message: "MacBook Pro M3 - R$ 12,999",
    icon: () => (
      <AnimateIcon
        src="cart"
        size={16}
        colors={LORDICON_THEMES.dark}
        speed={0.5}
        trigger="mount"
      />
    ),
    color: "bg-green-500",
    delay: 1000,
  },
  {
    id: 2,
    title: "Deploy completed",
    message: "Application updated successfully",
    icon: () => (
      <AnimateIcon
        src="code"
        size={16}
        colors={LORDICON_THEMES.dark}
        speed={0.5}
        trigger="mount"
      />
    ),
    color: "bg-blue-500",
    delay: 4000,
  },
  {
    id: 3,
    title: "Metrics updated",
    message: "CTR increased by 15% this week",
    icon: () => (
      <AnimateIcon
        src="increase"
        size={16}
        colors={LORDICON_THEMES.dark}
        speed={0.5}
        trigger="mount"
      />
    ),
    color: "bg-purple-500",
    delay: 7000,
  },
];

const TABLET_NOTIFICATIONS = [
  {
    id: 1,
    title: "New follower",
    message: "Maria Silva started following you",
    icon: () => (
      <AnimateIcon
        src="heart"
        size={16}
        colors={LORDICON_THEMES.dark}
        speed={0.5}
        trigger="mount"
      />
    ),
    color: "bg-pink-500",
    delay: 2000,
  },
  {
    id: 2,
    title: "Webhook triggered",
    message: "Payment event processed",
    icon: () => (
      <AnimateIcon
        src="thunderbolt"
        size={16}
        colors={LORDICON_THEMES.dark}
        speed={0.5}
        trigger="mount"
      />
    ),
    color: "bg-yellow-500",
    delay: 5000,
  },
  {
    id: 3,
    title: "Users online",
    message: "1.2k active users now",
    icon: () => (
      <AnimateIcon
        src="user"
        size={16}
        colors={LORDICON_THEMES.dark}
        speed={0.5}
        trigger="mount"
      />
    ),
    color: "bg-indigo-500",
    delay: 8000,
  },
];

const MOBILE_NOTIFICATIONS = [
  {
    id: 1,
    title: "Message received",
    message: "João: When is the new feature coming?",
    icon: () => (
      <AnimateIcon
        src="message"
        size={16}
        colors={LORDICON_THEMES.dark}
        speed={0.5}
        trigger="mount"
      />
    ),
    color: "bg-blue-500",
    delay: 3000,
  },
  {
    id: 2,
    title: "Reminder",
    message: "Meeting in 15 minutes",
    icon: () => (
      <AnimateIcon
        src="bell"
        size={16}
        colors={LORDICON_THEMES.dark}
        speed={0.5}
        trigger="mount"
      />
    ),
    color: "bg-orange-500",
    delay: 6000,
  },
  {
    id: 3,
    title: "System updated",
    message: "Version 2.1.0 is now available",
    icon: () => (
      <AnimateIcon
        src="code"
        size={16}
        colors={LORDICON_THEMES.dark}
        speed={0.5}
        trigger="mount"
      />
    ),
    color: "bg-green-500",
    delay: 9000,
  },
];

const RenderDesktop = ({
  notifications,
}: {
  notifications: typeof DESKTOP_NOTIFICATIONS;
}) => (
  <div className="relative">
    <div className="absolute -bottom-6 left-1/2 h-6 w-24 -translate-x-1/2 transform rounded-b-lg bg-gradient-to-b from-gray-600 to-gray-700 shadow-lg"></div>
    <div className="absolute -bottom-8 left-1/2 h-2 w-32 -translate-x-1/2 transform rounded-full bg-gray-800 shadow-lg"></div>

    <div className="relative h-64 w-96 overflow-hidden rounded-lg border-4 border-gray-800 bg-black shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black p-2">
        <div className="relative h-full w-full overflow-hidden rounded bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
            <div className="flex items-center space-x-2">
              <Monitor className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">Desktop</span>
            </div>
            <div className="flex space-x-1">
              <div className="h-3 w-3 rounded-full bg-red-500 shadow-sm"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500 shadow-sm"></div>
              <div className="h-3 w-3 rounded-full bg-green-500 shadow-sm"></div>
            </div>
          </div>

          <div className="space-y-3 p-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-gray-700 bg-gray-800 p-3 text-center">
                <div className="text-lg font-bold text-white">1.2M</div>
                <div className="text-xs text-gray-400">Notifications</div>
              </div>
              <div className="rounded-lg border border-gray-700 bg-gray-800 p-3 text-center">
                <div className="text-lg font-bold text-white">99.9%</div>
                <div className="text-xs text-gray-400">Delivered</div>
              </div>
              <div className="rounded-lg border border-gray-700 bg-gray-800 p-3 text-center">
                <div className="text-lg font-bold text-white">2.4k</div>
                <div className="text-xs text-gray-400">Actives</div>
              </div>
            </div>
          </div>

          <div className="absolute top-16 right-4 left-4 space-y-2">
            {notifications.map((notification, i) => {
              const IconComponent = notification.icon;
              return (
                <div
                  key={`${notification.id}-${i}`}
                  className="animate-pulse rounded-lg border border-gray-600 bg-gray-800 p-3 shadow-lg backdrop-blur-sm transition-all duration-300"
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`h-8 w-8 rounded-full ${notification.color} flex flex-shrink-0 items-center justify-center`}
                    >
                      <IconComponent />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {notification.title}
                      </p>
                      <p className="truncate text-sm text-gray-400">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RenderTablet = ({
  notifications,
}: {
  notifications: typeof DESKTOP_NOTIFICATIONS;
}) => (
  <div className="relative h-80 w-72 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 p-4 shadow-2xl sm:h-96">
    <div className="absolute bottom-2 left-1/2 h-1 w-32 -translate-x-1/2 transform rounded-full bg-gray-600"></div>

    <div className="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
        <div className="flex items-center space-x-2">
          <Tablet className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-medium text-gray-300">iPad</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-2 w-4 rounded-sm bg-green-500"></div>
          <span className="text-xs text-gray-400">100%</span>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-gray-700 bg-gray-800 p-4 text-center">
            <div className="text-xl font-bold text-white">847k</div>
            <div className="text-xs text-gray-400">Sending</div>
          </div>
          <div className="rounded-xl border border-gray-700 bg-gray-800 p-4 text-center">
            <div className="text-xl font-bold text-white">98.2%</div>
            <div className="text-xs text-gray-400">Free</div>
          </div>
        </div>
      </div>

      <div className="absolute top-16 right-4 left-4 space-y-2">
        {notifications.map((notification, i) => {
          const IconComponent = notification.icon;
          return (
            <div
              key={`${notification.id}-${i}`}
              className="animate-pulse rounded-xl border border-gray-600 bg-gray-800 p-3 shadow-lg backdrop-blur-sm transition-all duration-300"
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`h-8 w-8 rounded-full ${notification.color} flex flex-shrink-0 items-center justify-center`}
                >
                  <IconComponent />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {notification.title}
                  </p>
                  <p className="truncate text-sm text-gray-400">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

const RenderMobile = ({
  notifications,
}: {
  notifications: typeof DESKTOP_NOTIFICATIONS;
}) => (
  <div className="relative h-[22rem] w-44 rounded-[2.5rem] bg-black p-2 shadow-2xl sm:h-[28rem] sm:w-56">
    <div className="absolute top-0 left-1/2 z-10 h-6 w-24 -translate-x-1/2 transform rounded-b-2xl bg-black sm:w-32"></div>

    <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex items-center justify-between bg-gray-900 px-6 pt-8 pb-2">
        <div className="flex items-center space-x-2">
          <Smartphone className="h-4 w-4 text-green-400" />
          <span className="text-sm font-medium text-gray-300">iPhone</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="h-1 w-1 rounded-full bg-white"></div>
            <div className="h-1 w-1 rounded-full bg-white"></div>
            <div className="h-1 w-1 rounded-full bg-gray-500"></div>
          </div>
          <div className="ml-2 h-3 w-6 rounded-sm bg-green-500"></div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-gray-700 bg-gray-800 p-3 text-center">
            <div className="text-lg font-bold text-white">523k</div>
            <div className="text-xs text-gray-400">Push</div>
          </div>
          <div className="rounded-2xl border border-gray-700 bg-gray-800 p-3 text-center">
            <div className="text-lg font-bold text-white">94.8%</div>
            <div className="text-xs text-gray-400">Opens</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 left-1/2 h-1 w-32 -translate-x-1/2 transform rounded-full bg-gray-600"></div>

      <div className="absolute top-24 right-4 left-4 space-y-2">
        {notifications.map((notification, i) => {
          const IconComponent = notification.icon;
          return (
            <div
              key={`${notification.id}-${i}`}
              className="animate-pulse rounded-2xl border border-gray-600 bg-gray-800 p-3 shadow-lg backdrop-blur-sm transition-all duration-300"
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`h-8 w-8 rounded-full ${notification.color} flex flex-shrink-0 items-center justify-center`}
                >
                  <IconComponent />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {notification.title}
                  </p>
                  <p className="truncate text-sm text-gray-400">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

function DeviceNotifications({
  notifications,
  deviceType,
  className,
}: {
  notifications: typeof DESKTOP_NOTIFICATIONS;
  deviceType: "desktop" | "tablet" | "mobile";
  className?: string;
}) {
  const [activeNotifications, setActiveNotifications] = useState<
    typeof notifications
  >([]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    const showNotifications = () => {
      notifications.forEach((notification) => {
        const showTimer = setTimeout(() => {
          setActiveNotifications((prev) => [...prev, notification]);

          const hideTimer = setTimeout(() => {
            setActiveNotifications((prev) =>
              prev.filter((n) => n.id !== notification.id),
            );
          }, 3500);

          timers.push(hideTimer);
        }, notification.delay);

        timers.push(showTimer);
      });
    };

    showNotifications();

    const cycleTimer = setInterval(() => {
      setActiveNotifications([]);
      showNotifications();
    }, 12000);

    timers.push(cycleTimer);

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [notifications]);

  const renderDevice = () => {
    switch (deviceType) {
      case "desktop":
        return <RenderDesktop notifications={activeNotifications} />;
      case "tablet":
        return <RenderTablet notifications={activeNotifications} />;
      case "mobile":
        return <RenderMobile notifications={activeNotifications} />;
      default:
        return null;
    }
  };

  return <div className={cn("relative", className)}>{renderDevice()}</div>;
}

interface MultiDeviceDemoProps {
  animating: boolean;
}

export function MultiDeviceDemo({ animating }: MultiDeviceDemoProps) {
  return (
    <div className="relative">
      <DeviceNotifications
        notifications={DESKTOP_NOTIFICATIONS}
        deviceType="desktop"
        className={cn(
          "absolute top-35 left-5 z-20 translate-y-12 opacity-0 transition-[transform_0.6s_,_opacity_0.9s] duration-1200 sm:top-32 sm:left-19",
          animating && "translate-y-0 opacity-100 delay-0",
        )}
      />

      <DeviceNotifications
        notifications={TABLET_NOTIFICATIONS}
        deviceType="tablet"
        className={cn(
          "absolute -top-10 left-40 z-10 -translate-x-12 opacity-0 transition-[transform_0.6s_,_opacity_0.9s] duration-1000 sm:top-1 sm:left-80",
          animating && "translate-x-0 opacity-100 delay-0",
        )}
      />

      <DeviceNotifications
        notifications={MOBILE_NOTIFICATIONS}
        deviceType="mobile"
        className={cn("absolute -left-3 z-10 sm:-top-20 sm:left-0")}
      />
      <div className="h-90 w-96"></div>
    </div>
  );
}
