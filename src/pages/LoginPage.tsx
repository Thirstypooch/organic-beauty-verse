import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { loginFormSchema, LoginFormData } from "@/lib/schemas";
import { loginUser } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "@/components/ui/sonner";


const LoginPage = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginFormSchema),
    });

    const mutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            login(data.user, data.token);
            toast.success("Logged in successfully!");
            navigate("/");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const onSubmit = (data: LoginFormData) => {
        mutation.mutate(data);
    };
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow flex items-center justify-center bg-youorganic-cream/30 p-4">
                <Card className="mx-auto max-w-sm w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>Enter your email below to login to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
                                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" {...register("password")} />
                                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                            </div>
                            <Button type="submit" className="w-full bg-youorganic-green hover:bg-youorganic-green/90" disabled={mutation.isPending}>
                                {mutation.isPending ? "Logging in..." : "Login"}
                            </Button>
                        </form>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link to="/register" className="underline">Sign up</Link>
                        </div>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
};

export default LoginPage;