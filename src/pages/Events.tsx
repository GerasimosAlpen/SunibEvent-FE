import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

import { Navigationbar, Footer } from "../components";

import { viewAllEvents } from "@/API/GET/ViewAll";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

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

function EventCard({
  event,
}: Readonly<{ event: Event }>) {
  return (
    <Card className="h-full flex flex-col overflow-hidden rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-0 gap-0">
      <div className="relative">
        <img
          src={event.imageUrl ?? "https://via.placeholder.com/600x400?text=No+Image"}
          alt={event.title}
          className="h-56 w-full object-cover flex-shrink-0"
        />

  {/* CATEGORY BADGE */}
  <div className="absolute top-3 left-3">
    <span className="bg-orange-400 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
      {event.category?.name}
    </span>
  </div>
</div>

      <CardContent className="p-5 flex-1">
        <span className="text-sm text-orange-500 font-medium">
          {new Date(event.datetime).toLocaleDateString()}
        </span>

        <h3 className="mt-2 text-xl font-bold line-clamp-2">
          {event.title}
        </h3>

        <p className="mt-3 text-gray-500">
          📍 {event.location}
        </p>
      </CardContent>

      <CardFooter className="border-0 bg-transparent p-5 pt-0 mt-auto">
        <Button asChild className="w-full rounded-xl !bg-orange-400 !text-white border !border-orange-400 hover:!bg-white hover:!text-orange-400 hover:!border-orange-400 transition-all duration-300">
          <Link to={`/events/${event.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [visibleCount, setVisibleCount] =
    useState(9);

  useEffect(() => {
    let mounted = true;

    const fetchEvents = async () => {
      try {
        const res = await viewAllEvents();

        if (!mounted) return;

        setEvents(res?.data?.events || []);
      } catch (error) {
        console.error(
          "Failed to fetch events:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(
          events
            .map(
              (event) => event.category?.name
            )
            .filter(Boolean)
        )
      ),
    ];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchCategory =
        selectedCategory === "All" ||
        event.category?.name?.toLowerCase() ===
          selectedCategory.toLowerCase();

      const matchSearch =
        search.trim() === "" ||
        event.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        event.description
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [events, search, selectedCategory]);

  const displayedEvents =
    filteredEvents.slice(
      0,
      visibleCount
    );

  return (
    <>
      <Navigationbar />

      {/* HERO */}
      <section className="bg-orange-400">
        <div className="mx-auto max-w-7xl px-6 py-16 flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold text-white">
            What's Happening Next?
          </h1>

          <p className="mt-4 text-lg text-white/90 max-w-3xl mx-auto">
            Explore workshops, competitions,
            communities, and student activities
            happening around campus.
          </p>

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="flex items-center rounded-2xl bg-white p-2 shadow-xl">
              <div className="flex flex-1 items-center px-4">
                <Search className="mr-3 h-5 w-5 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search events..."
                  value={inputValue}
                  onChange={(e) =>
                    setInputValue(
                      e.target.value
                    )
                  }
                  className="w-full outline-none"
                />
              </div>

              <Button
                size="lg"
                className="rounded-xl bg-orange-400 hover:bg-orange-500"
                onClick={() => {
                  setSearch(inputValue);
                  setVisibleCount(10);
                }}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Button
              key={category}
              variant={
                selectedCategory === category
                  ? "default"
                  : "outline"
              }
              onClick={() => {
                setSelectedCategory(
                  category
                );
                setVisibleCount(10);
              }}
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* EVENT LIST */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        {!loading && (
          <p className="mb-6 text-gray-500">
            Showing{" "}
            {displayedEvents.length} of{" "}
            {filteredEvents.length} events
          </p>
        )}

        {loading ? (
          <div className="py-20 text-center">
            Loading events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            No events found.
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {displayedEvents.map(
                (event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                  />
                )
              )}
            </div>

            {visibleCount <
              filteredEvents.length && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() =>
                    setVisibleCount((prev) => prev + 9)
                  }
                  className="text-orange-400 font-medium hover:underline transition-all duration-200"
                >
                  Show More
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </>
  );
}

export default Events;