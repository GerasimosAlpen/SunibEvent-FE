import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Calendar, MapPin, BellOff, ArrowRight, Clock, Users, Building, Trash2 } from "lucide-react";
import { Navigationbar, Footer } from "../components";
import { getReminders, removeReminder, type Reminder } from "@/API/ReminderAPI";

function formatEventDate(dateString: string) {
  try {
    const d = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const date = d.getDate();
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${month} ${date}, ${year} • ${hours}:${minutes} ${ampm}`;
  } catch {
    return dateString;
  }
}

function Dashboard() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchRemindersList = async () => {
      try {
        const res = await getReminders();
        setReminders(res.data || []);
      } catch (error: any) {
        console.error("Failed to load reminders:", error);
        setToast({ message: error?.message || "Failed to load dashboard data", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchRemindersList();
  }, [token, navigate]);

  const handleCancelReminder = async (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      await removeReminder(eventId);
      setReminders((prev) => prev.filter((r) => r.eventId !== eventId));
      setToast({ message: "Reminder cancelled successfully", type: "success" });
    } catch (error: any) {
      setToast({ message: error?.message || "Failed to cancel reminder", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigationbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8">
        
        {/* HEADER SECTION */}
        <section className="bg-gradient-to-r from-orange-400 to-amber-500 rounded-3xl p-8 text-left text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 flex items-center justify-center">
            <Clock className="w-48 h-48" />
          </div>
          <div className="relative z-10 flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight m-0 text-white leading-normal">
              Dashboard
            </h1>
            <p className="text-sm font-medium text-white/90">
              Welcome back, <span className="font-bold">{user?.name || "User"}</span>! Manage your active event reminders here.
            </p>
          </div>
        </section>

        {/* OVERVIEW STATS */}
        {!loading && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider leading-none">Active Reminders</p>
                <p className="text-2xl font-black text-gray-800 mt-2">{reminders.length}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider leading-none">Account Role</p>
                <p className="text-lg font-bold text-gray-800 mt-2">{user?.role || "STUDENT"}</p>
              </div>
            </div>
          </section>
        )}

        {/* LIST SECTION */}
        <section className="flex flex-col gap-5 text-left">
          <h2 className="text-xl font-bold text-gray-800">My Reminder Subscriptions</h2>

          {loading ? (
            <div className="py-24 text-center text-gray-500 font-semibold bg-white rounded-3xl border border-gray-100 shadow-sm">
              Loading reminders...
            </div>
          ) : reminders.length === 0 ? (
            <div className="py-20 px-6 text-center bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center gap-5 max-w-2xl mx-auto w-full">
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
                <BellOff className="w-8 h-8 text-orange-500" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-gray-800">No Reminders Subscribed</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                  You haven't requested any event reminders yet. Start exploring workshops, events and activities, and click the bell icon to get notified.
                </p>
              </div>
              <Link
                to="/events"
                className="flex items-center gap-2 px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md uppercase tracking-wider transition-all"
              >
                Explore Events <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {reminders.map((reminder) => {
                const event = reminder.event;
                if (!event) return null;

                return (
                  <div
                    key={reminder.id}
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex gap-4 cursor-pointer relative group overflow-hidden"
                  >
                    {/* Event image */}
                    <div className="w-28 h-28 rounded-2xl overflow-hidden shrink-0">
                      <img
                        src={event.imageUrl ?? "https://via.placeholder.com/300x300?text=No+Image"}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Event info */}
                    <div className="flex-1 flex flex-col gap-1 justify-center min-w-0 pr-8">
                      <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wide">
                        {formatEventDate(event.datetime)}
                      </span>
                      <h3 className="text-sm font-bold text-gray-800 truncate m-0 leading-snug">
                        {event.title}
                      </h3>
                      <div className="flex flex-col gap-1 mt-1 text-xs text-gray-400 font-medium">
                        <p className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" /> {event.location}
                        </p>
                        {event.organization?.name && (
                          <p className="flex items-center gap-1.5 truncate">
                            <Building className="w-3.5 h-3.5 text-gray-400" /> {event.organization.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={(e) => handleCancelReminder(e, event.id)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 hover:border-red-200 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm"
                      title="Cancel Reminder"
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>

      <Footer />

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-in slide-in-from-bottom-4 duration-300 ${
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
