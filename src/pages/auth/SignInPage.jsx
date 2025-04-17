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

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted }
    } = useForm({
        defaultValues: {
            Email: "",
            Password: ""
        }
    });

    const onSubmit = async (data) => {
        try {
            const resultAction = await dispatch(signInUser(data)).unwrap();
            if (resultAction.uid) {
                navigate("/"); // navigate to dashboard on successful login
            }
        } catch (err) {
            console.error("Login failed:", err);
            // Optionally show error to user
            alert("Login failed: " + err);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <form
                className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg"
                onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">Vendor Portal</h2>
                <p className="text-center text-gray-500 mb-8">Please enter your details.</p>

                {/* Email Field */}
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("Email", { required: "Email is required" })}
                    />
                    {isSubmitted && errors.Email && (
                        <p className="text-sm text-red-500 mt-1">{errors.Email.message}</p>
                    )}
                </div>

                {/* Password Field */}
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("Password", { required: "Password is required" })}
                        />
                        <button
                            type="button"
                            onClick={handleClickShowPassword}
                            className="absolute right-4 top-3.5 text-gray-500">
                            {showPassword ? (
                                <MdOutlineVisibility size={20} />
                            ) : (
                                <MdOutlineVisibilityOff size={20} />
                            )}
                        </button>
                    </div>
                    {isSubmitted && errors.Password && (
                        <p className="text-sm text-red-500 mt-1">{errors.Password.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-200">
                    Sign In
                </button>

                {/* Sign Up Redirect */}
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        Don’t have an account?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/signup")}
                            className="text-blue-600 font-medium hover:underline">
                            Contact COITB
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
}
