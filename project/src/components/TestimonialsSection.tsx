import { useState } from 'react';
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Amarris Black',
      role: 'Insurance Producer',
      rating: 5,
      text: 'I started a few years ago and they promised excellent customer service.',
      image: 'bg-blue-400',
    },
    {
      name: 'Annette Black',
      role: 'Insurance Producer',
      rating: 5,
      text: 'I had a claim recently, and they handled it professionally and promptly!',
      image: 'bg-yellow-400',
    },
    {
      name: 'Annette Black',
      role: 'Insurance Producer',
      rating: 5,
      text: 'InsureGuard helped me find the perfect insurance plan, grateful for their expertise.',
      image: 'bg-gray-400',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-medium mb-2">Reviews</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            5 million+ happy customers, various forms, and discover them in wonderful starting business.
          </p>
        </div>

   
        <div className="relative max-w-xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 ${testimonials[currentSlide].image} rounded-full`}></div>
              <div>
                <h3 className="font-semibold text-gray-900">{testimonials[currentSlide].name}</h3>
                <p className="text-sm text-gray-600">{testimonials[currentSlide].role}</p>
              </div>
            </div>

            <div className="flex gap-1 mb-3">
              {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            <p className="text-gray-600">{testimonials[currentSlide].text}</p>
          </div>

        
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
          >
            ›
          </button>
        </div>

     
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition ${
                idx === currentSlide ? 'bg-blue-600 w-8' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

