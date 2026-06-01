import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SunibLogo } from "../../assets";
import { Login } from "@/API/POST";

function Loginpage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        if (!trimmedEmail || !trimmedPassword) {
            setError("Email and password are required.");
            setIsSubmitting(false);
            return;
        }

        if (!trimmedEmail.includes("@")) {
            setError("Please enter a valid email address.");
            setIsSubmitting(false);
            return;
        }

        try {
            const result = await Login(trimmedEmail, trimmedPassword);

            if (result?.error) {
                setError(result.error);
                return;
            }

            // Store auth token on successful login
            if (result?.token) {
                localStorage.setItem("token", result.token);
            }

            console.log("Login success", result);
            navigate("/");
        } catch {
            setError("Unable to connect to server. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f6f6f7] px-4 py-8 grid place-items-center">
            <div className="w-full max-w-[500px] rounded-[14px] border border-[#ececf0] bg-white px-6 pb-5 pt-6 text-left shadow-[0_12px_22px_rgba(15,15,15,0.12)]">
                <div className="grid place-items-center">
                    <img src={SunibLogo} alt="SunibEvent" className="h-7" />
                </div>

                <div className="mt-4">
                    <h1 className="text-[20px] font-semibold text-[#1e1b24]">Welcome back</h1>
                    <p className="mt-1 text-[13px] text-[#8b8793]">
                        Login to continue to Sunib Event
                    </p>
                </div>

                <button
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#e4e4ea] bg-white px-3 py-2.5 text-[13px] font-medium text-[#2c2a33] transition hover:border-[#d1d1d9] hover:shadow-[0_4px_10px_rgba(15,15,15,0.08)]"
                    type="button"
                >
                    <span className="inline-flex h-[18px] w-[18px]" aria-hidden="true">
                        <svg viewBox="0 0 24 24" role="presentation" className="h-full w-full">
                            <path
                                d="M23.49 12.27c0-.85-.07-1.46-.22-2.09H12v4.03h6.62c-.13 1.03-.85 2.58-2.45 3.62l-.02.14 3.56 2.76.25.02c2.3-2.12 3.53-5.24 3.53-8.48z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 24c3.24 0 5.96-1.06 7.95-2.88l-3.79-2.92c-1.01.7-2.36 1.19-4.16 1.19-3.17 0-5.86-2.11-6.82-5.03l-.13.01-3.69 2.89-.05.12C3.29 21.62 7.4 24 12 24z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.18 14.36c-.25-.72-.39-1.49-.39-2.29s.14-1.57.38-2.29l-.01-.15-3.73-2.93-.12.06A11.95 11.95 0 0 0 0 12.07c0 1.92.46 3.74 1.31 5.35l3.87-3.06z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 4.75c2.06 0 3.45.89 4.24 1.63l3.09-3.01C17.95 1.06 15.23 0 12 0 7.4 0 3.29 2.38 1.31 6.72l3.85 2.99C6.12 6.87 8.83 4.75 12 4.75z"
                                fill="#EA4335"
                            />
                        </svg>
                    </span>
                    Continue with Google
                </button>

                <div className="relative mt-4 text-center text-[12px] text-[#9a95a4]">
                    <span className="relative z-10 bg-white px-2">Or continue with email</span>
                    <span className="absolute left-0 top-1/2 h-px w-[38%] -translate-y-1/2 bg-[#ececf0]" />
                    <span className="absolute right-0 top-1/2 h-px w-[38%] -translate-y-1/2 bg-[#ececf0]" />
                </div>

                <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
                    <label className="flex flex-col gap-1.5 text-[12px] text-[#6f6a78]">
                        <span>Email address</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="you@example.com"
                            className="rounded-lg border border-[#e4e4ea] bg-white px-3 py-2.5 text-[13px] text-[#1f1c26] placeholder:text-[#b1adba]"
                        />
                    </label>

                    <label className="flex flex-col gap-1.5 text-[12px] text-[#6f6a78]">
                        <span>Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="rounded-lg border border-[#e4e4ea] bg-white px-3 py-2.5 text-[13px] text-[#1f1c26]"
                        />
                    </label>

                    <div className="flex items-center justify-between text-[12px]">
                        <label className="inline-flex items-center gap-1.5 text-[#8b8793]">
                            <input type="checkbox" className="accent-[#f59f3a]" />
                            <span>Remember me</span>
                        </label>
                        <a className="text-[#f59f3a] hover:underline" href="#">
                            Forgot password?
                        </a>
                    </div>

                    {error ? (
                        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-600">
                            {error}
                        </p>
                    ) : null}

                    <button
                        className="mt-1 rounded-lg bg-[#f59f3a] px-3 py-2.5 text-[13px] font-semibold text-white shadow-[0_6px_12px_rgba(245,159,58,0.35)] hover:brightness-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Login in..." : "Login"}
                    </button>
                </form>

                <p className="mt-4 text-center text-[12px] text-[#8b8793]">
                    Don't have an account?
                    <a className="ml-1 font-semibold text-[#f59f3a] hover:underline" href="/signup">
                        Signup
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Loginpage;