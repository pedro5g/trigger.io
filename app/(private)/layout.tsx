import { ModalProvider } from "../_components/modals/modal-provider";
import { AppSidebar } from "../_components/sidebar/app-sidebar";
import { Separator } from "../_components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../_components/ui/sidebar";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="border-l-2 bg-gradient-to-br from-gray-950/20 via-gray-900/30 to-blue-950/20 md:peer-data-[variant=inset]:m-0 md:peer-data-[variant=inset]:rounded-none">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 bg-gradient-to-br bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:82px_82px]"
        />
        <header className="z-10 flex h-12 shrink-0 items-center gap-2 border-b-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <div className="z-10 flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
      <ModalProvider />
    </SidebarProvider>
  );
}
