"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLogo from "../auth-logo";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { signIn } from "@/lib/services/userAuth";

const LoginPageSection = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const SignInHandler = async () => {
        setIsSubmitting(true);
        try {
            const response = await signIn({ email, password });

            if (response.status === 200) {
                toast.success("Login Successfully");
                router.push('/menu');
            } else {
                setEmail("");
                setPassword("");
                toast.error(response.data.message || "Incorrect email or password");
            }
        } catch (error: any) {
            console.error(error);
            toast.error("Incorrect email or password");
        } finally {
            setIsSubmitting(false);
        }
    }

    const onSignIn = async (e: any) => {
        e.preventDefault();
        if (!email) {
            toast.warning("Enter your email.");
            return;
        }
        if (!password) {
            toast.warning("Enter your password.");
            return;
        }
        try {
            await SignInHandler();
        } catch (err: any) {
            toast.warning(err.message);
        }
    };

    return (
        <>
            <div className="max-w-3xl mx-auto text-center pb-12">
                <AuthLogo />
                <h1 className="h2 bg-clip-text text-transparent bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60">Sign in to your account</h1>
            </div>

            <div className="max-w-sm mx-auto">
                <form onSubmit={onSignIn}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-300 font-medium mb-1" htmlFor="email">
                                Email
                            </label>
                            <input id="email" className="form-input w-full" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <div className="flex justify-between">
                                <label className="block text-sm text-slate-300 font-medium mb-1" htmlFor="password">
                                    Password
                                </label>
                                <Link className="text-sm font-medium text-purple-500 hover:text-purple-400 transition duration-150 ease-in-out ml-2" href="/reset-password">
                                    Forgot?
                                </Link>
                            </div>
                            <input id="password" className="form-input w-full" type="password" autoComplete="on" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`btn text-sm text-white bg-purple-500 hover:bg-purple-600 w-full shadow-sm group ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <div className="text-sm text-slate-400">
                        Don't have an account?{" "}
                        <Link className="font-medium text-purple-500 hover:text-purple-400 transition duration-150 ease-in-out" href="/signup">
                            Sign up
                        </Link>
                    </div>
                </div>
                <div className="flex items-center my-6">
                    <div className="border-t border-slate-800 grow mr-3" aria-hidden="true" />
                    <div className="text-sm text-slate-500 italic"></div>
                    <div className="border-t border-slate-800 grow ml-3" aria-hidden="true" />
                </div>
            </div>
        </>
    );
}

export default LoginPageSection;
