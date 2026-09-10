import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, MessageSquare, Send, ThumbsUp, Sparkles, Filter, X } from 'lucide-react';
import { fetchProductReviews, submitProductReview } from '../services/api';

export function ProductReviewsSection({ productId = 'ALL', productName = 'Shraviko Sacred Creation' }) {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ average_rating: 5.0, total_reviews: 0, rating_breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState('ALL');
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await fetchProductReviews(productId);
      if (data.success) {
        setReviews(data.reviews || []);
        setSummary({
          average_rating: data.average_rating || 5.0,
          total_reviews: data.total_reviews || 0,
          rating_breakdown: data.rating_breakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        });
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !name.trim()) return;
    if (title.length > 100 || comment.length > 1000) return;
    setSubmitting(true);
    try {
      const res = await submitProductReview({
        product_id: productId,
        rating,
        title,
        comment,
        customer_name: name,
        customer_email: email,
      });

      if (res.success) {
        setSubmitSuccess(true);
        setTitle('');
        setComment('');
        loadReviews();
        setTimeout(() => {
          setSubmitSuccess(false);
          setShowForm(false);
        }, 2500);
      }
    } catch (err) {
      alert(err.message || 'Could not save review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = filterRating === 'ALL'
    ? reviews
    : reviews.filter(r => Math.round(r.rating) === parseInt(filterRating, 10));

  return (
    <section className="py-12 sm:py-16 bg-[#FAF7F2] border-t border-[#E8DFC7]/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E8DFC7]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EFE0] border border-[#DAB97B] text-[#5C420D] text-[11px] font-cinzel tracking-widest uppercase font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#8C6D27]" />
              <span>Devotee Experiences</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#1C140F]">
              Customer Reviews & Ratings
            </h3>
            <p className="text-xs sm:text-sm text-[#3D2E24] font-medium mt-1">
              Real, permanent feedback from verified buyers of {productName}
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C1F06] hover:bg-[#3D2B0A] text-[#E5C378] font-cinzel font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all active:scale-95 self-start sm:self-auto"
          >
            <MessageSquare className="w-4 h-4 text-[#E5C378]" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Form Modal / Collapsible */}
        {showForm && (
          <div className="mb-10 p-6 sm:p-8 bg-white rounded-2xl border-2 border-[#B89B67] shadow-xl relative animate-fade-in">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#1C140F]"
            >
              <X className="w-5 h-5" />
            </button>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="font-cinzel font-bold text-[#1C140F] text-lg">Sacred Review Recorded!</h4>
                <p className="text-xs text-[#3D2E24] font-medium">Your review has been saved permanently to our database.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-5">
                <h4 className="font-cinzel font-bold text-[#1C140F] text-base border-b border-[#F0E8D8] pb-3">
                  Share Your Sacred Feedback
                </h4>

                {/* Rating Picker */}
                <div>
                  <label className="block text-xs font-cinzel font-bold uppercase tracking-wider text-[#1C140F] mb-2">
                    Overall Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star className={`w-7 h-7 ${star <= rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-300'}`} />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-bold text-[#8C6D27] uppercase tracking-wider font-cinzel">
                      {rating} of 5 Stars
                    </span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-cinzel font-bold uppercase tracking-wider text-[#1C140F] mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ananya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-[#B89B67] text-sm font-bold text-[#1C140F] bg-[#FAF7F2] focus:bg-white focus:outline-none placeholder:text-[#7D6E63]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-cinzel font-bold uppercase tracking-wider text-[#1C140F] mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#B89B67] text-sm font-bold text-[#1C140F] bg-[#FAF7F2] focus:bg-white focus:outline-none placeholder:text-[#7D6E63]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-cinzel font-bold uppercase tracking-wider text-[#1C140F] mb-1.5">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pure Divine Finish & Outstanding Energy!"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#B89B67] text-sm font-bold text-[#1C140F] bg-[#FAF7F2] focus:bg-white focus:outline-none placeholder:text-[#7D6E63]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel font-bold uppercase tracking-wider text-[#1C140F] mb-1.5">
                    Detailed Review *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about the craftsmanship, finish, fragrance, aura, or delivery experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={1000}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#B89B67] text-sm font-bold text-[#1C140F] bg-[#FAF7F2] focus:bg-white focus:outline-none placeholder:text-[#7D6E63] resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 border border-[#B89B67] text-[#1C140F] text-xs font-cinzel font-bold uppercase rounded-xl hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2C1F06] hover:bg-[#3D2B0A] text-[#E5C378] text-xs font-cinzel font-bold uppercase tracking-widest rounded-xl disabled:opacity-60 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Saving Review…' : 'Submit Review Permanently'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Rating Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DFC7] shadow-sm mb-10">
          
          {/* Average Rating Score */}
          <div className="md:col-span-4 text-center md:border-r md:border-[#F0E8D8] md:pr-8">
            <div className="text-5xl font-cinzel font-bold text-[#1C140F]">
              {summary.average_rating}
            </div>
            <div className="flex items-center justify-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${s <= Math.round(summary.average_rating) ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <p className="text-xs font-bold text-[#3D2E24] font-cinzel tracking-wider uppercase">
              Based on {summary.total_reviews} Verified Devotees
            </p>
          </div>

          {/* Breakdown Bars */}
          <div className="md:col-span-8 space-y-2">
            {[5, 4, 3, 2, 1].map((num) => {
              const count = summary.rating_breakdown[num] || 0;
              const pct = summary.total_reviews > 0 ? (count / summary.total_reviews) * 100 : 0;
              return (
                <div key={num} className="flex items-center gap-3 text-xs font-semibold text-[#1C140F]">
                  <span className="w-12 flex items-center gap-1">
                    <span>{num}</span>
                    <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                  </span>
                  <div className="flex-1 h-2.5 rounded-full bg-[#FAF7F2] border border-[#E8DFC7] overflow-hidden">
                    <div
                      className="h-full bg-[#B89B67] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-gray-500 text-[11px] font-mono">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <span className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#1C140F] flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5 text-[#8C6D27]" /> Filter:
          </span>
          {['ALL', '5', '4', '3', '2', '1'].map((val) => (
            <button
              key={val}
              onClick={() => setFilterRating(val)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-cinzel font-bold uppercase tracking-wider transition-all ${
                filterRating === val
                  ? 'bg-[#2C1F06] text-[#E5C378] shadow-xs'
                  : 'bg-white border border-[#E8DFC7] text-[#1C140F] hover:bg-[#FAF7F2]'
              }`}
            >
              {val === 'ALL' ? 'All Reviews' : `${val} Stars`}
            </button>
          ))}
        </div>

        {/* Reviews Feed */}
        {loading ? (
          <div className="py-12 text-center text-xs font-cinzel font-bold uppercase tracking-wider text-gray-400">
            Loading Verified Reviews…
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#E8DFC7]">
            <p className="text-sm font-semibold text-[#1C140F]">No reviews match this rating filter.</p>
            <p className="text-xs text-gray-500 mt-1">Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((rev, i) => (
              <div
                key={rev.id || i}
                className="bg-white rounded-2xl p-6 border border-[#E8DFC7] shadow-xs hover:shadow-sm transition-shadow space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= (rev.rating || 5) ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>

                  {rev.verified_buyer !== 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Verified Devotee Buyer
                    </span>
                  )}
                </div>

                {rev.title && (
                  <h5 className="font-cinzel font-bold text-[#1C140F] text-sm">
                    {rev.title}
                  </h5>
                )}

                <p className="text-xs sm:text-sm text-[#3D2E24] leading-relaxed font-normal">
                  "{rev.comment}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-[#7A6859] pt-2 border-t border-[#F8F5EF]">
                  <span className="font-bold text-[#1C140F] font-cinzel">
                    {rev.customer_name || 'Anonymous Devotee'}
                  </span>
                  <span>
                    {rev.created_at ? new Date(rev.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Verified Review'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
