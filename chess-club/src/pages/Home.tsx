import { Suspense, lazy } from "react"
import { useInView } from "../hooks/useInView"
import HeroSection from "../components/homeComponents/HeroSection"
const WhatToExpectSection = lazy(() => import("../components/homeComponents/WhatToExpectSection"))
const WhoCanJoinSection = lazy(() => import("../components/homeComponents/WhoCanJoinSection"))
const ClubInfoSection = lazy(() => import("../components/homeComponents/ClubInfoSection"))
const ImageCarousel = lazy(() => import("../components/homeComponents/ImageCarousel"))
const CallToAction = lazy(() => import("../components/homeComponents/CallToAction"))
const FAQ = lazy(() => import("../components/homeComponents/FAQ"))

function Home() {
  const { ref, inView } = useInView(0.3)
  return (
    <div className="flex flex-col grow w-full ">
      <HeroSection />
      <div ref={ref}>
        {inView && (
          <Suspense fallback={null}>
            <ImageCarousel />
            <ClubInfoSection />
            <CallToAction />
            <WhatToExpectSection />
            <WhoCanJoinSection />
            <FAQ />
          </Suspense>
        )}
      </div>
    </div>
  )
}

export default Home