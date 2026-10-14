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
import { GuideDashboardScreen } from "./screens/GuideDashboardScreen";
import {
  signUpUser,
  signInUser,
  signInWithProvider,
  sendEmailOtp,
  verifyEmailOtp,
  resendEmailOtp,
  processProfileSession,
  isProfileSessionReady,
  markProfileSessionCompleted,
  getUserRole,
} from "@/services/authService";
import { createClient } from "@/lib/supabase/client";
import { createBookingInDb, getProfileAvatar } from "@/services/dbService";

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
// Screen 21: Guide Dashboard Screen (Earnings, Stats, Bookings, New tour)

export function InteractiveApp() {
  const [currentScreen, setCurrentScreen] = useState<number>(1);
  const [confirmedRole, setConfirmedRole] = useState<"tourist" | "guide">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("afriguide_user_role");
      if (stored === "guide" || stored === "tourist") return stored;
    }
    return "tourist";
  });
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
      const storedEmail = localStorage.getItem("afriguide_user_email");
      if (storedEmail) {
        const emailAvatar = localStorage.getItem(`afriguide_user_avatar_${storedEmail.trim().toLowerCase()}`);
        if (emailAvatar && emailAvatar.trim()) return emailAvatar;
      }
      const stored = localStorage.getItem("afriguide_user_avatar");
      if (stored && stored.trim()) return stored;
      const role = localStorage.getItem("afriguide_user_role");
      if (role === "guide") return "/images/desire_avatar.jpg";
    }
    return "/images/user_avatar.png";
  });
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [profileProcessingStatus, setProfileProcessingStatus] = useState<
    "verifying" | "processing" | "ready" | null
  >(null);
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

  // Listen for Supabase OAuth login redirects (Google & Facebook)
  React.useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const user = session.user;
          const email = user.email || "";
          const name =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            (email ? email.split("@")[0] : "AfriGuide Member");
          const cleanEmail = email.trim().toLowerCase();
          const emailSpecificAvatar = cleanEmail && typeof window !== "undefined"
            ? localStorage.getItem(`afriguide_user_avatar_${cleanEmail}`)
            : null;
          const generalAvatar = typeof window !== "undefined"
            ? localStorage.getItem("afriguide_user_avatar")
            : null;

          const avatar =
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            emailSpecificAvatar ||
            generalAvatar ||
            "/images/user_avatar.png";
          const storedRole =
            (sessionStorage.getItem("afriguide_oauth_role") as "tourist" | "guide") ||
            (localStorage.getItem("afriguide_user_role") as "tourist" | "guide") ||
            "tourist";

          setUserFullName(name);
          if (email) setRegisteredEmail(email);
          setUserAvatar(avatar);
          setConfirmedRole(storedRole);
          if (email) markProfileSessionCompleted(email);

          const oauthInProgress = sessionStorage.getItem("afriguide_oauth_in_progress");
          if (oauthInProgress) {
            sessionStorage.removeItem("afriguide_oauth_in_progress");
            sessionStorage.removeItem("afriguide_oauth_role");
            setCurrentScreen(storedRole === "guide" ? 21 : 13);
          }
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user && (event === "SIGNED_IN" || event === "USER_UPDATED")) {
          const user = session.user;
          const email = user.email || "";
          const name =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            (email ? email.split("@")[0] : "AfriGuide Member");
          const cleanEmail = email.trim().toLowerCase();
          const emailSpecificAvatar = cleanEmail && typeof window !== "undefined"
            ? localStorage.getItem(`afriguide_user_avatar_${cleanEmail}`)
            : null;
          const generalAvatar = typeof window !== "undefined"
            ? localStorage.getItem("afriguide_user_avatar")
            : null;

          const avatar =
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            emailSpecificAvatar ||
            generalAvatar ||
            "/images/user_avatar.png";
          const storedRole =
            (sessionStorage.getItem("afriguide_oauth_role") as "tourist" | "guide") ||
            (localStorage.getItem("afriguide_user_role") as "tourist" | "guide") ||
            "tourist";

          setUserFullName(name);
          if (email) setRegisteredEmail(email);
          setUserAvatar(avatar);
          setConfirmedRole(storedRole);
          if (email) markProfileSessionCompleted(email);

          const oauthInProgress = sessionStorage.getItem("afriguide_oauth_in_progress");
          if (oauthInProgress) {
            sessionStorage.removeItem("afriguide_oauth_in_progress");
            sessionStorage.removeItem("afriguide_oauth_role");
            setCurrentScreen(storedRole === "guide" ? 21 : 13);
          }
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (err) {
      console.warn("OAuth session init notice:", err);
    }
  }, []);

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setAuthLoading(true);
    setSignInError(null);
    setSignUpError(null);
    try {
      const res = await signInWithProvider(provider, confirmedRole);
      if (!res.success && res.error) {
        console.warn(`OAuth sign in notice for ${provider}:`, res.error);
        if (
          res.error.toLowerCase().includes("not enabled") ||
          res.error.toLowerCase().includes("unsupported")
        ) {
          alert(
            `${
              provider.charAt(0).toUpperCase() + provider.slice(1)
            } sign in requires enabling ${provider} in your Supabase Dashboard -> Authentication -> Providers. You can also sign up with email and password!`
          );
        } else {
          setSignInError(res.error);
          setSignUpError(res.error);
        }
      }
    } catch (err) {
      console.error("Social login exception:", err);
    } finally {
      setAuthLoading(false);
    }
  };

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
              if (typeof window !== "undefined") {
                localStorage.setItem("afriguide_user_role", role);
                if (role === "guide") {
                  setUserAvatar("/images/desire_avatar.jpg");
                  localStorage.setItem("afriguide_user_avatar", "/images/desire_avatar.jpg");
                }
              }
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
            errorMessage={signUpError}
            onBack={() => {
              setSignUpError(null);
              setCurrentScreen(8);
            }}
            onSignIn={() => {
              setSignUpError(null);
              setCurrentScreen(10);
            }}
            onSocialLogin={handleSocialLogin}
            onCreateAccount={async (data) => {
              setSignUpError(null);
              const selectedRole = data?.role || confirmedRole;
              setConfirmedRole(selectedRole);

              setAuthLoading(true);
              try {
                const res = await signUpUser({
                  name: data.name,
                  email: data.email,
                  password: data.password || "",
                  role: selectedRole,
                });

                if (!res.success) {
                  // STOP: Do NOT proceed if email is duplicate or password is weak!
                  setSignUpError(res.error || "Failed to create account.");
                  setAuthLoading(false);
                  return;
                }

                if (typeof window !== "undefined") {
                  localStorage.setItem("afriguide_user_role", selectedRole);
                  if (data?.email) {
                    localStorage.setItem(`afriguide_user_role_${data.email.trim().toLowerCase()}`, selectedRole);
                  }
                  if (selectedRole === "guide") {
                    setUserAvatar("/images/desire_avatar.jpg");
                    localStorage.setItem("afriguide_user_avatar", "/images/desire_avatar.jpg");
                  }
                }
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

                // Send the 4-digit verification code directly to their email via Resend / SMTP
                await sendEmailOtp(data.email);
                setCurrentScreen(12);
              } catch (err: any) {
                console.warn("Sign up caught:", err);
                setSignUpError(err?.message || "An error occurred during account creation.");
              } finally {
                setAuthLoading(false);
              }
            }}
          />
        );

      case 10:
        // Screen 10: "Welcome back" (Sign In with Supabase)
        return (
          <SignInScreen
            initialEmail={registeredEmail}
            errorMessage={signInError}
            isLoading={authLoading}
            onSocialLogin={handleSocialLogin}
            onSignUp={() => {
              setSignInError(null);
              setSignUpError(null);
              setCurrentScreen(9);
            }}
            onBack={() => {
              setSignInError(null);
              setCurrentScreen(9);
            }}
            onVerifyOtp={() => {
              setSignInError(null);
              setCurrentScreen(12);
            }}
            onForgotPassword={() => alert("Password reset link sent to your email.")}
            onLogin={async (data) => {
              setAuthLoading(true);
              setSignInError(null);
              try {
                if (data.email) {
                  setRegisteredEmail(data.email);
                  if (typeof window !== "undefined") {
                    localStorage.setItem("afriguide_user_email", data.email);
                  }
                }

                // Strictly ensure profile session is verified & processed before permitting login
                if (!isProfileSessionReady(data.email)) {
                  setSignInError(
                    "Profile session not initialized. Please verify your OTP code to complete your profile setup before logging in."
                  );
                  return;
                }

                const res = await signInUser(data.email, data.password);
                if (!res.success) {
                  setSignInError(res.error || "Unable to sign in. Please verify your credentials.");
                  return;
                }

                const cleanEmail = data.email.trim().toLowerCase();
                setRegisteredEmail(cleanEmail);
                if (typeof window !== "undefined") {
                  localStorage.setItem("afriguide_user_email", cleanEmail);
                }

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

                // Restore user's avatar
                const savedAvatar = typeof window !== "undefined"
                  ? localStorage.getItem(`afriguide_user_avatar_${cleanEmail}`) ||
                    userObj?.user_metadata?.avatar_url ||
                    localStorage.getItem("afriguide_user_avatar")
                  : null;

                if (savedAvatar && savedAvatar.trim()) {
                  setUserAvatar(savedAvatar);
                }

                // Check Supabase profiles table for avatar in background
                getProfileAvatar(cleanEmail).then((cloudAvatar) => {
                  if (cloudAvatar && cloudAvatar.trim()) {
                    setUserAvatar(cloudAvatar);
                  }
                });

                // Determine whether user signed up as guide or tourist
                const resolvedRole = getUserRole(data.email) || confirmedRole;
                setConfirmedRole(resolvedRole);

                // If user is a guide, navigate to Guide Dashboard (Screen 21)!
                if (resolvedRole === "guide") {
                  setCurrentScreen(21);
                } else {
                  // Proceed to Tourist Home Screen
                  setCurrentScreen(13);
                }
              } catch (err: unknown) {
                console.warn("Login exception:", err);
                setSignInError("An unexpected error occurred during sign in. Please try again.");
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
            processingStatus={profileProcessingStatus}
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
              setProfileProcessingStatus("verifying");
              try {
                const res = await verifyEmailOtp(registeredEmail, code);
                if (!res.success) {
                  setProfileProcessingStatus(null);
                  alert(res.error || "Invalid 4-digit code. Please try again.");
                  return;
                }

                // Step 2: Transition to processing profile session
                setProfileProcessingStatus("processing");
                const sessionRes = await processProfileSession({
                  email: registeredEmail,
                  name: userFullName,
                  role: confirmedRole,
                  avatarUrl: userAvatar,
                });

                if (!sessionRes.success) {
                  setProfileProcessingStatus(null);
                  alert(sessionRes.error || "Profile session processing failed. Please try again.");
                  return;
                }

                // Step 3: Session processing successfully finalized
                setProfileProcessingStatus("ready");
                await new Promise((r) => setTimeout(r, 900));
                setProfileProcessingStatus(null);
                setSignInError(null);
                alert("Profile session processed and verified successfully! You can now sign in.");
                setCurrentScreen(10);
              } catch (err) {
                console.warn("Verification exception:", err);
                setProfileProcessingStatus(null);
                alert("An error occurred during verification. Please try again.");
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
                if (registeredEmail) {
                  localStorage.setItem(`afriguide_user_avatar_${registeredEmail.trim().toLowerCase()}`, newAvatar);
                }
              }
            }}
            onLogout={() => setCurrentScreen(10)}
            onNavigateGuideDashboard={() => setCurrentScreen(21)}
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
            onPayNow={async (info) => {
              setDemoPaymentInfo(info);
              if (demoBookingDetails) {
                try {
                  await createBookingInDb({
                    tourist_name: userFullName || "Traveler",
                    tourist_email: registeredEmail || undefined,
                    tour_title: demoBookingDetails.tour.title,
                    location: demoBookingDetails.tour.location,
                    tour_image_url: demoBookingDetails.tour.imageUrl,
                    date: demoBookingDetails.date,
                    time_slot: "09:00am-17:00pm",
                    party_size: demoBookingDetails.peopleCount,
                    price_per_person: demoBookingDetails.tour.pricePerPerson,
                    total_price: demoBookingDetails.totalPrice,
                    status: "Pending",
                    guide_name: demoBookingDetails.tour.guideName || "Desire Sibanda",
                    guide_avatar: "/images/desire_avatar.jpg",
                  });
                } catch (e) {
                  console.error("Failed to create booking in Supabase:", e);
                }
              }
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
                if (registeredEmail) {
                  localStorage.setItem(`afriguide_user_avatar_${registeredEmail.trim().toLowerCase()}`, newAvatar);
                }
              }
            }}
            onBack={() => (confirmedRole === "guide" ? setCurrentScreen(21) : setCurrentScreen(13))}
            onLogout={() => setCurrentScreen(10)}
            onBecomeGuide={() => setCurrentScreen(21)}
          />
        );

      case 21:
        // Screen 21: Guide Dashboard Screen (Earnings, Stats, Bookings, New tour)
        return (
          <GuideDashboardScreen
            guideName={userFullName || "Desire"}
            guideEmail={registeredEmail}
            avatarUrl={userAvatar || "/images/desire_avatar.jpg"}
            onLogout={() => setCurrentScreen(10)}
            onNavigateTourist={() => setCurrentScreen(13)}
            onUpdateAvatar={(newAvatar) => {
              setUserAvatar(newAvatar);
              if (typeof window !== "undefined") {
                localStorage.setItem("afriguide_user_avatar", newAvatar);
                if (registeredEmail) {
                  localStorage.setItem(`afriguide_user_avatar_${registeredEmail.trim().toLowerCase()}`, newAvatar);
                }
              }
            }}
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
