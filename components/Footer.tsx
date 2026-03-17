export function Footer({
  storeName,
  whatsappNumber,
}: {
  storeName: string
  whatsappNumber?: string
}) {
  return (
    <footer className="bg-accent text-white py-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4 text-center">
        <span className="text-lg font-bold uppercase tracking-wider">
          {storeName}
        </span>

        {whatsappNumber && (
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            Chat on WhatsApp
          </a>
        )}

        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
