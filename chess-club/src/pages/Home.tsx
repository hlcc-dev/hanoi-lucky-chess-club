import { Suspense, lazy, useEffect, useState } from "react"
import { useInView } from "../hooks/useInView"
import HeroSection from "../components/homeComponents/HeroSection"
import Notifications from "../components/Notifications"
import { Link } from "react-router-dom"

const WhatToExpectSection = lazy(() => import("../components/homeComponents/WhatToExpectSection"))
const WhoCanJoinSection = lazy(() => import("../components/homeComponents/WhoCanJoinSection"))
const ClubInfoSection = lazy(() => import("../components/homeComponents/ClubInfoSection"))
const ImageCarousel = lazy(() => import("../components/homeComponents/ImageCarousel"))
const CallToAction = lazy(() => import("../components/homeComponents/CallToAction"))
const FAQ = lazy(() => import("../components/homeComponents/FAQ"))

function Home() {
  const { ref, inView } = useInView(0.3)
  const [openNotification, setOpenNotification] = useState(true)


  // Check notification only once daily
  useEffect(() => {
    try {
      const notificationData = localStorage.getItem("hasSeenNotification")
      if (!notificationData) return

      const parsedData = JSON.parse(notificationData)
      const currentDate = new Date()
      const savedDate = new Date(parsedData.timestamp)

      const isSameDay =
        currentDate.getDate() === savedDate.getDate() &&
        currentDate.getMonth() === savedDate.getMonth() &&
        currentDate.getFullYear() === savedDate.getFullYear()

      if (parsedData?.hasSeen && isSameDay) {
        setOpenNotification(false)
      }
    } catch {
      // If parsing fails, reset notification state safely
      setOpenNotification(true)
    }
  }, [])

  const handleCloseNotification = () => {
    localStorage.removeItem("hasSeenNotification")
    localStorage.setItem(
      "hasSeenNotification",
      JSON.stringify({ hasSeen: true, timestamp: new Date().toISOString() })
    )
    setOpenNotification(false)
  }

  return (
    <div className="flex flex-col grow w-full">
      <HeroSection />

      <Notifications isOpen={openNotification} onClose={handleCloseNotification}>
        <h2 className="text-3xl font-bold mb-4">Welcome to Hanoi Lucky Chess Club!</h2>

        <p className="mb-4 text-lg align-justify">
          We're excited to have you here! Before you explore our site, please{" "}
          <Link to="/chess-puzzles" className="text-blue-600 font-bold underline">
            go to daily puzzles
          </Link>{" "}
          to solve and show your chess skills!
        </p>
      </Notifications>

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