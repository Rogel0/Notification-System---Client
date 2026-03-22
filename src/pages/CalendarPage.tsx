import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Dialog } from "../components/ui/Dialog";

type EventType = "Deadline" | "Meeting" | "Business Trip";

type NotificationEvent = {
  id: number;
  type: EventType;
  title: string;
  datetime: string;
  status: "upcoming" | "missed" | "completed";
};

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getMonthDays(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  return Array.from({ length: totalCells }, (_, index) => {
    const dateNumber = index - firstDay + 1;
    const valid = dateNumber > 0 && dateNumber <= daysInMonth;
    return {
      valid,
      day: valid ? dateNumber : null,
      date: valid ? new Date(year, month, dateNumber) : null,
    };
  });
}

export default function CalendarPage() {
  const [events, setEvents] = useState<NotificationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<NotificationEvent[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await api.get("/events");
        setEvents(res.data.events ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const [visibleMonth, setVisibleMonth] = useState(new Date());

  const monthDays = useMemo(
    () => getMonthDays(visibleMonth.getFullYear(), visibleMonth.getMonth()),
    [visibleMonth],
  );

  const eventsByDay = useMemo(() => {
    const map = new Map<string, NotificationEvent[]>();
    events.forEach((e) => {
      const key = new Date(e.datetime).toISOString().split("T")[0];
      const array = map.get(key) || [];
      array.push(e);
      map.set(key, array);
    });
    return map;
  }, [events]);

  const openDay = (date: Date) => {
    const key = date.toISOString().split("T")[0];
    setSelectedDay(date);
    setSelectedEvents(eventsByDay.get(key) || []);
  };

  const completeEvent = async (id: number) => {
    try {
      await api.put(`/events/${id}/complete`);
      const res = await api.get("/events");
      setEvents(res.data.events ?? []);
      if (selectedDay) {
        openDay(selectedDay);
      }
    } catch (err) {
      console.error("Unable to complete event", err);
      setError("Could not complete event");
    }
  };

  const changeMonth = (delta: number) => {
    const next = new Date(visibleMonth);
    next.setMonth(visibleMonth.getMonth() + delta);
    setVisibleMonth(next);
  };

  return (
    <div className="min-h-[90vh] bg-slate-100 px-6 py-12">
      <main className="mx-auto w-full max-w-7xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Calendar</h1>
            <p className="text-sm text-slate-500">
              Click a date to view schedule details.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => changeMonth(-1)}
            >
              Prev
            </Button>
            <span className="text-sm font-semibold text-slate-700">
              {visibleMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => changeMonth(1)}
            >
              Next
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/plan")}
            >
              Add Plan
            </Button>
          </div>
        </div>

        {loading && (
          <p className="mb-4 text-sm text-slate-500">Loading events...</p>
        )}
        {error && (
          <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

        <Card className="p-4">
          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-slate-500">
            {weekdays.map((wd) => (
              <div key={wd} className="py-1">
                {wd}
              </div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {monthDays.map((cell, idx) => {
              const key =
                cell.date?.toISOString().split("T")[0] ?? `empty-${idx}`;
              const cellEvents = cell.date ? (eventsByDay.get(key) ?? []) : [];
              return (
                <button
                  key={key}
                  onClick={() => cell.date && openDay(cell.date)}
                  disabled={!cell.valid}
                  className={`min-h-[100px] p-2 text-left rounded-lg border ${cell.valid ? "border-slate-200 bg-white hover:bg-indigo-50" : "border-transparent bg-slate-50"} ${cell.date && selectedDay?.toDateString() === cell.date.toDateString() ? "ring-2 ring-indigo-500" : ""}`}
                >
                  {cell.valid && (
                    <div className="text-sm font-bold text-slate-700">
                      {cell.day}
                    </div>
                  )}
                  {cellEvents.slice(0, 2).map((event) => (
                    <span
                      key={event.id}
                      className="mt-1 block rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] text-indigo-700"
                    >
                      {event.title}
                    </span>
                  ))}
                  {cellEvents.length > 2 && (
                    <span className="mt-1 block text-[10px] text-slate-500">
                      +{cellEvents.length - 2} more
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        <Dialog
          open={Boolean(selectedDay)}
          onClose={() => setSelectedDay(null)}
          title={`Events on ${selectedDay ? selectedDay.toDateString() : ""}`}
        >
          {selectedDay ? (
            <div className="space-y-2">
              {selectedEvents.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No events on this date.
                </p>
              ) : (
                selectedEvents.map((event) => (
                  <Card key={event.id} className="p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{event.title}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(event.datetime).toLocaleTimeString()} •{" "}
                          {event.type}
                        </p>
                        <p className="text-xs text-slate-500">
                          {event.status === "missed"
                            ? "Missed event"
                            : event.status === "completed"
                              ? "Completed"
                              : "Upcoming event"}
                        </p>
                      </div>
                      {event.status !== "completed" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => completeEvent(event.id)}
                        >
                          Mark as Done
                        </Button>
                      )}
                    </div>
                  </Card>
                ))
              )}
              <Button variant="secondary" onClick={() => setSelectedDay(null)}>
                Close
              </Button>
            </div>
          ) : null}
        </Dialog>
      </main>
    </div>
  );
}
