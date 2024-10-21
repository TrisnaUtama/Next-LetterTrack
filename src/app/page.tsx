"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useFormState, useFormStatus } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import Logo from "../../public/logo-angkasapura.png";
import loginAction from "../hooks/(auth)/login/loginAction";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="mt-5 p-6 text-lg bg-[#019BE1] hover:bg-[#01557B] font-semibold w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  );
}

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useFormState(loginAction, null);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((show) => !show);
  };

  useEffect(() => {
    if (state?.success && state.redirect) {
      router.push(state.redirect);
    }
  }, [state, router]);

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-r from-[#01557B] to-[#019BE1] p-4 md:p-10">
      <div className="flex items-center justify-start mb-8">
        <Image src={Logo} height={100} width={100} alt="logo" />
        <p className="text-4xl font-bold ml-4">
          <span className="text-white">Angkasapura |</span>{" "}
          <span className="text-[#66B82F]">Airports</span>
        </p>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <Card className="p-8 w-full max-w-md h-auto">
          <CardHeader>
            <CardTitle className="text-center text-3xl">Sign In</CardTitle>
            <CardDescription className="text-sm font-semibold text-center">
              More than just tracking, we empower you to
              <br />
              your letters with ease and efficiency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction}>
              <Label htmlFor="username">Username</Label>
              <Input
                name="username"
                type="text"
                id="username"
                placeholder="Enter your username"
                className="mb-4 mt-1.5 h-10 p-3 font-medium border border-gray-300 focus:border-blue-500 focus:outline-none"
              />
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="mt-1.5 h-10 p-3 font-medium border border-gray-300 focus:border-blue-500 focus:outline-none"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              <div className="grid mt-5">
                {state?.success === false && (
                  <p className="text-red-500 mt-2 text-center">{state.error}</p>
                )}
                <SubmitButton />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
