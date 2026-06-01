import { useEffect, useState } from "react";
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
  registrationLink: string;
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

const categories = [
  "All",
  "Technology",
  "Sports",
  "Music",
  "Education",
  "Business",
  "Arts & Culture",
  "Health & Wellness",
];

function EventCard({ event }: Readonly<{ event: Event }>) {
  return (
    <Card className="overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl p-0 gap-0">
      {/* Image */}
      <div className="relative">
        <img
          src={
            event.imageUrl ??
            "https://via.placeholder.com/600x400?text=No+Image"
          }
          alt={event.title}
          className="h-56 w-full object-cover"
        />

        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium shadow">
            {event.category?.name}
          </span>

          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium shadow">
            {event.status}
          </span>
        </div>
      </div>

      <CardContent className="p-5">
        <p className="text-sm font-medium text-orange-500">
          {new Date(event.datetime).toLocaleString()}
        </p>

        <h3 className="mt-3 text-xl font-bold line-clamp-2">
          {event.title}
        </h3>

        <div className="mt-4 space-y-2 text-gray-500">
          <p>📍 {event.location}</p>
          <p>👥 {event.quota} attendees</p>
        </div>
      </CardContent>

      <CardFooter className="border-0 bg-transparent p-5 pt-0">
        <Button
          asChild
          className="w-full rounded-2xl bg-sky-300 hover:bg-sky-400"
        >
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Details →
          </a>
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

  useEffect(() => {
    let mounted = true;

    const fetchEvents = async () => {
      try {
        const res = await viewAllEvents();

        if (mounted) {
          setEvents(res?.data?.events || []);
        }
      } catch (err) {
        console.error(err);
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

  const filteredEvents = events.filter((event) => {
    const matchCategory =
      selectedCategory === "All" ||
      event.category?.name?.toLowerCase() ===
        selectedCategory.toLowerCase();

    const matchSearch =
      search === "" ||
      event.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      event.description
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <>
      <Navigationbar />

      {/* HERO */}
      <section className="bg-orange-400">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h1 className="text-5xl font-bold text-white">
            What's Happening Next?
          </h1>

          <p className="mt-4 text-lg text-white/90">
            Explore workshops, competitions, and student
            meetups across the Sunib campus ecosystem.
          </p>

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="flex items-center rounded-2xl bg-white p-2 shadow-2xl">
              <div className="flex flex-1 items-center px-4">
                <Search className="mr-3 h-5 w-5 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search events..."
                  value={inputValue}
                  onChange={(e) =>
                    setInputValue(e.target.value)
                  }
                  className="w-full outline-none"
                />
              </div>

              <Button
                size="lg"
                className="rounded-xl bg-orange-400 hover:bg-orange-500"
                onClick={() => setSearch(inputValue)}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER */}
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
              onClick={() =>
                setSelectedCategory(category)
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* EVENTS */}
      <section className="mx-auto max-w-7xl px-6">
        {!loading && (
          <p className="mb-6 text-gray-500">
            Showing {filteredEvents.length} events
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
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}

export default Events;