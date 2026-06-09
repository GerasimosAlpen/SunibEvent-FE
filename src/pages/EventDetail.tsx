import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Users, Building, Info, ArrowLeft, ExternalLink } from "lucide-react";

import { Navigationbar, Footer } from "../components";
import { viewEventById } from "@/API/GET/ViewOne";

type Event = {
  id: number;
  title: string;
  description: string;
  datetime: string;
  endtime: string;
  location: string;
  quota: number;
  status: string;
  registrationLink: string | null;
  imageUrl: string | null;

  category: {
    id: number;
    name: string;
  };

  organization: {
    id: number;
    name: string;
    logoUrl: string | null;
  };
};

function formatEventTimeRange(startDateString: string, endDateString: string) {
  try {
    const start = new Date(startDateString);
    const end = new Date(endDateString);
    
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[start.getMonth()];
    const date = start.getDate();
    const year = start.getFullYear();
    
    const formatTime = (d: Date) => {
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    return `${month} ${date}, ${year} • ${formatTime(start)} - ${formatTime(end)}`;
  } catch {
    return startDateString;
  }
}

function EventDetail() {
  const { id } = useParams();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchEvent = async () => {
      try {
        if (!id) return;

        const res = await viewEventById(id);

        if (mounted) {
          setEvent(res?.data ?? null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchEvent();

    return () => {
      mounted = false;
    };
  }, [id]);

  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;
  const isAdmin = user?.role === "ADMIN";
  const isOrganizer = user?.role === "ORGANIZATION" || user?.role === "ORGANIZER";

  const backPath = isAdmin ? "/admin" : (isOrganizer ? "/organizer" : "/events");
  const backLabel = isAdmin ? "Back to Admin Panel" : (isOrganizer ? "Back to Dashboard" : "Back to Events");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigationbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
        
        {/* Back Link */}
        <Link
          to={backPath}
          className="group flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors w-fit self-start"
        >
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-200 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
          {backLabel}
        </Link>

        {loading ? (
          <div className="py-32 text-center text-gray-500 font-semibold bg-white rounded-3xl border border-gray-100 shadow-sm">
            Loading event...
          </div>
        ) : !event ? (
          <div className="py-32 text-center text-gray-500 font-semibold bg-white rounded-3xl border border-gray-100 shadow-sm">
            Event not found.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT COLUMN: BANNER, ABOUT, SCHEDULE */}
            <div className="lg:col-span-2 flex flex-col gap-6 w-full">
              
              {/* Main Banner Header */}
              <div className="relative rounded-3xl overflow-hidden aspect-[21/9] w-full border border-gray-100 shadow-sm">
                <img
                  src={event.imageUrl ?? "https://via.placeholder.com/1200x500?text=No+Image"}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                
                {/* Badges top left */}
                <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-wrap gap-2 z-10">
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    {event.category?.name}
                  </span>
                  <span className={`text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm ${
                    event.status === "ONLINE" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                  }`}>
                    {event.status === "ONLINE" ? "Registration Open" : "Closed"}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 p-6 md:p-8 text-left text-white flex flex-col gap-2.5 max-w-3xl">
                  <h1 className="text-xl md:text-3xl font-extrabold tracking-tight leading-tight">
                    {event.title}
                  </h1>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-200 mt-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      {formatEventTimeRange(event.datetime, event.endtime)}
                    </span>
                  </div>
                </div>
              </div>

              {/* About Card */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 text-left flex flex-col gap-4">
                <h2 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3 flex items-center gap-2">
                  <span className="text-orange-500">ℹ️</span> About the Event
                </h2>
                <p className="text-sm leading-7 text-gray-600 whitespace-pre-line">
                  {event.description}
                </p>
              </div>



            </div>

            {/* RIGHT COLUMN: SPECS & VENUE */}
            <div className="lg:col-span-1 flex flex-col gap-6 w-full">
              
              {/* Specs Card */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-left flex flex-col gap-5">
                <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3">Event Details</h3>
                
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">Capacity</p>
                      <p className="text-xs font-bold text-gray-800 mt-1">{event.quota} attendees</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-center">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                      <Info className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">Event Type</p>
                      <p className="text-xs font-bold text-gray-800 mt-1">{event.category?.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-center">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                      <Building className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">Organizer</p>
                      <p className="text-xs font-bold text-gray-800 mt-1">{event.organization?.name}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 mt-2">
                  <a
                    href={event.registrationLink || "#"}
                    target={event.registrationLink ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className={`w-full text-center py-3 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 uppercase tracking-wider ${
                      event.status === "ONLINE" && event.registrationLink
                        ? "bg-[#1e1b24] hover:bg-neutral-800 text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
                    }`}
                  >
                    Register Now <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="mailto:support@sunibevent.edu"
                    className="w-full text-center py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs rounded-xl transition-all uppercase tracking-wider"
                  >
                    Contact Us
                  </a>
                </div>
              </div>

              {/* Venue Card */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-left flex flex-col gap-4">
                <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3">Venue</h3>
                
                <div>
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">{event.location}</h4>
                </div>


              </div>

            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default EventDetail;