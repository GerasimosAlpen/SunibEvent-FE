import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";

import { Navigationbar, Footer } from "../components";
import { viewAllEvents } from "@/API/GET/ViewAll";
import { getCategories, type Category } from "@/API/GET/GetCategories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${month} ${date}, ${year} • ${hours}:${minutes} ${ampm}`;
  } catch {
    return dateString;
  }
}

function EventCard({
  event,
}: Readonly<{ event: Event }>) {
  return (
    <Card className="h-full flex flex-col overflow-hidden rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-0 gap-0">
      <div className="relative aspect-video w-full overflow-hidden flex-shrink-0">
        <img
          src={event.imageUrl ?? "https://via.placeholder.com/600x400?text=No+Image"}
          alt={event.title}
          className="w-full h-full object-cover"
        />

        {/* CATEGORY BADGE */}
        {event.category?.name && (
          <div className="absolute top-3 left-3">
            <span className="bg-orange-500/95 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
              {event.category.name}
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-5 flex-1 flex flex-col gap-2.5 text-left">
        <span className="text-xs text-orange-500 font-bold tracking-wide">
          {formatEventDate(event.datetime)}
        </span>

        <h3 className="text-base font-bold text-gray-900 line-clamp-1">
          {event.title}
        </h3>

        <div className="flex flex-col gap-1.5 mt-1 text-xs text-gray-500 font-medium">
          <p className="flex items-center gap-1.5 line-clamp-1">
            <span>📍</span> {event.location}
          </p>
          <p className="flex items-center gap-1.5">
            <span>👥</span> {event.quota} attendees
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 mt-auto">
        <Button asChild className="w-full py-2.5 bg-[#bcf5f9] text-[#1f1c26] hover:bg-[#a5e9ed] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-none">
          <Link to={`/events/${event.id}`}>
            View Details <span className="text-sm font-normal">→</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filter & pagination states
  const [searchVal, setSearchVal] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [activeStatus, setActiveStatus] = useState<"ONLINE" | "CLOSED">("ONLINE");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const fetchEventsList = async () => {
      try {
        const res = await viewAllEvents({
          search: activeSearch || undefined,
          categoryId: selectedCategoryId || undefined,
          status: activeStatus,
          page: page,
          limit: 8,
        });

        if (!mounted) return;

        const newEvents = res?.data?.events || [];
        const total = res?.data?.total || 0;
        setTotalCount(total);

        if (page === 1) {
          setEvents(newEvents);
        } else {
          setEvents((prev) => [...prev, ...newEvents]);
        }

        setHasMore((page * 8) < total);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchEventsList();

    return () => {
      mounted = false;
    };
  }, [activeSearch, selectedCategoryId, activeStatus, page]);

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    setPage(1);
  };

  const handleStatusChange = (status: "ONLINE" | "CLOSED") => {
    setActiveStatus(status);
    setPage(1);
  };

  const handleSearchSubmit = () => {
    setActiveSearch(searchVal);
    setPage(1);
  };

  return (
    <>
      <Navigationbar />

      {/* HERO */}
      <section className="bg-gradient-to-r from-orange-400 to-amber-500 shadow-inner">
        <div className="mx-auto max-w-7xl px-6 py-16 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            What's Happening Next?
          </h1>

          <p className="mt-4 text-base md:text-lg text-white/95 max-w-2xl mx-auto font-medium">
            Explore workshops, competitions, and student meetups across the Sunib campus ecosystem.
          </p>

          <div className="w-full max-w-2xl mt-8">
            <div className="flex items-center rounded-2xl bg-white p-2 shadow-xl border border-orange-300/20">
              <div className="flex flex-1 items-center px-4">
                <Search className="mr-3 h-5 w-5 text-gray-400 shrink-0" />

                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchSubmit();
                  }}
                  className="w-full outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                />
              </div>

              <Button
                className="rounded-xl bg-[#f59f3a] hover:bg-orange-500 text-white font-semibold px-6 py-2.5 transition-all text-sm shrink-0 shadow-none border-0"
                onClick={handleSearchSubmit}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* SIDEBAR */}
          <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-5">
            
            {/* Category Filter */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase">Category</h3>
                <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleCategorySelect(null)}
                  className={`text-left text-sm font-medium transition-colors py-1.5 px-3 rounded-lg ${
                    selectedCategoryId === null
                      ? "text-orange-500 bg-orange-50/50 font-semibold"
                      : "text-gray-600 hover:text-orange-400 hover:bg-gray-50"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`text-left text-sm font-medium transition-colors py-1.5 px-3 rounded-lg ${
                      selectedCategoryId === cat.id
                        ? "text-orange-500 bg-orange-50/50 font-semibold"
                        : "text-gray-600 hover:text-orange-400 hover:bg-gray-50"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN EVENT LIST */}
          <div className="flex-1 w-full flex flex-col gap-6">
            
            {/* Status Tabs */}
            <div className="flex items-center gap-3 bg-gray-100/50 p-1.5 rounded-2xl w-fit self-start border border-gray-100">
              <button
                onClick={() => handleStatusChange("ONLINE")}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeStatus === "ONLINE"
                    ? "bg-[#f59f3a] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Upcoming Events
              </button>
              <button
                onClick={() => handleStatusChange("CLOSED")}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeStatus === "CLOSED"
                    ? "bg-[#f59f3a] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Past Events
              </button>
            </div>

            {/* Showing Info summary */}
            <div className="flex items-center justify-between mt-2 mb-2">
              <p className="text-sm font-semibold text-gray-500 text-left">
                Showing <span className="text-gray-800 font-bold">{totalCount}</span> {activeStatus === "ONLINE" ? "Upcoming" : "Past"} Events
              </p>
            </div>

            {/* Loading / Cards Grid */}
            {loading && events.length === 0 ? (
              <div className="py-20 text-center text-gray-500 font-medium bg-white rounded-3xl border border-gray-100 shadow-sm">
                Loading events...
              </div>
            ) : events.length === 0 ? (
              <div className="py-20 text-center text-gray-500 font-medium bg-white rounded-3xl border border-gray-100 shadow-sm">
                No events found.
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                    />
                  ))}
                </div>

                {/* Show More */}
                {hasMore && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      className="px-8 py-2.5 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-full hover:border-gray-300 hover:text-black transition-all shadow-sm"
                    >
                      Show More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Events;