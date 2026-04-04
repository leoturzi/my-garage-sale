import { SectionHeader } from './SectionHeader'
import { Accordion } from './Accordion'
import { es_AR } from '@/lib/translations'

export function FAQSection() {
  const faqs = es_AR.faqs

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeader title={es_AR.faqTitle} />
      <div className="max-w-3xl">
        <Accordion
          items={faqs.map((faq) => ({
            title: faq.title,
            content: <p>{faq.content}</p>,
          }))}
        />
      </div>
    </section>
  )
}
