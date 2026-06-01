import { useState, useEffect } from "react";
import Filter from "./Filter";
import { viewAllEvents } from "@/API/GET/ViewAll";
import {
	HackathonHero,
	StudentMixer,
	DesignWorkshop,
	StartupJam,
	AcousticNight,
} from "@/assets";

const FALLBACK_IMAGES = [
	HackathonHero,
	StudentMixer,
	DesignWorkshop,
	StartupJam,
	AcousticNight,
];

function getRandomFallbackImage() {
	return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
}

/* ── small event card ──────────────────────────────────────── */
function EventCard({ event }: { event: any }) {
	const imageSrc = event.imageUrl || getRandomFallbackImage();
	const title = event.title || "Untitled Event";
	const venue = event.location || "TBA";
	const date =
		event.datetime ?
			new Date(event.datetime).toLocaleDateString(undefined, {
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "2-digit",
			})
		:	"TBA";

	return (
		<div className="upcoming-card group">
			<div className="upcoming-card__img-wrap">
				<img src={imageSrc} alt={title} className="upcoming-card__img" />
			</div>
			<div className="upcoming-card__body">
				<span className="upcoming-card__date">{date}</span>
				<h4 className="upcoming-card__title">{title}</h4>
				<p className="upcoming-card__venue">📍 {venue}</p>
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
	const [events, setEvents] = useState<any[]>([]);
	const [featuredEvent, setFeaturedEvent] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const res = await viewAllEvents();
				// Extract the events array from the API response
				const data = res?.data?.events || [];

				if (data.length > 0) {
					// Pick a random event to be featured
					const randomIndex = Math.floor(Math.random() * data.length);
					setFeaturedEvent(data[randomIndex]);

					// Remove the featured event from the regular list
					const remainingEvents = data.filter(
						(_: any, i: number) => i !== randomIndex,
					);
					setEvents(remainingEvents);
				}
			} catch (error) {
				console.error("Failed to load events:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, []);

	const shownEvents = events.slice(0, visibleCount);

	// Derive featured event properties safely
	const heroImage = featuredEvent?.imageUrl || HackathonHero;
	const heroTitle = featuredEvent?.title || "Stay Tuned";
	const heroDesc =
		featuredEvent?.description ||
		"More exciting events are coming soon. Check back later for updates.";
	const heroVenue = featuredEvent?.location || "TBA";
	const heroDate =
		featuredEvent?.datetime ?
			new Date(featuredEvent.datetime).toLocaleDateString(undefined, {
				month: "short",
				day: "numeric",
				year: "numeric",
				hour: "numeric",
				minute: "2-digit",
			})
		:	"TBA";

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
							Showing{" "}
							<span className="upcoming-header__count">{events.length}</span>{" "}
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

					{loading ?
						<div className="text-center py-20 text-gray-500">
							Loading events...
						</div>
					:	<>
							{/* ── hero / featured card ── */}
							{featuredEvent && (
								<div className="upcoming-hero group">
									<div className="upcoming-hero__img-wrap">
										<span className="upcoming-hero__badge">Featured</span>
										<img
											src={heroImage}
											alt={heroTitle}
											className="upcoming-hero__img"
										/>
									</div>

									<div className="upcoming-hero__body">
										<span className="upcoming-hero__date">{heroDate}</span>
										<h3 className="upcoming-hero__title">{heroTitle}</h3>
										<p className="upcoming-hero__desc line-clamp-3">
											{heroDesc}
										</p>
										<p className="upcoming-hero__venue">📍 {heroVenue}</p>
										<button className="upcoming-hero__cta" type="button">
											Register Now
										</button>
									</div>

									{/* floating action buttons */}
									<div className="upcoming-hero__actions">
										<button
											className="upcoming-hero__action-btn"
											type="button"
											aria-label="Share"
										>
											<svg
												width="18"
												height="18"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
												<polyline points="16 6 12 2 8 6" />
												<line x1="12" y1="2" x2="12" y2="15" />
											</svg>
										</button>
										<button
											className="upcoming-hero__action-btn"
											type="button"
											aria-label="Bookmark"
										>
											<svg
												width="18"
												height="18"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
											</svg>
										</button>
									</div>
								</div>
							)}

							{/* ── event grid ── */}
							<div className="upcoming-grid">
								{shownEvents.map((evt: any, idx: number) => (
									<EventCard key={evt.id || idx} event={evt} />
								))}
							</div>

							{/* ── load more ── */}
							{visibleCount < events.length && (
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
						</>
					}
				</div>
			</div>
		</section>
	);
}

export default UpcomingEvents;
