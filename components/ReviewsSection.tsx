import { SectionHeader } from './SectionHeader'
import { ReviewCard } from './ReviewCard'

const reviews = [
  {
    name: 'Maria G.',
    rating: 5,
    date: '2 weeks ago',
    text: 'Delivery was super quick. Good quality item, came in a nice bag. Would definitely buy again!',
  },
  {
    name: 'Alex R.',
    rating: 5,
    date: '1 month ago',
    text: 'Great condition, exactly as described. The seller was very responsive on WhatsApp and answered all my questions.',
  },
  {
    name: 'Sophie M.',
    rating: 4,
    date: '1 month ago',
    text: 'Good finds, great service. Arrived quickly after ordering. Very happy with the overall experience.',
  },
  {
    name: 'Thomas K.',
    rating: 5,
    date: '2 months ago',
    text: 'Amazing prices for authentic items. I was very comfortable with the purchase and will come back for more.',
  },
  {
    name: 'Laura P.',
    rating: 5,
    date: '2 months ago',
    text: 'Excellent! The item was in better condition than expected. Very transparent about everything. Highly recommend.',
  },
  {
    name: 'Daniel F.',
    rating: 4,
    date: '3 months ago',
    text: 'Nice selection of products. Bought two items and both were as described. Quick shipping too.',
  },
]

export function ReviewsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 hidden">
      <SectionHeader title="What Our Customers Say" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </div>
    </section>
  )
}
