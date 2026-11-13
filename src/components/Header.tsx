import { useEffect, useRef, useState } from "react";
import { site } from "../data/site.ts";
import SocialIcon from "./SocialIcon.tsx";
import Logo from "./Logo.tsx";

// Each href matches a section id on the page: #work (Gallery), #about (Intro), #contact (Footer).
const links = [
  { label: "gallery", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

// The one social profile shown in the header (all of them are in the footer).
// '!': site.ts always lists Instagram (Header.test checks the link exists).
const instagram = site.socials.find((social) => social.icon === "instagram")!;

export default function Header() {
  // Remembers whether the menu is open. Starts closed.
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null); // the whole menu (button + list)
  const buttonRef = useRef<HTMLButtonElement>(null); // the ☰ button, to give focus back to it

  // While the menu is open, listen to the whole page for Escape and outside clicks.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current!.focus(); // keyboard users land back where they were
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (!navRef.current!.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    // Cleanup: stop listening when the menu closes (or the Header goes away).
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <header className="site-header">
      {/* The black band spans the full width; this inner div keeps the content in line with the page. */}
      <div className="container site-header__inner">
        <a href="/" className="site-header__name">
          <Logo />
          {/* Not shown, but screen readers and search engines still read the name. */}
          <span className="visually-hidden">{site.name}</span>
        </a>
        <div className="site-header__actions">
          {/* Phone: ☰ menu. Desktop (≥ 48rem): the links show in a row and the button hides (CSS only). */}
          <nav aria-label="Main" className="site-menu" ref={navRef}>
            <button
              ref={buttonRef}
              type="button"
              className="site-menu__button"
              // Tells screen readers if the menu is open, and which list it controls.
              aria-expanded={open}
              aria-controls="site-menu-list"
              onClick={() => setOpen((isOpen) => !isOpen)}
            >
              <span className="visually-hidden">Menu</span>
              {/* Three lines (☰) that turn into an X when open; drawn in CSS. */}
              <span className="site-menu__icon" aria-hidden="true" />
            </button>
            <ul id="site-menu-list" className="site-menu__list" hidden={!open}>
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={() => setOpen(false)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {/* After the links in the code (keyboard order on desktop); CSS moves it before ☰ on phones. */}
          <a
            href={instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${site.name} on Instagram`}
            className="site-header__social"
          >
            <SocialIcon icon="instagram" />
          </a>
        </div>
      </div>
    </header>
  );
}
