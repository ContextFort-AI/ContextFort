"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2Icon, ShieldCheckIcon, InfoIcon } from "lucide-react";

type AuthStep = "email" | "otp" | "authenticated";

interface AuthModalProps {
  onAuthenticated: () => void;
}

// Corporate email validation - block common personal domains
const PERSONAL_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "aol.com",
  "live.com",
  "msn.com",
  "mail.com",
  "protonmail.com",
  "yandex.com",
  "zoho.com"
];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isCorporateEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return !PERSONAL_EMAIL_DOMAINS.includes(domain);
}

export function AuthModal({ onAuthenticated }: AuthModalProps) {
  const [step, setStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!isCorporateEmail(email)) {
      setError("Please use your corporate email address. Personal emails (Gmail, Yahoo, etc.) are not allowed.");
      return;
    }

    setIsLoading(true);

    try {
      // @ts-ignore - Chrome extension API
      const result: any = await new Promise((resolve) => {
        // @ts-ignore - Chrome extension API
        chrome.runtime.sendMessage({
          action: "login",
          email: email
        }, (response: any) => {
          resolve(response);
        });
      });

      if (result && result.success) {
        // @ts-ignore - Chrome extension API
        await chrome.storage.local.set({ userEmail: email });
        setSuccess(result.message || "OTP sent to your email");
        setStep("otp");
      } else {
        setError(result?.error || "Failed to send OTP");
      }
    } catch (err) {
      setError("Failed to connect to authentication service");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      // @ts-ignore - Chrome extension API
      const result: any = await new Promise((resolve) => {
        // @ts-ignore - Chrome extension API
        chrome.runtime.sendMessage({
          action: "verifyOTP",
          email: email,
          otpCode: otp
        }, (response: any) => {
          resolve(response);
        });
      });

      if (result && result.success) {
        setSuccess("Email verified successfully!");

        // Call PostHog identify after successful verification
        try {
          // @ts-ignore - Chrome extension API
          await new Promise((resolve) => {
            // @ts-ignore - Chrome extension API
            chrome.runtime.sendMessage({
              action: "identifyUser",
              email: email
            }, (response: any) => {
              resolve(response);
            });
          });
        } catch (err) {
          console.error("PostHog identify error:", err);
        }

        // Wait briefly to show success message
        setTimeout(() => {
          setStep("authenticated");
          onAuthenticated();
        }, 1000);
      } else {
        setError(result?.error || "Invalid OTP code");
      }
    } catch (err) {
      setError("Failed to verify OTP");
      console.error("OTP verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // @ts-ignore - Chrome extension API
      const result: any = await new Promise((resolve) => {
        // @ts-ignore - Chrome extension API
        chrome.runtime.sendMessage({
          action: "resendOTP",
          email: email
        }, (response: any) => {
          resolve(response);
        });
      });

      if (result && result.success) {
        setSuccess(result.message || "OTP resent successfully");
      } else {
        setError(result?.error || "Failed to resend OTP");
      }
    } catch (err) {
      setError("Failed to resend OTP");
      console.error("Resend OTP error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheckIcon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {step === "email" ? "Welcome to ContextFort" : "Verify Your Email"}
          </CardTitle>
          <CardDescription>
            {step === "email"
              ? "Enter your corporate email to get started"
              : `We've sent a 6-digit code to ${email}`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Corporate Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  Personal emails (Gmail, Yahoo, etc.) are not accepted
                </p>
              </div>

              {/* Privacy Disclosure */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                <div className="flex gap-3">
                  <InfoIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                      Privacy Notice
                    </h4>
                    <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                      ContextFort monitors AI agent activity by:
                    </p>
                    <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 ml-4 list-disc">
                      <li>Capturing screenshots of web pages when AI agents interact with them</li>
                      <li>Recording URLs, page titles, and user interactions (clicks, inputs, scrolls)</li>
                      <li>Storing all data locally on your device</li>
                    </ul>
                    <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed mt-2">
                      <strong>Note:</strong> We recommend not using AI agents on sensitive sites (banking, healthcare, etc.) while this extension is active.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
                  {success}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Processing..." : "Continue"}
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleOTPVerify} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium">
                  Enter OTP Code
                </label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
                  {success}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                    setError("");
                    setSuccess("");
                  }}
                  disabled={isLoading}
                >
                  Change Email
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Resend OTP"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
