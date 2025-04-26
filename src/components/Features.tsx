import { StarIcon, SparklesIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Personal Readings',
    description: 'Get detailed astrological readings tailored specifically to your birth chart and current planetary positions.',
    icon: StarIcon,
  },
  {
    name: 'AI-Powered Insights',
    description: 'Advanced AI technology combines traditional astrology with modern computational precision.',
    icon: SparklesIcon,
  },
  {
    name: 'Real-time Chat',
    description: 'Ask questions and receive instant astrological guidance through our intuitive chat interface.',
    icon: ChatBubbleBottomCenterTextIcon,
  },
]

export default function Features() {
  return (
    <div className="bg-light py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-coffee-400">Discover Your Path</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-dark sm:text-4xl">
            Everything you need for cosmic guidance
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Experience the perfect blend of ancient astrological wisdom and cutting-edge AI technology.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-dark">
  <feature.icon className="h-5 w-5 flex-none text-coffee-400" aria-hidden="true" />
  {feature.name}
</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
