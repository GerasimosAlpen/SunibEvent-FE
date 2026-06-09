import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Navigationbar, Footer } from "../components";
import { viewEventById } from "@/API/GET/ViewOne";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navigationbar />

      <div className="flex-1">
        {loading ? (
          <div className="py-24 text-center">
            Loading event...
          </div>
        ) : !event ? (
          <div className="py-24 text-center">
            Event not found.
          </div>
        ) : (
          <>
            {/* HERO */}
            <section className="bg-orange-400">
              <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="grid gap-10 lg:grid-cols-2">
                  <div>
                    <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-orange-500">
                      {event.category.name}
                    </span>

                    <h1 className="mt-6 text-5xl font-bold text-white">
                      {event.title}
                    </h1>

                    <p className="mt-6 text-lg text-white/90">
                      {event.description}
                    </p>
                  </div>

                  <div>
                    <img
                      src={
                        event.imageUrl ??
                        "https://via.placeholder.com/800x500?text=Event+Image"
                      }
                      alt={event.title}
                      className="h-full w-full rounded-3xl object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* CONTENT */}
            <section className="mx-auto max-w-7xl px-6 py-12">
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <h2 className="mb-4 text-2xl font-bold">
                    About This Event
                  </h2>

                  <p className="leading-8 text-gray-600">
                    {event.description}
                  </p>
                </div>

                <div className="rounded-3xl border p-6 shadow-sm">
                  <h3 className="mb-6 text-xl font-bold">
                    Event Information
                  </h3>

                  <div className="space-y-4">
                    <p>
                      <strong>Date:</strong>
                      <br />
                      {new Date(event.datetime).toLocaleString()}
                    </p>

                    <p>
                      <strong>Location:</strong>
                      <br />
                      {event.location}
                    </p>

                    <p>
                      <strong>Organization:</strong>
                      <br />
                      {event.organization.name}
                    </p>

                    <p>
                      <strong>Category:</strong>
                      <br />
                      {event.category.name}
                    </p>

                    <p>
                      <strong>Quota:</strong>
                      <br />
                      {event.quota}
                    </p>

                    <p>
                      <strong>Status:</strong>
                      <br />
                      {event.status}
                    </p>
                  </div>

                  {event.registrationLink && (
                    <Button
                      asChild
                      className="mt-6 w-full bg-orange-400 hover:bg-orange-500"
                    >
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Register Now
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default EventDetail;