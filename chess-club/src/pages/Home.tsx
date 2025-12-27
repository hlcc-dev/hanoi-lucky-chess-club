import HeroSection from "../components/homeComponents/HeroSection"
import ImageCarousel from "../components/homeComponents/ImageCarousel"
import ClubInfoSection from "../components/homeComponents/ClubInfoSection"
import CallToAction from "../components/homeComponents/CallToAction"
import WhatToExpectSection from "../components/homeComponents/WhatToExpectSection"
import WhoCanJoinSection from "../components/homeComponents/WhoCanJoinSection"
import FAQ from "../components/homeComponents/FAQ"

function Home() {
  return (
    <div className="flex flex-col grow w-full ">
      <HeroSection />
      <WhatToExpectSection />
      <WhoCanJoinSection />
      <ClubInfoSection />
      <ImageCarousel />
      <CallToAction />
      <FAQ />
    </div>
  )
}

export default Home