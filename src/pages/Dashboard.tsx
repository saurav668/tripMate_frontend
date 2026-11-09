import {
  LayoutDashboard,
  Map,
  Users,
  MessageCircle,
  Bell,
  UserRound,
  Plus,
  MapPin,
  CalendarDays,
  ArrowRight,
  Compass,
  Plane,
  Settings,
  LogOut,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../components/ui/button";

import {
  getProfileApi,
  getMyTripsApi,
  getUnreadNotificationCountApi,
} from "../features/dashboard/dashboardApi";

type Trip = {
  id?: string | number;
  tripId?: string | number;
  destination?: string;
  startDate?: string;
  endDate?: string;
  budget?: string | number;
  status?: string;
  description?: string;
};

const formatDate = (date?: string) => {
  if (!date) return "Date not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Date not available";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getTripsArray = (response: any): Trip[] => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.trips)) return response.trips;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.trips)) return response.data.trips;

  return [];
};

const getNotificationCount = (response: any): number => {
  if (typeof response === "number") return response;

  const count =
    response?.unreadCount ??
    response?.count ??
    response?.unreadNotificationsCount ??
    response?.data?.unreadCount ??
    response?.data?.count;

  return Number(count) || 0;
};

const Dashboard = () => {
  const navigate = useNavigate();

  // Profile API
  const {
    data: profileResponse,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfileApi,
  });

  // My Trips API
  const {
    data: tripsResponse,
    isLoading: tripsLoading,
    isError: tripsError,
    refetch: refetchTrips,
  } = useQuery({
    queryKey: ["my-trips"],
    queryFn: getMyTripsApi,
  });

  // Unread Notifications API
  const {
    data: notificationResponse,
    isLoading: notificationsLoading,
    isError: notificationsError,
  } = useQuery({
    queryKey: ["unread-notifications"],
    queryFn: getUnreadNotificationCountApi,
  });

  // Extract profile information
  const user =
    profileResponse?.user ??
    profileResponse?.data?.user ??
    profileResponse?.data ??
    profileResponse;

  const displayName =
    user?.name ||
    user?.fullName ||
    user?.email?.split("@")[0] ||
    "Traveler";

  // Extract trips
  const trips = getTripsArray(tripsResponse);

  const activeTrips = trips.filter(
    (trip) => trip.status?.toUpperCase() === "ACTIVE"
  );

  const completedTrips = trips.filter(
    (trip) => trip.status?.toUpperCase() === "COMPLETED"
  );

  const unreadNotificationCount =
    getNotificationCount(notificationResponse);

  const stats = [
    {
      label: "Total Trips",
      value: trips.length,
      icon: Map,
      description: "Trips you've created or joined",
    },
    {
      label: "Active Trips",
      value: activeTrips.length,
      icon: Plane,
      description: "Your ongoing adventures",
    },
    {
      label: "Completed Trips",
      value: completedTrips.length,
      icon: CheckCircle,
      description: "Journeys you've completed",
    },
    {
      label: "Unread Notifications",
      value: notificationsError
        ? "—"
        : unreadNotificationCount,
      icon: Bell,
      description: "Updates waiting for you",
    },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    navigate("/auth", { replace: true });
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const isDashboardLoading =
    profileLoading || tripsLoading || notificationsLoading;

  return (
    <div className="min-h-screen bg-background md:flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-border bg-card">
        <div className="h-20 flex items-center gap-2 px-6 border-b border-border">
          <MapPin className="h-7 w-7 text-primary" />
          <span className="font-display text-2xl font-bold">
            TripMate
          </span>
        </div>

        <div className="flex-1 px-4 py-7">
          <p className="px-3 mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>

          <nav className="space-y-1">
            {[
              { label: "Overview", icon: LayoutDashboard, section: "overview" },
              { label: "My Trips", icon: Map, section: "my-trips" },
              { label: "Find Partners", icon: Users, section: "dashboard-activity" },
              { label: "Messages", icon: MessageCircle, section: "dashboard-activity" },
              { label: "Notifications", icon: Bell, section: "recent-activity" },
              { label: "My Profile", icon: UserRound, section: "overview" },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => scrollToSection(item.section)}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  item.label === "Overview"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-border">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1">
        {/* Top Header */}
        <header className="h-20 border-b border-border bg-card/70 flex items-center justify-between px-5 md:px-8">
          <div>
            <p className="text-sm text-muted-foreground">
              Your travel workspace
            </p>
            <h1 className="font-display text-xl md:text-2xl font-bold">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              aria-label="Notifications"
              onClick={() => scrollToSection("recent-activity")}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-xs text-destructive-foreground">
                  {unreadNotificationCount > 99
                    ? "99+"
                    : unreadNotificationCount}
                </span>
              )}
            </Button>

            <Button
              onClick={() => navigate("/")}
              variant="outline"
              size="sm"
              className="hidden sm:flex"
            >
              Explore
            </Button>

            <Button
              size="sm"
              onClick={() => navigate("/trips/create")}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Trip
            </Button>
          </div>
        </header>

        <div
          id="overview"
          className="p-5 md:p-8 max-w-7xl mx-auto space-y-8"
        >
          {/* Welcome Section */}
          <section className="relative overflow-hidden rounded-2xl hero-overlay p-7 md:p-10 text-primary-foreground">
            <div className="relative z-10 max-w-2xl">
              <p className="text-sm font-medium opacity-85 mb-2">
                YOUR NEXT ADVENTURE STARTS HERE
              </p>

              <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
                {profileLoading
                  ? "Welcome back!"
                  : `Welcome back, ${displayName}!`}
              </h2>

              {user?.email && (
                <p className="mt-2 text-sm opacity-90">
                  {user.email}
                </p>
              )}

              <p className="mt-3 text-sm md:text-base opacity-90 max-w-lg">
                Plan your next journey, connect with fellow travelers, and make
                every trip more memorable.
              </p>

              <Button
                className="mt-6 bg-background text-foreground hover:bg-background/90"
                onClick={() => navigate("/trips/create")}
              >
                Plan a Trip
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <Compass className="absolute -right-5 -bottom-10 h-56 w-56 opacity-15 rotate-12" />
          </section>

          {/* Profile Error */}
          {profileError && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              Unable to load your profile. Please refresh the page or sign in again.
            </div>
          )}

          {/* Statistics */}
          <section>
            <div className="mb-5">
              <h2 className="font-display text-xl font-bold">
                Your Overview
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                A quick look at your travel activity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border bg-card p-5 card-elevated"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>

                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>

                  <p className="font-display text-3xl font-bold mt-4">
                    {isDashboardLoading &&
                    stat.label !== "Unread Notifications" ? (
                      <Loader2 className="h-7 w-7 animate-spin" />
                    ) : tripsError &&
                      stat.label !== "Unread Notifications" ? (
                      "—"
                    ) : (
                      stat.value
                    )}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Trips and Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <section
              id="my-trips"
              className="xl:col-span-2 rounded-xl border border-border bg-card p-5 md:p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display text-xl font-bold">
                    My Trips
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your created and joined trips.
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetchTrips()}
                >
                  Refresh <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              {tripsLoading ? (
                <div className="min-h-52 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : tripsError ? (
                <div className="min-h-52 flex flex-col items-center justify-center text-center">
                  <AlertCircle className="h-8 w-8 text-destructive mb-3" />
                  <p className="font-medium">
                    Unable to load your trips
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please try again.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => refetchTrips()}
                  >
                    Retry
                  </Button>
                </div>
              ) : trips.length === 0 ? (
                <div className="min-h-52 flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-border p-6">
                  <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Plane className="h-7 w-7" />
                  </div>

                  <h3 className="font-semibold">
                    Your journey begins here
                  </h3>

                  <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                    You haven't added any trips to your dashboard yet. Create a
                    trip and find people to explore with.
                  </p>

                  <Button
                    className="mt-4"
                    onClick={() => navigate("/trips/create")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first trip
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {trips.slice(0, 5).map((trip, index) => (
                    <div
                      key={trip.id ?? trip.tripId ?? index}
                      className="rounded-xl border border-border p-4 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-base">
                            {trip.destination || "Destination not specified"}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            <span>
                              {formatDate(trip.startDate)}
                              {" - "}
                              {formatDate(trip.endDate)}
                            </span>
                          </div>

                          {trip.budget !== undefined &&
                            trip.budget !== null && (
                              <p className="text-sm text-muted-foreground mt-2">
                                Budget: {trip.budget}
                              </p>
                            )}

                          {trip.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {trip.description}
                            </p>
                          )}
                        </div>

                        {trip.status && (
                          <span className="self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            {trip.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {trips.length > 5 && (
                    <p className="text-center text-sm text-muted-foreground">
                      Showing 5 of {trips.length} trips.
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* Quick Actions */}
            <section
              id="dashboard-activity"
              className="rounded-xl border border-border bg-card p-5 md:p-6"
            >
              <h2 className="font-display text-xl font-bold">
                Quick Actions
              </h2>

              <p className="text-sm text-muted-foreground mt-1 mb-5">
                What would you like to do?
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => navigate("/trips/create")}
                  className="w-full flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-muted transition-colors"
                >
                  <span className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Plus className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      Create a trip
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Start planning a journey
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="w-full flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-muted transition-colors"
                >
                  <span className="h-10 w-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      Find travel partners
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Meet fellow travelers
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="w-full flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-muted transition-colors"
                >
                  <span className="h-10 w-10 rounded-lg bg-accent/30 text-foreground flex items-center justify-center">
                    <CalendarDays className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      Explore destinations
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Discover places to visit
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("overview")}
                  className="w-full flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-muted transition-colors"
                >
                  <span className="h-10 w-10 rounded-lg bg-muted text-foreground flex items-center justify-center">
                    <Settings className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      Dashboard overview
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Review your travel activity
                    </span>
                  </span>
                </button>
              </div>
            </section>
          </div>

          {/* Recent Activity */}
          <section
            id="recent-activity"
            className="rounded-xl border border-border bg-card p-5 md:p-6"
          >
            <h2 className="font-display text-xl font-bold">
              Recent Activity
            </h2>

            <p className="text-sm text-muted-foreground mt-1">
              Your latest trip updates and notifications.
            </p>

            <div className="py-10 text-center">
              {notificationsLoading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              ) : notificationsError ? (
                <>
                  <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Unable to load notification information.
                  </p>
                </>
              ) : unreadNotificationCount > 0 ? (
                <>
                  <Bell className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="font-medium">
                    You have {unreadNotificationCount} unread notification
                    {unreadNotificationCount === 1 ? "" : "s"}.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Open your notifications to see the updates.
                  </p>
                </>
              ) : (
                <>
                  <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    You're all caught up. No unread notifications.
                  </p>
                </>
              )}
            </div>
          </section>

          <footer className="text-center text-xs text-muted-foreground pb-4">
            © 2026 TripMate. Made for journeys worth sharing.
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;