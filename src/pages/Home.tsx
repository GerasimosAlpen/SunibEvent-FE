import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Navigationbar, Footer } from "../components"
import UpcomingEvents from "../components/UpcomingEvents"
import { Test1, Test2, Test3 } from "@/assets"
import { viewAllEvents } from "@/API/GET/ViewAll"

const DEFAULT_SLIDES = [
  {
    id: 1,
    eyebrow: "Featured experience",
    title: "Discover what is happening on campus",
    description:
      "Browse upcoming events, workshops, and community moments in one place.",
    cta: "Explore events",
    image: Test1,
  },
  {
    id: 2,
    eyebrow: "Join in",
    title: "Stay close to the communities you care about",
    description:
      "Find the newest announcements and stay ready for the next session or meetup.",
    cta: "See details",
    image: Test2,
  },
  {
    id: 3,
    eyebrow: "Plan ahead",
    title: "Save your place before everything fills up",
    description:
      "Pick the events that matter most and keep your schedule organized.",
    cta: "Reserve spot",
    image: Test3,
  },
]

function Home() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [activeSlide, setActiveSlide] = React.useState(0)
  const [slides, setSlides] = React.useState(DEFAULT_SLIDES)

  React.useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await viewAllEvents()
        const data = res?.data?.events || []
        
        if (data.length > 0) {
          const newSlides = data.slice(0, 3).map((event: any, idx: number) => ({
            id: event.id || idx + 100,
            eyebrow: "Upcoming Event",
            title: event.title || "Untitled Event",
            description: event.description || "Join us for this exciting event.",
            cta: "View details",
            image: event.imageUrl || [Test1, Test2, Test3][idx % 3],
          }))
          setSlides(newSlides)
        }
      } catch (error) {
        console.error("Failed to load carousel slides:", error)
      }
    }

    fetchSlides()
  }, [])

  React.useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setActiveSlide(api.selectedScrollSnap())
    }

    onSelect()
    api.on("select", onSelect)
    api.on("reInit", onSelect)

    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api])

  React.useEffect(() => {
    if (!api) return

    const id = window.setInterval(() => {
      api.scrollNext()
    }, 20000)

    return () => window.clearInterval(id)
  }, [api])

  return (
    <>
    <Navigationbar/>
    <section className="min-h-fit flex justify-center pt-6">
      <div className="w-full max-w-7xl h-[70vh]">
        <Carousel
          orientation="vertical"
          opts={{ loop: true }}
          setApi={setApi}
          className="h-full w-full"
          >
          <CarouselContent className="h-full">
            {slides.map((slide) => (
              <CarouselItem key={slide.id} className="h-full py-5">
                <Card className="relative h-full overflow-hidden rounded-3xl border-0 bg-zinc-200 py-0 shadow-none">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-in-out transform-gpu"
                    style={{ willChange: "transform, opacity" }}
                    />
                  <div className="absolute inset-0 pointer-events-none bg-linear-to-r from-black via-black/20 to-transparent" />

                  <CardContent className="relative z-10 flex h-full items-end p-6 text-left lg:p-10 transition-opacity duration-700 ease-in-out">
                    <div className="max-w-2xl space-y-4 text-white drop-shadow">
                      <span className="text-sm font-medium uppercase tracking-[0.24em] text-white/70">
                        {slide.eyebrow}
                      </span>
                      <h2 className="text-3xl leading-tight text-white font-semibold lg:text-4xl">
                        {slide.title}
                      </h2>
                      <p className="max-w-lg text-base leading-7 text-white/80 lg:text-lg">
                        {slide.description}
                      </p>
                      <div className="pt-2">
                        <Button size="sm" className="rounded-full bg-orange-300 px-3 transform-gpu transition-transform duration-300 hover:scale-105">
                          {slide.cta}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="absolute right-3 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-2">
            {slides.map((slide, index) => {
              const isActive = index === activeSlide
              
              return (
                <button
                key={index}
                type="button"
                onClick={() => api?.scrollTo(index)}
                className={
                  isActive
                  ? "flex h-2 w-2 items-center justify-center rounded-full bg-orange-400 text-xs font-semibold text-white"
                  : "flex h-2 w-2 items-center justify-center rounded-full bg-white text-xs font-semibold text-zinc-700"
                }
                aria-label={`Go to slide ${slide.id}`}
                aria-current={isActive ? "true" : undefined}
                >
                </button>
              )
            })}
          </div>
        </Carousel>
      </div>
    </section>

    {/* ── Upcoming Events Section ── */}
    <UpcomingEvents />

    {/* ── Footer ── */}
    <Footer />
  </>
  )
}

export default Home
