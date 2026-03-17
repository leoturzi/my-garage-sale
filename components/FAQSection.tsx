import { SectionHeader } from './SectionHeader'
import { Accordion } from './Accordion'

const faqs = [
  {
    title: 'How do I purchase an item?',
    content:
      'Browse our collection and add items to your cart. Once you\'re ready, proceed to checkout. You can also message us directly on WhatsApp for a faster purchasing experience.',
  },
  {
    title: 'What do the condition ratings mean?',
    content:
      'We grade every item honestly. "New" means unworn with tags. "Like New" means worn once or twice with no visible signs of wear. "Good" means gently used with minor signs of wear. "Fair" means noticeable wear but still in great shape.',
  },
  {
    title: 'Do you offer shipping?',
    content:
      'Yes! We offer shipping on all orders. Delivery times vary depending on your location. Free shipping is available on select orders.',
  },
  {
    title: 'Can I return an item?',
    content:
      'We want you to be happy with your purchase. If an item doesn\'t match its description, contact us within 14 days for a return. Items must be in the same condition as received.',
  },
  {
    title: 'Are all items authentic?',
    content:
      'Absolutely. Every item is personally verified for authenticity before listing. We stand behind everything we sell.',
  },
]

export function FAQSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeader title="Frequently Asked Questions" />
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
