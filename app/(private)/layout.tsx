import { BackgroundIcon, Divider } from "../_components/icons/background-icon";
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
      <SidebarInset className="border-l-2 bg-zinc-950 md:peer-data-[variant=inset]:m-0 md:peer-data-[variant=inset]:rounded-none">
        <header className="z-10 flex h-12 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <div className="z-10 flex flex-1 flex-col gap-4 pt-0">
          <div className="relative flex w-full flex-1 flex-col overflow-hidden">
            <div className="relative inline-flex w-full border-b border-dashed border-zinc-200/20 [mask-image:linear-gradient(to_right,transparent,black,transparent)] [mask-size:100%_100%] [mask-repeat:no-repeat]">
              <div
                aria-hidden={true}
                className="animate-conductorX pointer-events-none absolute inset-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />

              <div className="relative mx-auto inline-flex h-14 w-full max-w-6xl items-end border-x border-dashed border-zinc-200/5">
                <div
                  aria-hidden={true}
                  className="animate-conductorX pointer-events-none absolute inset-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
                <BackgroundIcon className="animate-fade-in absolute -start-10 top-4 transition-[opacity_scale] delay-100 [&>path]:stroke-zinc-200/30" />
                <div className="mx-auto h-5 w-full max-w-md border-x border-dashed border-zinc-200/9" />
              </div>
            </div>

            <main className="mx-auto w-full max-w-6xl border-x border-dashed border-zinc-200/5 px-6 py-8">
              {children}
            </main>

            <div className="relative inline-flex w-full flex-1 border-t border-dashed border-zinc-200/5">
              <div className="animate-conductorX pointer-events-none absolute inset-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="relative mx-auto inline-flex w-full max-w-6xl flex-1 items-start border-x border-dashed border-zinc-200/8">
                <div className="animate-conductorY pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                <BackgroundIcon className="animate-fade-in absolute -end-10 -top-8 rotate-180 transition-[opacity_scale] delay-150 [&>path]:stroke-zinc-200/20" />
                <Divider className="mx-auto [&>path]:stroke-zinc-200/45" />
                <div className="animate-conductorY pointer-events-none absolute inset-y-0 left-0 w-px -translate-y-1/1 bg-gradient-to-b from-transparent via-white/20 to-transparent delay-75" />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
      <ModalProvider />
    </SidebarProvider>
  );
}
