import * as React from "react"
import { useNavigate } from "react-router-dom"
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

function Home() {
  const navigate = useNavigate()
  const [api, setApi] = React.useState<CarouselApi>()
  const [activeSlide, setActiveSlide] = React.useState(0)
  const [slides, setSlides] = React.useState<any[]>([])

  React.useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await viewAllEvents()
        const data = res?.data?.events || []
        
        if (data.length > 0) {
          const newSlides = data.slice(0, 3).map((event: any, idx: number) => ({
            id: event.id || idx + 100,
            isDefault: false,
            eyebrow: "Upcoming Event",
            title: event.title || "Untitled Event",
            description: event.description || "Join us for this exciting event.",
            cta: "View details",
            image: event.imageUrl || [Test1, Test2, Test3][idx % 3],
            location: event.location || "TBA",
            date: event.datetime ? new Date(event.datetime).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
            }) : "TBA",
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
    {slides.length > 0 && (
      <section className="min-h-fit flex justify-center pt-6 pb-12">
        <div className="w-full max-w-7xl h-[70vh] px-6">
          <Carousel
            orientation="horizontal"
            opts={{ loop: true }}
            setApi={setApi}
            className="h-full w-full"
            >
            <CarouselContent className="h-full ml-0">
              {slides.map((slide) => (
                <CarouselItem key={slide.id} className="h-full p-0">
                  <div 
                    className="upcoming-hero group w-full h-full border border-gray-100 shadow-sm bg-white flex"
                    style={{ margin: 0, borderRadius: "26px", overflow: "hidden", isolation: "isolate", clipPath: "inset(0 round 26px)" }}
                  >
                    <div
                      className="w-[50%] h-full min-h-full relative flex-shrink-0"
                      style={{
                        borderRadius: "24px 0 0 24px",
                        backgroundImage: `url(${slide.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        transition: "transform 0.6s ease",
                      }}
                    >
                      <span className="upcoming-hero__badge">Featured</span>
                    </div>

                    <div className="upcoming-hero__body h-full justify-center text-left p-6 lg:p-10">
                      <span className="upcoming-hero__date">
                        {slide.date}
                      </span>
                      <h2 className="upcoming-hero__title text-2xl lg:text-3xl font-semibold leading-tight text-[#1a1a2e]">
                        {slide.title}
                      </h2>
                      <p className="upcoming-hero__desc max-w-lg text-sm lg:text-base leading-relaxed text-[#6b7280] line-clamp-3 lg:line-clamp-4">
                        {slide.description}
                      </p>
                      <p className="upcoming-hero__venue text-xs lg:text-sm text-[#9ca3af]">
                        📍 {slide.location}
                      </p>
                      <div className="pt-2">
                        <button
                          onClick={() => navigate(slide.isDefault ? "/events" : `/events/${slide.id}`)}
                          className="upcoming-hero__cta"
                          type="button"
                        >
                          View details
                        </button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-row items-center gap-2">
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
                    : "flex h-2 w-2 items-center justify-center rounded-full bg-zinc-300 text-xs font-semibold text-zinc-700"
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
    )}

    {/* ── Upcoming Events Section ── */}
    <UpcomingEvents />

    {/* ── Footer ── */}
    <Footer />
  </>
  )
}

export default Home
