import "../css/Footer.css";

function Footer() {
    const footerLinks = [
        { label: "Audio Description", href: "#" },
        { label: "Help Center", href: "#" },
        { label: "Gift Cards", href: "#" },
        { label: "Media Center", href: "#" },
        { label: "Investor Relations", href: "#" },
        { label: "Jobs", href: "#" },
        { label: "Terms of Use", href: "#" },
        { label: "Privacy", href: "#" },
        { label: "Legal Notices", href: "#" },
        { label: "Cookie Preferences", href: "#" },
        { label: "Corporate Information", href: "#" },
        { label: "Contact Us", href: "#" },
    ];

    const socialLinks = [
        {
            label: "Facebook",
            href: "#",
            icon: (
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
            ),
        },
        {
            label: "Instagram",
            href: "#",
            icon: (
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                </svg>
            ),
        },
        {
            label: "Twitter",
            href: "#",
            icon: (
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M22.46 6c-.85.38-1.78.64-2.75.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.51-1.53-2.66 0-4.81 2.16-4.81 4.81 0 .38.04.75.13 1.1-4-.2-7.58-2.11-9.96-5.02-.42.72-.66 1.56-.66 2.46 0 1.68.85 3.16 2.14 4.02-.79-.02-1.53-.24-2.18-.6v.06c0 2.35 1.67 4.31 3.88 4.76-.4.1-.83.16-1.27.16-.31 0-.62-.03-.92-.08.63 1.96 2.45 3.39 4.61 3.43-1.69 1.32-3.83 2.1-6.15 2.1-.4 0-.8-.02-1.19-.07 2.19 1.4 4.78 2.22 7.57 2.22 9.07 0 14.02-7.52 14.02-14.02 0-.21 0-.43-.01-.64.96-.69 1.79-1.56 2.45-2.55z" />
                </svg>
            ),
        },
        {
            label: "YouTube",
            href: "#",
            icon: (
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
                </svg>
            ),
        },
    ];

    return (
        <footer className="footer">
            <div className="footer__container">
                {/* Social Links */}
                <div className="footer__social">
                    {socialLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="footer__social-link"
                            aria-label={link.label}
                        >
                            {link.icon}
                        </a>
                    ))}
                </div>

                {/* Footer Links */}
                <div className="footer__links">
                    {footerLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="footer__link"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Service Code */}
                <button className="footer__service-code">
                    Service Code
                </button>

                {/* Copyright */}
                <p className="footer__copyright">
                    © 1997-{new Date().getFullYear()} Netflix Clone, Inc.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
