export function AnnouncementBar({ messages }: { messages: string[] }) {
  const doubled = [...messages, ...messages]
  return (
    <div className="bg-accent text-white text-xs py-2 overflow-hidden whitespace-nowrap">
      <div className="animate-marquee inline-flex gap-12">
        {doubled.map((msg, i) => (
          <span key={i} className="uppercase tracking-widest">
            {msg}
          </span>
        ))}
      </div>
    </div>
  )
}
