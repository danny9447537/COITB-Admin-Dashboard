import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInUser } from "../features/user/userSlice";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

export default function SignInPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted }
    } = useForm({
        defaultValues: { Email: "", Password: "" }
    });

    const onSubmit = async (data) => {
        try {
            const result = await dispatch(signInUser(data)).unwrap();
            if (result.uid) navigate("/");
        } catch (err) {
            alert("Login failed: " + err);
        }
    };

    return (
        <div className="flex h-screen">
            {/* Left: sign‑in form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-md bg-white p-8 rounded-xl shadow">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Vendor Portal Sign In
                    </h2>

                    {/* Email */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        {...register("Email", { required: "Email is required" })}
                        type="email"
                        className="w-full px-4 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="you@example.com"
                    />
                    {isSubmitted && errors.Email && (
                        <p className="text-red-500 text-sm mb-4">{errors.Email.message}</p>
                    )}

                    {/* Password */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative mb-4">
                        <input
                            {...register("Password", { required: "Password is required" })}
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-3 text-gray-500">
                            {showPassword ? (
                                <MdOutlineVisibilityOff size={20} />
                            ) : (
                                <MdOutlineVisibility size={20} />
                            )}
                        </button>
                    </div>
                    {isSubmitted && errors.Password && (
                        <p className="text-red-500 text-sm mb-4">{errors.Password.message}</p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition mb-4">
                        Sign In
                    </button>

                    {/* Sign up / contact */}
                    <p className="text-center text-gray-500 text-sm">
                        Don’t have an account?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/signup")}
                            className="text-blue-600 hover:underline">
                            Contact COITB
                        </button>
                    </p>
                </form>
            </div>

            {/* Right bouncing ball (only on lg+) */}
            <div className="hidden lg:flex w-1/2 bg-gray-200 items-center justify-center relative overflow-hidden">
                <div className="w-60 h-60 bg-gradient-to-tr from-blue-500 to-green-500 rounded-full animate-bounce" />
                <div className="absolute bottom-0 w-full h-1/2 bg-white/10 backdrop-blur-lg" />
            </div>
        </div>
    );
}
