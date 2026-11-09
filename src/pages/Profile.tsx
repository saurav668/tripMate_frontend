
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Mail,
  UserRound,
  ShieldCheck,
  Loader2,
  RefreshCw,
  MapPin,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

import { getProfileApi } from "../features/dashboard/dashboardApi";

const Profile = () => {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfileApi,
  });

  const user = data?.user;

  const displayName =
    user?.name || user?.email?.split("@")[0] || "Traveler";

  const userId = user?.userId || user?.id || user?.sub || "Not provided";

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-destructive">Unable to load your profile.</p>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold">
              TripMate
            </span>
          </Link>

          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">
            My Profile
          </h1>
          <p className="mt-2 text-muted-foreground">
            View your TripMate account information.
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                {displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-2xl font-bold">{displayName}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {user.email || "Email not available"}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <ShieldCheck className="h-4 w-4" />
                Authenticated account
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="flex items-start gap-3">
              <UserRound className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user.name || "Not provided by API"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email address</p>
                <p className="font-medium">{user.email || "Not available"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="break-all font-medium">{userId}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="mt-5 text-sm text-muted-foreground">
          Profile editing will be enabled after the backend provides
          an update-profile endpoint.
        </p>
      </main>
    </div>
  );
};

export default Profile;
