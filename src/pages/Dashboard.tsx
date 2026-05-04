import { useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Dialog } from "../components/ui/Dialog";

type EventType = "Deadline" | "Meeting" | "Business Trip";

type NotificationStatusItem = {
  success: boolean;
  error?: string;
  skipped?: string;
};

type NotificationStatus = {
  email?: NotificationStatusItem;
  sms?: NotificationStatusItem;
};

type NotificationEvent = {
  id: number;
  type: EventType;
  title: string;
  datetime: string;
  datetime_label?: string;
  next_stage?: string;
  status: "upcoming" | "missed" | "completed";
  details?: string;
};

const formatDateTime = (event: NotificationEvent) =>
  event.datetime_label ||
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Manila",
    timeZoneName: "short",
  }).format(new Date(event.datetime));

const buildReminderText = (item: NotificationEvent) => {
  if (item.status === "missed") {
    if (item.type === "Deadline") {
      return `Missed reminder window for deadline on ${formatDateTime(item)}.`;
    }
    if (item.type === "Meeting") {
      return `Missed reminder window for meeting on ${formatDateTime(item)}.`;
    }
    return `Missed reminder window for business trip on ${formatDateTime(item)}.`;
  }

  // Format stage label for display (remove underscores, capitalize)
  const stageLabel = (item.next_stage || "upcoming")
    .split("_")
    .map((w, i) => {
      // Don't capitalize numbers
      if (/^\d+$/.test(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");

  return `Next reminder stage: ${stageLabel}. Event time: ${formatDateTime(item)}.`;
};

export default function Dashboard() {
  const [events, setEvents] = useState<NotificationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationResult, setNotificationResult] =
    useState<NotificationStatus | null>(null);
  const [notificationHistory, setNotificationHistory] = useState<
    Array<{ time: string; status: NotificationStatus; title: string }>
  >([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [plan, setPlan] = useState({
    title: "",
    type: "Deadline",
    datetime: "",
    details: "",
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/events");
      setEvents(res.data.events);
    } catch {
      setError("Could not load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const summary = useMemo(
    () => ({
      all: events.length,
      upcoming: events.filter((e) => e.status === "upcoming").length,
      missed: events.filter((e) => e.status === "missed").length,
      deadline: events.filter((e) => e.type === "Deadline").length,
    }),
    [events],
  );

  const completeEvent = async (id: number) => {
    try {
      await api.put(`/events/${id}/complete`);
      await fetchEvents();
    } catch (err: unknown) {
      let message = "Failed to complete event";
      if (err && typeof err === "object") {
        const axiosErr = err as any;
        if (axiosErr.response?.data?.message) {
          message = axiosErr.response.data.message;
        } else if (axiosErr.response?.data?.error) {
          message = axiosErr.response.data.error;
        } else if (axiosErr.message) {
          message = axiosErr.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    }
  };

  const addPlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!plan.title || !plan.datetime) {
      setError("Please fill title and datetime for your plan.");
      return;
    }
    if (new Date(plan.datetime) <= new Date()) {
      setError("Datetime must be a future time.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post("/events", plan);
      const status: NotificationStatus = response.data.notificationStatus;
      setNotificationResult(status || null);
      setNotificationHistory((prev) =>
        [
          {
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: status || {
              email: { success: false },
              sms: { success: false },
            },
            title: plan.title,
          },
          ...prev,
        ].slice(0, 5),
      );
      await fetchEvents();
      setIsDialogOpen(false);
      setPlan({ title: "", type: "Deadline", datetime: "", details: "" });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save plan";
      setError(message);
      setNotificationResult(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-slate-100 p-6 z-0 relative">
      <main className="mx-auto w-full max-w-7xl">
        <div className="mb-4 sticky top-0 z-20 bg-slate-100/90 backdrop-blur px-2 py-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-sm text-slate-500">
                Overview of your upcoming schedule
              </p>
            </div>
            <Button variant="primary" onClick={() => setIsDialogOpen(true)}>
              New Plan
            </Button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-600">Loading events...</p>
        ) : (
          <div className="space-y-4">
            {error && (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            )}

            <Card className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">
                    Recent notification attempts
                  </h3>
                  <p className="text-xs text-slate-500">
                    Always visible, updated after each New Plan save.
                  </p>
                  {notificationResult ? (
                    <p className="mt-1 text-xs">
                      Latest: Email{" "}
                      {notificationResult.email?.success ? "OK" : "Failed"} | SMS{" "}
                      {notificationResult.sms?.success ? "OK" : "Failed"}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-slate-400">No status yet</p>
                  )}
                </div>
                {notificationHistory.length > 0 && (
                  <button
                    type="button"
                    className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700 hover:bg-slate-200"
                    onClick={() => setNotificationHistory([])}
                  >
                    Clear history
                  </button>
                )}
              </div>

              {notificationHistory.length === 0 ? (
                <p className="mt-2 text-xs text-slate-500">
                  No notification attempts yet. Create a plan to see status.
                </p>
              ) : (
                <ul className="mt-2 space-y-2 text-xs">
                  {notificationHistory.map((item, idx) => (
                    <li key={idx} className="flex justify-between gap-2">
                      <span className="font-medium text-slate-700">
                        {item.time} - {item.title}
                      </span>
                      <span>
                        Email: {item.status.email?.success ? "OK" : "Failed"}; SMS:{" "}
                        {item.status.sms?.success ? "OK" : "Failed"}
                        {item.status.email?.error &&
                          ` (${item.status.email.error})`}
                        {item.status.sms?.error &&
                          ` (${item.status.sms.error})`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Card className="p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Total
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {summary.all}
                </p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-emerald-500">
                  Upcoming
                </p>
                <p className="text-2xl font-bold text-emerald-700">
                  {summary.upcoming}
                </p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-amber-500">
                  Missed
                </p>
                <p className="text-2xl font-bold text-amber-700">
                  {summary.missed}
                </p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-indigo-600">
                  Deadlines
                </p>
                <p className="text-2xl font-bold text-indigo-700">
                  {summary.deadline}
                </p>
              </Card>
            </div>

            <Card className="p-4">
              <h2 className="text-lg font-semibold">
                Upcoming reminder schedule
              </h2>
              <div className="mt-3 space-y-3">
                {events.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No upcoming events yet.
                  </p>
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-lg border border-slate-200 p-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {event.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {buildReminderText(event)}
                          </p>
                        </div>
                        {event.status !== "completed" && (
                          <Button
                            variant="secondary"
                            onClick={() => completeEvent(event.id)}
                          >
                            Mark as Done
                          </Button>
                        )}
                      </div>
                      {event.status === "completed" && (
                        <p className="mt-2 text-xs text-emerald-600">
                          Completed - no further reminders
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}
      </main>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Add new plan"
      >
        <form className="space-y-3" onSubmit={addPlan}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Event title
            </label>
            <input
              required
              value={plan.title}
              onChange={(e) =>
                setPlan((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Type
            </label>
            <select
              value={plan.type}
              onChange={(e) =>
                setPlan((prev) => ({ ...prev, type: e.target.value }))
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            >
              <option>Deadline</option>
              <option>Meeting</option>
              <option>Business Trip</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Date & Time
            </label>
            <input
              required
              type="datetime-local"
              value={plan.datetime}
              onChange={(e) =>
                setPlan((prev) => ({ ...prev, datetime: e.target.value }))
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Details (optional)
            </label>
            <textarea
              value={plan.details}
              onChange={(e) =>
                setPlan((prev) => ({ ...prev, details: e.target.value }))
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              rows={3}
              placeholder="Add notes or context for this plan"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}




