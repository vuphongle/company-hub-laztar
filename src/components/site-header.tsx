"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowMark } from "@/components/arrow-mark";

function BrandContents() {
  return (
    <>
      <Image className="brand-mark" src="/brand-mark.webp" alt="" width={48} height={48} unoptimized />
      <span className="brand-copy">
        <strong>LAZTAR <em>/ Hub</em></strong>
        <small>play · build · share</small>
      </span>
    </>
  );
}

function Navigation({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="primary-nav" aria-label="Điều hướng chính">
      <Link href="/" aria-current={pathname === "/" ? "page" : undefined} onClick={onNavigate}>
        Projects <ArrowMark direction="down-right" />
      </Link>
      <Link href="/about" aria-current={pathname === "/about" ? "page" : undefined} onClick={onNavigate}>
        About
      </Link>
      <Link className="nav-feedback" href="/feedback" aria-current={pathname === "/feedback" ? "page" : undefined} onClick={onNavigate}>
        Góp ý <ArrowMark />
      </Link>
      <Link className="nav-admin" href="/admin" aria-current={pathname.startsWith("/admin") ? "page" : undefined} onClick={onNavigate}>
        Admin
      </Link>
    </nav>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const unlockRef = useRef<(() => void) | undefined>(undefined);

  function openMenu() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    // A native close event can arrive after a rapid reopen.
    unlockRef.current?.();
    animationRef.current?.cancel();
    delete dialog.dataset.closing;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    unlockRef.current = () => { root.style.overflow = overflow; };
    dialog.showModal();
    setOpen(true);
    dialog.querySelector<HTMLAnchorElement>("nav a")?.focus({ preventScroll: true });
  }

  function closeMenu() {
    const dialog = dialogRef.current;
    if (!dialog?.open || dialog.dataset.closing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialog.close();
      return;
    }
    dialog.dataset.closing = "true";
    const animation = dialog.animate(
      [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(-12px)" }],
      { duration: 180, easing: "cubic-bezier(.22, 1, .36, 1)" },
    );
    animationRef.current = animation;
    animation.finished.then(() => dialog.close()).catch(() => {});
  }

  // Route changes and desktop resizing must never leave a modal or scroll lock behind.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 781px)");
    const onResize = () => {
      if (desktop.matches) dialogRef.current?.close();
    };
    desktop.addEventListener("change", onResize);
    return () => {
      desktop.removeEventListener("change", onResize);
      animationRef.current?.cancel();
      unlockRef.current?.();
    };
  }, []);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/"><BrandContents /></Link>
        <Navigation pathname={pathname} />
        <button
          ref={triggerRef}
          className="mobile-menu-trigger"
          type="button"
          aria-label="Mở menu"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={openMenu}
        >
          Menu <span className="menu-lines" aria-hidden="true"><i /><i /></span>
        </button>
      </div>
      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        className="mobile-menu"
        aria-label="Menu điều hướng"
        onCancel={(event) => { event.preventDefault(); closeMenu(); }}
        onClick={(event) => { if (event.target === event.currentTarget) closeMenu(); }}
        onClose={() => {
          if (dialogRef.current?.open) return;
          animationRef.current?.cancel();
          delete dialogRef.current?.dataset.closing;
          unlockRef.current?.();
          unlockRef.current = undefined;
          setOpen(false);
          if (!window.matchMedia("(min-width: 781px)").matches) triggerRef.current?.focus({ preventScroll: true });
        }}
      >
        <div className="mobile-menu-panel">
          <div className="shell header-inner">
            <Link className="brand" href="/" onClick={closeMenu}><BrandContents /></Link>
            <button className="mobile-menu-trigger" type="button" aria-label="Đóng menu" onClick={closeMenu}>
              Đóng <span className="menu-lines menu-lines-close" aria-hidden="true"><i /><i /></span>
            </button>
          </div>
          <div className="shell mobile-menu-links"><Navigation pathname={pathname} onNavigate={closeMenu} /></div>
        </div>
      </dialog>
    </header>
  );
}
