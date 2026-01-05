import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'

import ToastContainer from './components/Toast/ToastContainer';

import { Analytics } from '@vercel/analytics/react';


import { useBackgroundChessRefresh } from './hooks/useBackgroundChessRefresh';

const Home = lazy(() => import('./pages/Home'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const ChessPuzzle = lazy(() => import('./pages/ChessPuzzle'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  // Use background chess refresh hook
  useBackgroundChessRefresh();

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer />
      <Header />
      <Analytics />

      {/* MAIN CONTENT MUST GROW */}
      <main className="flex-1">
        <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/reset-password" element={<ResetPassword />} />
            <Route path="/chess-puzzles" element={<ChessPuzzle />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/Events" element={<h1>Events</h1>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main >

      <Footer />

    </div >
  );
}

export default App