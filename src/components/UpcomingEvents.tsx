import { useState } from "react";
import Filter from "./Filter";
import {
  HackathonHero,
  StudentMixer,
  DesignWorkshop,
  StartupJam,
  AcousticNight,
} from "@/assets";

/* ── mock data ─────────────────────────────────────────────── */
const FEATURED_EVENT = {
  id: "featured-1",
  badge: "Featured",
  date: "Oct 24, 2024 • 09:00 AM",
  title: "Global Tech Hackathon 2024",
  description:
    "Join 500+ students in our biggest hackathon yet. Build the future with AI…",
  venue: "Grand Auditorium, Central Building",
  image: HackathonHero,
};

const EVENTS = [
  {
    id: "evt-1",
    date: "OCT 11 • 6:30 PM",
    title: "Sunset Student Mixer",
    venue: "Campus City Terrace",
    image: StudentMixer,
  },
  {
    id: "evt-2",
    date: "OCT 13 • 10:30 AM",
    title: "Design Portfolio Workshop",
    venue: "Media Lab 201",
    image: DesignWorkshop,
  },
  {
    id: "evt-3",
    date: "NOV 01 • 5:30 PM",
    title: "Startup Ideation Jam",
    venue: "Innovation Hub",
    image: StartupJam,
  },
  {
    id: "evt-4",
    date: "NOV 02 • 1:00 PM",
    title: "Acoustic Night Finale",
    venue: "Creativity Lounge",
    image: AcousticNight,
  },
];

/* ── small event card ──────────────────────────────────────── */
function EventCard({
  event,
}: {
  event: (typeof EVENTS)[number];
}) {
  return (
    <div className="upcoming-card group">
      <div className="upcoming-card__img-wrap">
        <img
          src={event.image}
          alt={event.title}
          className="upcoming-card__img"
        />
      </div>
      <div className="upcoming-card__body">
        <span className="upcoming-card__date">{event.date}</span>
        <h4 className="upcoming-card__title">{event.title}</h4>
        <p className="upcoming-card__venue">📍 {event.venue}</p>
        <button className="upcoming-card__cta" type="button">
          View Details
        </button>
      </div>
    </div>
  );
}

/* ── main section ──────────────────────────────────────────── */
function UpcomingEvents() {
  const [visibleCount, setVisibleCount] = useState(4);

  const shownEvents = EVENTS.slice(0, visibleCount);

  return (
    <section className="">
      <div className="upcoming-section__inner">
        {/* ─── left : filters ─── */}
        <div className="upcoming-section__sidebar">
          <Filter />
        </div>

        {/* ─── right : events ─── */}
        <div className="upcoming-section__main">
          {/* header row */}
          <div className="upcoming-header">
            <h2 className="upcoming-header__title">
              Showing <span className="upcoming-header__count">{EVENTS.length}</span>{" "}
              Upcoming Events
            </h2>
            <div className="upcoming-header__sort">
              <span className="upcoming-header__sort-label">SORT BY</span>
              <select className="upcoming-header__select">
                <option>Latest First</option>
                <option>Earliest First</option>
                <option>Most Popular</option>
              </select>
            </div>
          </div>

          {/* ── hero / featured card ── */}
          <div className="upcoming-hero group">
            <div className="upcoming-hero__img-wrap">
              <span className="upcoming-hero__badge">{FEATURED_EVENT.badge}</span>
              <img
                src={FEATURED_EVENT.image}
                alt={FEATURED_EVENT.title}
                className="upcoming-hero__img"
              />
            </div>

            <div className="upcoming-hero__body">
              <span className="upcoming-hero__date">{FEATURED_EVENT.date}</span>
              <h3 className="upcoming-hero__title">{FEATURED_EVENT.title}</h3>
              <p className="upcoming-hero__desc">{FEATURED_EVENT.description}</p>
              <p className="upcoming-hero__venue">📍 {FEATURED_EVENT.venue}</p>
              <button className="upcoming-hero__cta" type="button">
                Register Now
              </button>
            </div>

            {/* floating action buttons */}
            <div className="upcoming-hero__actions">
              <button className="upcoming-hero__action-btn" type="button" aria-label="Share">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              </button>
              <button className="upcoming-hero__action-btn" type="button" aria-label="Bookmark">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              </button>
            </div>
          </div>

          {/* ── event grid ── */}
          <div className="upcoming-grid">
            {shownEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>

          {/* ── load more ── */}
          {visibleCount < EVENTS.length && (
            <div className="upcoming-more-wrap">
              <button
                className="upcoming-more-btn"
                type="button"
                onClick={() => setVisibleCount((c) => c + 4)}
              >
                Show More Events ▾
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default UpcomingEvents;
