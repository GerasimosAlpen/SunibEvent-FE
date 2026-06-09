import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
	const navigate = useNavigate();
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
		<div 
			className="upcoming-card group cursor-pointer"
			onClick={() => navigate(`/events/${event.id}`)}
		>
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
	const navigate = useNavigate();
	const [events, setEvents] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const res = await viewAllEvents();
				// Extract the events array from the API response
				const data = res?.data?.events || [];
				setEvents(data);
			} catch (error) {
				console.error("Failed to load events:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, []);

	const shownEvents = events.slice(0, 4);

	return (
		<section className="">
			<div className="upcoming-section__inner">
				{/* ─── left : filters ─── */}
				{/* <div className="upcoming-section__sidebar">
					
				</div> */}

				{/* ─── right : events ─── */}
				<div className="upcoming-section__main">


					{loading ?
						<div className="text-center py-20 text-gray-500">
							Loading events...
						</div>
					:	<>
							{/* ── event grid ── */}
							<div className="upcoming-grid">
								{shownEvents.map((evt: any, idx: number) => (
									<EventCard key={evt.id || idx} event={evt} />
								))}
							</div>

							{/* ── load more ── */}
							{events.length > 4 && (
								<div className="upcoming-more-wrap">
									<button
										className="flex items-center justify-center gap-2 px-8 py-3 bg-white border border-gray-200 text-[#2c2c2c] text-sm font-semibold rounded-full hover:border-gray-300 hover:text-black transition-all mx-auto shadow-sm"
										type="button"
										onClick={() => navigate("/events")}
									>
										Show More Events
										<ArrowRight className="w-4 h-4 text-gray-600" />
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
