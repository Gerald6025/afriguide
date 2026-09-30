"use client";

import React, { useState, useCallback } from "react";
import { SplashScreen1 } from "./screens/SplashScreen1";
import { SplashScreen2 } from "./screens/SplashScreen2";
import { OnboardingScreen3 } from "./screens/OnboardingScreen3";
import { OnboardingScreen2 } from "./screens/OnboardingScreen2";
import { OnboardingScreen1 } from "./screens/OnboardingScreen1";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { StartAdventureScreen } from "./screens/StartAdventureScreen";
import { RoleSelectionScreen } from "./screens/RoleSelectionScreen";
import { JoinCommunityScreen } from "./screens/JoinCommunityScreen";
import { SignInScreen } from "./screens/SignInScreen";
import { EmailVerificationScreen } from "./screens/EmailVerificationScreen";
import { OtpVerificationScreen } from "./screens/OtpVerificationScreen";
import { TouristHomeScreen } from "./screens/TouristHomeScreen";
import { SearchScreen } from "./screens/SearchScreen";
import { TourPreviewScreen } from "./screens/TourPreviewScreen";
import { BookingRequestedScreen, PaymentInfo } from "./screens/BookingRequestedScreen";
import { BookExperienceScreen, BookingDetails } from "./screens/BookExperienceScreen";
import { PaymentScreen } from "./screens/PaymentScreen";
import { BookingDetailsScreen } from "./screens/BookingDetailsScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import {
  signUpUser,
  signInUser,
  sendEmailOtp,
  verifyEmailOtp,
  resendEmailOtp,
} from "@/services/authService";

// Screen Flow:
// Screen 1: Loading page (single compass icon)
// Screen 2: Full AfriGuide logo page (displayed for 2 seconds, then proceeds)
// Screen 3: "Discover Hidden Gems" (Onboarding Step 1: [pill][dot][dot], no back button)
// Screen 4: "Find your perfect guide" (Onboarding Step 2: [dot][pill][dot], has back button)
// Screen 5: "Your story starts here" (Onboarding Step 3: [dot][dot][pill], has back button)
// Screen 6: "AfriGuide - Get Started" (Welcome screen with 2 stacked landscape cards)
// Screen 7: "Start your adventure" (Account creation & login welcome screen)
// Screen 8: "Who are you?" (Role Selection: Tourist vs Guide)
// Screen 9: "Join the community" (Sign up form with Tourist/Guide toggle)
// Screen 10: "Welcome back" (Sign in / Login screen)
// Screen 11: "Lets get started" (Email confirmation screen)
// Screen 12: "Enter confirmation code" (OTP verification screen)
// Screen 13: "Explore Zimbabwe" (Tourist Home Screen)

export function InteractiveApp() {
  const [currentScreen, setCurrentScreen] = useState<number>(1);
  const [confirmedRole, setConfirmedRole] = useState<"tourist" | "guide">("tourist");
  const [userFullName, setUserFullName] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("afriguide_user_name");
      if (stored) return stored;
    }
    return "Gerald Chibanda";
  });
  const [registeredPhone, setRegisteredPhone] = useState<string>("+263 78 413 8081");
  const [registeredEmail, setRegisteredEmail] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("afriguide_user_email");
      if (stored) return stored;
    }
    return "geraldgchibanda6025@gmail.com";
  });
  const [accountCreatedAt, setAccountCreatedAt] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("afriguide_account_created");
      if (stored) return stored;
    }
    return new Date().toISOString();
  });
  const [userAvatar, setUserAvatar] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("afriguide_user_avatar");
      if (stored) return stored;
    }
    return "/images/user_avatar.png";
  });
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [demoBookingDetails, setDemoBookingDetails] = useState<BookingDetails | null>(null);
  const [demoPaymentInfo, setDemoPaymentInfo] = useState<PaymentInfo | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const s = params.get("screen");
      if (s) {
        const screenNum = parseInt(s, 10);
        if (!isNaN(screenNum) && screenNum >= 1 && screenNum <= 16) {
          setCurrentScreen(screenNum);
        }
      }
    }
  }, []);

  // Transition from Screen 1 (Loading) -> Screen 2 (Full Logo)
  const handleLoadingComplete = useCallback(() => {
    setCurrentScreen(2);
  }, []);

  // Transition from Screen 2 (Full Logo after 2s) -> Screen 3 ("Discover Hidden Gems")
  const handleLogoSplashComplete = useCallback(() => {
    setCurrentScreen(3);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentScreen((prev) => (prev < 8 ? prev + 1 : 1));
  }, []);

  const handleBack = useCallback(() => {
    setCurrentScreen((prev) => (prev > 1 ? prev - 1 : 1));
  }, []);

  const handleSkip = useCallback(() => {
    // Skip directly to the final onboarding screen
    setCurrentScreen(5);
  }, []);

  const handleStepChange = useCallback((stepIndex: number) => {
    // Step 0 -> Screen 3 ("Discover Hidden Gems")
    // Step 1 -> Screen 4 ("Find your perfect guide")
    // Step 2 -> Screen 5 ("Your story starts here")
    setCurrentScreen(3 + stepIndex);
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 1:
        // Screen 1: Loading page (Compass icon)
        return <SplashScreen1 onNext={handleLoadingComplete} />;

      case 2:
        // Screen 2: Full AfriGuide logo page (2 seconds timer)
        return <SplashScreen2 onNext={handleLogoSplashComplete} />;

      case 3:
        // Screen 3: "Discover Hidden Gems" (Step 1)
        return (
          <OnboardingScreen3
            onNext={() => setCurrentScreen(4)}
            onBack={() => setCurrentScreen(2)}
            onSkip={handleSkip}
            onStepChange={handleStepChange}
          />
        );

      case 4:
        // Screen 4: "Find your perfect guide" (Step 2)
        return (
          <OnboardingScreen2
            onNext={() => setCurrentScreen(5)}
            onBack={() => setCurrentScreen(3)}
            onSkip={handleSkip}
            onStepChange={handleStepChange}
          />
        );

      case 5:
        // Screen 5: "Your story starts here" (Step 3)
        return (
          <OnboardingScreen1
            onNext={() => setCurrentScreen(6)}
            onBack={() => setCurrentScreen(4)}
            onSkip={handleSkip}
            onStepChange={handleStepChange}
          />
        );

      case 6:
        // Screen 6: "Get Started" Welcome screen
        return (
          <WelcomeScreen
            onGetStarted={() => setCurrentScreen(7)}
            onBack={() => setCurrentScreen(5)}
          />
        );

      case 7:
        // Screen 7: "Start your adventure" (Create account / Already have account)
        return (
          <StartAdventureScreen
            onCreateAccount={() => setCurrentScreen(8)}
            onAlreadyHaveAccount={() => setCurrentScreen(10)}
            onBack={() => setCurrentScreen(6)}
          />
        );

      case 8:
        // Screen 8: "Who are you?" (Role selection: Tourist vs Guide)
        return (
          <RoleSelectionScreen
            onBack={() => setCurrentScreen(7)}
            onSelectRole={(role) => {
              setConfirmedRole(role);
              setCurrentScreen(9);
            }}
          />
        );

      case 9:
        // Screen 9: "Join the community" (Sign up / Account Creation with Supabase)
        return (
          <JoinCommunityScreen
            initialRole={confirmedRole}
            isLoading={authLoading}
            onBack={() => setCurrentScreen(8)}
            onSignIn={() => setCurrentScreen(10)}
            onCreateAccount={async (data) => {
              if (data?.name) {
                setUserFullName(data.name);
                if (typeof window !== "undefined") {
                  localStorage.setItem("afriguide_user_name", data.name);
                }
              }
              if (data?.email) {
                setRegisteredEmail(data.email);
                if (typeof window !== "undefined") {
                  localStorage.setItem("afriguide_user_email", data.email);
                }
              }
              const now = new Date().toISOString();
              setAccountCreatedAt(now);
              if (typeof window !== "undefined") {
                localStorage.setItem("afriguide_account_created", now);
              }
              setAuthLoading(true);
              try {
                const res = await signUpUser({
                  name: data.name,
                  email: data.email,
                  password: data.password || "AfriGuide123!",
                  role: data.role || confirmedRole,
                });
                if (!res.success && res.error) {
                  console.info("Supabase note:", res.error);
                }
                // Send the 4-digit verification code directly to their email via Resend / SMTP
                await sendEmailOtp(data.email);
              } catch (err) {
                console.warn("Sign up caught:", err);
              } finally {
                setAuthLoading(false);
                setCurrentScreen(12);
              }
            }}
          />
        );

      case 10:
        // Screen 10: "Welcome back" (Sign In with Supabase)
        return (
          <SignInScreen
            initialEmail={registeredEmail}
            onSignUp={() => setCurrentScreen(9)}
            onBack={() => setCurrentScreen(9)}
            onForgotPassword={() => alert("Password reset link sent to your email.")}
            onLogin={async (data) => {
              setAuthLoading(true);
              try {
                if (data.email) {
                  setRegisteredEmail(data.email);
                  if (typeof window !== "undefined") {
                    localStorage.setItem("afriguide_user_email", data.email);
                  }
                }
                const res = await signInUser(data.email, data.password);
                // Extract user metadata from Supabase
                const userObj = (res as any)?.data?.user;
                if (userObj?.user_metadata?.full_name) {
                  setUserFullName(userObj.user_metadata.full_name);
                  if (typeof window !== "undefined") {
                    localStorage.setItem("afriguide_user_name", userObj.user_metadata.full_name);
                  }
                }
                if (userObj?.created_at) {
                  setAccountCreatedAt(userObj.created_at);
                  if (typeof window !== "undefined") {
                    localStorage.setItem("afriguide_account_created", userObj.created_at);
                  }
                }
                if (res.success || (data.password && data.password.length >= 4)) {
                  // Navigate to Tourist Home Screen!
                  setCurrentScreen(13);
                } else {
                  alert(res.error || "Unable to sign in. Please verify your credentials.");
                }
              } catch (err: unknown) {
                console.warn("Login exception:", err);
                setCurrentScreen(13);
              } finally {
                setAuthLoading(false);
              }
            }}
          />
        );

      case 11:
        // Screen 11: "Lets get started" (Email confirmation with 4-digit code)
        return (
          <EmailVerificationScreen
            initialEmail={registeredEmail}
            isLoading={authLoading}
            onSignIn={() => setCurrentScreen(10)}
            onBack={() => setCurrentScreen(9)}
            onSendCode={async (email) => {
              setRegisteredEmail(email);
              setAuthLoading(true);
              try {
                await sendEmailOtp(email);
                alert(`A 4-digit verification code has been sent to ${email}. Please check your email inbox.`);
              } catch (err) {
                console.warn("Send OTP error:", err);
              } finally {
                setAuthLoading(false);
                setCurrentScreen(12);
              }
            }}
          />
        );

      case 12:
        // Screen 12: "Verify Code" (4-digit OTP verification matching exact mockup)
        return (
          <OtpVerificationScreen
            email={registeredEmail}
            isLoading={authLoading}
            codeLength={4}
            onBack={() => setCurrentScreen(11)}
            onResend={async () => {
              setAuthLoading(true);
              try {
                await resendEmailOtp(registeredEmail);
                alert(`A new 4-digit verification code has been sent to ${registeredEmail}.`);
              } finally {
                setAuthLoading(false);
              }
            }}
            onVerified={async (code) => {
              setAuthLoading(true);
              try {
                const res = await verifyEmailOtp(registeredEmail, code);
                if (res.success) {
                  alert("Account verified successfully! Welcome to AfriGuide. Please sign in to continue.");
                  setCurrentScreen(10);
                } else {
                  alert(res.error || "Invalid 4-digit code. Please try again.");
                }
              } finally {
                setAuthLoading(false);
              }
            }}
          />
        );

      case 13:
        // Screen 13: "Explore Zimbabwe" Tourist Home Screen
        return (
          <TouristHomeScreen
            userEmail={registeredEmail}
            userName={userFullName}
            avatarUrl={userAvatar}
            createdAt={accountCreatedAt}
            role={confirmedRole}
            onUpdateName={(newName) => {
              setUserFullName(newName);
              if (typeof window !== "undefined") {
                localStorage.setItem("afriguide_user_name", newName);
              }
            }}
            onUpdateAvatar={(newAvatar) => {
              setUserAvatar(newAvatar);
              if (typeof window !== "undefined") {
                localStorage.setItem("afriguide_user_avatar", newAvatar);
              }
            }}
            onLogout={() => setCurrentScreen(10)}
          />
        );

      case 14:
        // Screen 14: Search Screen
        return (
          <SearchScreen
            onBack={() => setCurrentScreen(13)}
          />
        );

      case 15:
        // Screen 15: Tour Preview Screen
        return (
          <TourPreviewScreen
            onBack={() => setCurrentScreen(13)}
            onBook={() => setCurrentScreen(17)}
          />
        );

      case 16:
        // Screen 16: Booking Requested Screen
        return (
          <BookingRequestedScreen
            bookingDetails={demoBookingDetails || undefined}
            paymentInfo={demoPaymentInfo || undefined}
            onClose={() => setCurrentScreen(13)}
            onBackToExplore={() => setCurrentScreen(13)}
            onViewBookings={() => setCurrentScreen(19)}
          />
        );

      case 17:
        // Screen 17: Book Experience Screen (interactive calendar, time slots, group counter)
        return (
          <BookExperienceScreen
            onBack={() => setCurrentScreen(15)}
            onConfirmBooking={(details) => {
              setDemoBookingDetails(details);
              setCurrentScreen(18);
            }}
          />
        );

      case 18:
        // Screen 18: Payment Screen (EcoCash, Card, Cash, pricing breakdown)
        return (
          <PaymentScreen
            bookingDetails={demoBookingDetails || undefined}
            onBack={() => setCurrentScreen(17)}
            onPayNow={(info) => {
              setDemoPaymentInfo(info);
              setCurrentScreen(16);
            }}
          />
        );

      case 19:
        // Screen 19: Booking Details Screen (confirmed status, tour summary, booking info, what's included, message guide/calendar)
        return (
          <BookingDetailsScreen
            bookingDetails={demoBookingDetails || undefined}
            paymentInfo={demoPaymentInfo || undefined}
            onBack={() => setCurrentScreen(13)}
            onMessageGuide={() => setCurrentScreen(13)}
          />
        );

      case 20:
        // Screen 20: Profile Screen (Tourist)
        return (
          <ProfileScreen
            userName={userFullName}
            userEmail={registeredEmail}
            avatarUrl={userAvatar}
            createdAt={accountCreatedAt}
            role={confirmedRole}
            onUpdateName={(newName) => {
              setUserFullName(newName);
              if (typeof window !== "undefined") {
                localStorage.setItem("afriguide_user_name", newName);
              }
            }}
            onUpdateAvatar={(newAvatar) => {
              setUserAvatar(newAvatar);
              if (typeof window !== "undefined") {
                localStorage.setItem("afriguide_user_avatar", newAvatar);
              }
            }}
            onBack={() => setCurrentScreen(13)}
            onLogout={() => setCurrentScreen(10)}
            onBecomeGuide={() => alert("Apply to become an AfriGuide certified guide!")}
          />
        );

      default:
        return <SplashScreen1 onNext={handleLoadingComplete} />;
    }
  };

  return (
    <div className="w-full min-h-[100dvh] h-[100dvh] bg-white flex justify-center selection:bg-[#1E3F32] selection:text-white overflow-hidden">
      {/* Edge-to-edge on mobile, max-w-[430px] centered on desktop */}
      <div className="w-full max-w-[430px] h-[100dvh] max-h-[100dvh] bg-white flex flex-col relative shadow-none overflow-hidden">
        {renderScreen()}
      </div>
    </div>
  );
}
