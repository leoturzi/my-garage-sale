import { SectionHeader } from './SectionHeader'
import { Accordion } from './Accordion'

interface FAQSection {
  title: string
  questions?: { question: string; answer: string }[]
}

export function FAQSection({ sections }: { sections: FAQSection[] }) {
  if (sections.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {sections.map((section, i) => (
        <div key={i} className="mb-8 last:mb-0">
          <SectionHeader title={section.title} />
          {section.questions && section.questions.length > 0 && (
            <div className="max-w-3xl">
              <Accordion
                items={section.questions.map((q) => ({
                  title: q.question,
                  content: <p>{q.answer}</p>,
                }))}
              />
            </div>
          )}
        </div>
      ))}
    </section>
  )
}
