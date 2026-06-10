import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Bell } from "lucide-react";
import { viewAllEvents } from "@/API/GET/ViewAll";
import { getReminders, setReminder, removeReminder } from "@/API/ReminderAPI";
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
function EventCard({
	event,
	isReminded,
	onToggleReminder,
}: {
	event: any;
	isReminded: boolean;
	onToggleReminder: (eventId: number) => void;
}) {
	const navigate = useNavigate();
	const userJson = localStorage.getItem("user");
	const user = userJson ? JSON.parse(userJson) : null;
	const isRegularUser = !user || user.role === "USER";
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
			className="upcoming-card group cursor-pointer relative"
			onClick={() => navigate(`/events/${event.id}`)}
		>
			<div className="upcoming-card__img-wrap relative">
				<img src={imageSrc} alt={title} className="upcoming-card__img" />
				
				{isRegularUser && (
					<button 
						onClick={(e) => {
							e.stopPropagation();
							onToggleReminder(event.id);
						}}
						className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm transition-all ${
							isReminded 
								? "bg-orange-500 text-white border-orange-500" 
								: "bg-white/90 hover:bg-white text-gray-600 border-gray-200"
						}`}
						title={isReminded ? "Remove Reminder" : "Remind Me"}
						type="button"
					>
						<Bell className="w-4 h-4" />
					</button>
				)}
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
	const [remindedIds, setRemindedIds] = useState<Set<number>>(new Set());
	const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

	const token = localStorage.getItem("token");

	useEffect(() => {
		if (toast) {
			const timer = setTimeout(() => setToast(null), 3000);
			return () => clearTimeout(timer);
		}
	}, [toast]);

	useEffect(() => {
		const fetchEventsAndReminders = async () => {
			try {
				const res = await viewAllEvents();
				const data = res?.data?.events || [];
				setEvents(data);

				if (token) {
					const remRes = await getReminders();
					const ids = new Set((remRes.data || []).map((r: any) => r.eventId));
					setRemindedIds(ids);
				}
			} catch (error) {
				console.error("Failed to load events and reminders:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchEventsAndReminders();
	}, [token]);

	const handleReminderToggle = async (eventId: number) => {
		if (!token) {
			setToast({ message: "Please login to set reminders", type: "error" });
			setTimeout(() => navigate("/login"), 1500);
			return;
		}

		const isReminded = remindedIds.has(eventId);
		try {
			if (isReminded) {
				await removeReminder(eventId);
				setRemindedIds((prev) => {
					const next = new Set(prev);
					next.delete(eventId);
					return next;
				});
				setToast({ message: "Reminder removed successfully", type: "success" });
			} else {
				await setReminder(eventId);
				setRemindedIds((prev) => {
					const next = new Set(prev);
					next.add(eventId);
					return next;
				});
				setToast({ message: "Reminder set successfully", type: "success" });
			}
		} catch (err: any) {
			setToast({ message: err?.message || "Failed to update reminder", type: "error" });
		}
	};

	const shownEvents = events.slice(0, 4);

	return (
		<section className="relative">
			<div className="upcoming-section__inner">
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
									<EventCard 
										key={evt.id || idx} 
										event={evt} 
										isReminded={remindedIds.has(evt.id)}
										onToggleReminder={handleReminderToggle}
									/>
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

			{/* Toast Notification */}
			{toast && (
				<div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-in slide-in-from-bottom-4 duration-300 ${
					toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
				}`}>
					{toast.message}
				</div>
			)}
		</section>
	);
}

export default UpcomingEvents;
