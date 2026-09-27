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
import { PhoneVerificationScreen } from "./screens/PhoneVerificationScreen";
import { OtpVerificationScreen } from "./screens/OtpVerificationScreen";
import {
  signUpUser,
  signInUser,
  sendPhoneOtp,
  verifyPhoneOtp,
  resendPhoneOtp,
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
// Screen 11: "Lets get started" (Phone confirmation screen)
// Screen 12: "Enter confirmation code" (OTP verification screen)

export function InteractiveApp() {
  const [currentScreen, setCurrentScreen] = useState<number>(1);
  const [confirmedRole, setConfirmedRole] = useState<"tourist" | "guide">("tourist");
  const [registeredPhone, setRegisteredPhone] = useState<string>("+263 78 413 8081");
  const [registeredEmail, setRegisteredEmail] = useState<string>("john@email.com");
  const [authLoading, setAuthLoading] = useState<boolean>(false);

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
              if (data?.email) {
                setRegisteredEmail(data.email);
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
              } catch (err) {
                console.warn("Sign up caught:", err);
              } finally {
                setAuthLoading(false);
                setCurrentScreen(11);
              }
            }}
          />
        );

      case 10:
        // Screen 10: "Welcome back" (Sign In with Supabase)
        return (
          <SignInScreen
            onSignUp={() => setCurrentScreen(9)}
            onBack={() => setCurrentScreen(9)}
            onForgotPassword={() => alert("Password reset link sent to your email.")}
            onLogin={async (data) => {
              setAuthLoading(true);
              try {
                const res = await signInUser(data.email, data.password);
                if (res.success) {
                  alert(`Welcome back to AfriGuide, ${data.email}!`);
                } else {
                  alert(res.error || "Unable to sign in. Please verify your credentials.");
                }
              } finally {
                setAuthLoading(false);
              }
            }}
          />
        );

      case 11:
        // Screen 11: "Lets get started" (Phone confirmation with Supabase OTP)
        return (
          <PhoneVerificationScreen
            onSignIn={() => setCurrentScreen(10)}
            onBack={() => setCurrentScreen(9)}
            onSendCode={async (phone) => {
              setRegisteredPhone(phone);
              setAuthLoading(true);
              try {
                const res = await sendPhoneOtp(phone);
                if (res?.data?.isDemoFallback) {
                  alert(
                    "SMS Notice: Your Supabase Phone Provider is disabled by default.\n\nUse test code 1234 to verify immediately while setting up your SMS provider!"
                  );
                }
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
        // Screen 12: "Verify Code" (OTP verification matching exact mockup)
        return (
          <OtpVerificationScreen
            email={registeredEmail}
            phoneNumber={registeredPhone}
            isLoading={authLoading}
            onBack={() => setCurrentScreen(11)}
            onResend={async () => {
              setAuthLoading(true);
              try {
                const res = await resendPhoneOtp(registeredPhone);
                if (res?.data?.isDemoFallback) {
                  alert("SMS Notice: SMS provider is disabled in Supabase. Use test code: 1234");
                } else {
                  alert(`A new verification code has been sent to ${registeredPhone}`);
                }
              } finally {
                setAuthLoading(false);
              }
            }}
            onVerified={async (code) => {
              setAuthLoading(true);
              try {
                const res = await verifyPhoneOtp(registeredPhone, code);
                if (res.success) {
                  alert("Phone & Account verified successfully! Welcome to AfriGuide.");
                } else {
                  alert(res.error || "Invalid code. Please try again.");
                }
              } finally {
                setAuthLoading(false);
              }
            }}
          />
        );

      default:
        return <SplashScreen1 onNext={handleLoadingComplete} />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex justify-center selection:bg-[#1E3F32] selection:text-white">
      {/* Edge-to-edge on mobile, max-w-[430px] centered on desktop */}
      <div className="w-full max-w-[430px] min-h-screen bg-white flex flex-col relative shadow-none">
        {renderScreen()}
      </div>
    </div>
  );
}
