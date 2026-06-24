import { Link } from 'react-router-dom';

export default function AIConciergeCTA() {
  return (
    <section className="gl-section bg-champagne/50">
      <div className="gl-container-narrow text-center">
        <p className="font-display text-3xl md:text-4xl mb-4">
          Not sure what you need?
        </p>
        <p className="text-dark/50 text-base mb-8 max-w-lg mx-auto">
          Tell Glow what you're looking for, and the AI will find the perfect salon match in Chennai.
        </p>
        <Link to="/ai-concierge" className="gl-btn-primary px-8 py-3">
          Talk to Glow
        </Link>
      </div>
    </section>
  );
}
