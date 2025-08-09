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
import { registerFormSchema, RegisterFormData } from "@/lib/schemas";
import { registerUser } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "@/components/ui/sonner";

const RegisterPage = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema),
    });

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            login(data.user, data.token);
            toast.success("Account created successfully!");
            navigate("/"); // Redirect to homepage on successful registration
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const onSubmit = (data: RegisterFormData) => {
        mutation.mutate(data);
    };
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow flex items-center justify-center bg-youorganic-cream/30 p-4">
                <Card className="mx-auto max-w-sm w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">Sign Up</CardTitle>
                        <CardDescription>Enter your information to create an account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Your Name" {...register("name")} />
                                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                            </div>
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
                                {mutation.isPending ? "Creating Account..." : "Create an account"}
                            </Button>
                        </form>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="underline">Sign in</Link>
                        </div>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
};

export default RegisterPage;