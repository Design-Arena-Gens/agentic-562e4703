"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

type Task = {
  id: number;
  title: string;
  impact: "High" | "Medium" | "Low";
  duration: string;
  category: "Distraction" | "Deep Work" | "Admin" | "Recovery";
  completed: boolean;
};

type Habit = {
  id: number;
  name: string;
  focus: string;
  streak: number;
};

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
type Day = (typeof daysOfWeek)[number];

const initialHabits: Habit[] = [
  { id: 1, name: "05:45 Wake & Hydrate", focus: "Morning priming", streak: 12 },
  { id: 2, name: "Deep Work Block", focus: "2 hours focused output", streak: 8 },
  { id: 3, name: "Training Session", focus: "Strength + conditioning", streak: 5 },
  { id: 4, name: "Night Shutdown", focus: "Plan & reflect", streak: 14 },
];

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Build tomorrow's execution plan",
    impact: "High",
    duration: "25 min",
    category: "Deep Work",
    completed: false,
  },
  {
    id: 2,
    title: "Ship sprint deliverable",
    impact: "High",
    duration: "90 min",
    category: "Deep Work",
    completed: false,
  },
  {
    id: 3,
    title: "Zero inbox + reviews",
    impact: "Medium",
    duration: "30 min",
    category: "Admin",
    completed: false,
  },
  {
    id: 4,
    title: "Recovery walk (phone off)",
    impact: "Low",
    duration: "20 min",
    category: "Recovery",
    completed: false,
  },
];

const disciplinePillars = [
  {
    title: "Identity",
    insight: "You are the person who does the difficult things first.",
  },
  {
    title: "Systems",
    insight: "Design the environment so the default choice is the disciplined choice.",
  },
  {
    title: "Energy",
    insight: "Treat sleep, nutrition, and training as non-negotiable assets.",
  },
  {
    title: "Focus",
    insight: "Guard calendar blocks the same way you guard revenue.",
  },
] as const;

const checkInPrompts = [
  "What is the one win that will make today a success?",
  "Where might friction show up? How will future-you respond?",
  "What expectation can you surpass with disciplined effort?",
];

const peakHours = [
  { label: "05:45 – 07:30", focus: "Morning clarity & movement", leverage: "Prime physiology and mindset before inputs." },
  { label: "08:00 – 11:00", focus: "Deep work block", leverage: "No meetings, no notifications, single priority." },
  { label: "14:00 – 16:00", focus: "Execution sprint", leverage: "Ship, communicate, eliminate blockers." },
  { label: "21:00 – 21:30", focus: "Shutdown ritual", leverage: "Reset systems, journal, prepare clothing & plan." },
];

const commitments = [
  "Phone stays in kitchen until after first work block.",
  "Three wins logged before shutting down.",
  "Zero decisions after 20:30 — everything is prepared earlier.",
  "No-hit list reviewed at 12:30 and 20:30 daily.",
];

const highlightColor: Record<Task["impact"], string> = {
  High: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  Medium: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  Low: "bg-sky-500/10 text-sky-600 border-sky-500/30",
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [habitMap, setHabitMap] = useState<Record<number, Record<Day, boolean>>>(() => {
    const base: Record<number, Record<Day, boolean>> = {};
    initialHabits.forEach((habit) => {
      base[habit.id] = daysOfWeek.reduce(
        (acc, day, index) => ({
          ...acc,
          [day]: day === "Sun" ? false : index < habit.streak % 7,
        }),
        {} as Record<Day, boolean>,
      );
    });
    return base;
  });
  const [reflection, setReflection] = useState(
    "Wins from yesterday: Delivered sprint demo with clarity.\nDrag point: Late night scrolling for 20 minutes.\nAdjustment: Phone on charger in office by 21:15.",
  );

  const completionRate = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    return tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  }, [tasks]);

  const highestImpactTask = useMemo(
    () => tasks.find((task) => !task.completed && task.impact === "High") ?? null,
    [tasks],
  );

  const disciplinedMinutes = useMemo(() => {
    const totalMinutes = tasks.reduce((sum, task) => {
      const [value] = task.duration.split(" ");
      return sum + Number.parseInt(value, 10);
    }, 0);
    const activeMinutes = tasks
      .filter((task) => task.completed)
      .reduce((sum, task) => {
        const [value] = task.duration.split(" ");
        return sum + Number.parseInt(value, 10);
      }, 0);

    return { totalMinutes, activeMinutes };
  }, [tasks]);

  const streakScore = useMemo(() => {
    const totalStreak = initialHabits.reduce((sum, habit) => sum + habit.streak, 0);
    return Math.min(100, 30 + Math.round(totalStreak * 2.3));
  }, []);

  const toggleTaskCompletion = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const toggleHabitDay = (habitId: number, day: Day) => {
    setHabitMap((prev) => ({
      ...prev,
      [habitId]: {
        ...prev[habitId],
        [day]: !prev[habitId]?.[day],
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-tl from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-10 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute left-1/4 top-96 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute left-2/3 top-40 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pb-16 pt-14 lg:px-12">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">Discipline Dashboard</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-50 md:text-5xl">
              Command Center for Disciplined Execution
            </h1>
            <p className="mt-3 max-w-3xl text-base text-slate-300/80">
              Track your habits, protect deep-work blocks, and run daily operating rhythms that keep you precise.
              Review the score, reset the system, then execute the next most leveraged action.
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
            <div className="rounded-full border border-emerald-300/40 bg-emerald-500/10 p-3 text-emerald-300">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-200/70">
                Discipline Score
              </p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-semibold text-emerald-200">{streakScore}</p>
                <span className="text-xs text-slate-300/70">consistency indexed</span>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          <article className="col-span-2 space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_120px_-30px_rgba(8,133,115,0.45)] backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-50">Curated Priorities</h2>
              <span className="flex items-center gap-2 text-sm text-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
                {completionRate}% completion
              </span>
            </div>
            <div className="space-y-3">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => toggleTaskCompletion(task.id)}
                  className={`group flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition-all ${
                    task.completed
                      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100 shadow-[0_8px_40px_-20px_rgba(16,185,129,0.8)]"
                      : "border-white/10 bg-white/[0.04] text-slate-100 hover:border-emerald-300/40 hover:bg-emerald-500/10 hover:text-emerald-50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`mt-1 flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold ${highlightColor[task.impact]}`}
                    >
                      {task.impact.slice(0, 1)}
                    </span>
                    <div>
                      <p className="text-base font-medium tracking-tight">{task.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-slate-300/70">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.duration}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {task.category}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Leverage: {task.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-xs text-slate-300/60">
                    <span>{task.completed ? "Logged" : "Tap to confirm"}</span>
                    <ArrowUpRight
                      className={`h-4 w-4 transition-transform ${
                        task.completed ? "translate-x-1 -translate-y-1 text-emerald-200" : "group-hover:translate-x-1 group-hover:-translate-y-1"
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
            {highestImpactTask && (
              <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-5 text-emerald-50">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Next Lever</p>
                <div className="mt-2 flex items-start justify-between">
                  <div>
                    <p className="text-lg font-semibold">{highestImpactTask.title}</p>
                    <p className="mt-1 text-sm text-emerald-100/70">
                      Delete distractions, set timer for {highestImpactTask.duration}, execute one clear outcome.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-emerald-200/40 bg-emerald-500/20 px-4 py-2 text-xs">
                    <Trophy className="h-4 w-4" />
                    Win Condition
                  </div>
                </div>
              </div>
            )}
          </article>

          <article className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_120px_-30px_rgba(56,189,248,0.35)] backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-50">Rhythm Metrics</h2>
              <Calendar className="h-5 w-5 text-slate-300/70" />
            </div>
            <div className="space-y-4 text-sm text-slate-200/80">
              <Metric label="Distraction-free minutes" value={`${disciplinedMinutes.activeMinutes} / ${disciplinedMinutes.totalMinutes}`} trend="+12 from avg" />
              <Metric label="Focus blocks protected" value="3 / 4" trend="Protect AM block" />
              <Metric label="Routines executed" value="6 rituals" trend="+2 vs last week" />
              <Metric label="Sleep runway" value="21:15 shutdown" trend="On target" />
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div>
              <h3 className="text-xs uppercase tracking-[0.35em] text-slate-300/60">Daily Check-in</h3>
              <ul className="mt-3 space-y-3 text-sm text-slate-200/70">
                {checkInPrompts.map((prompt) => (
                  <li key={prompt} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    {prompt}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <article className="col-span-2 space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-50">Habit Integrity</h2>
              <span className="text-xs text-slate-300/70">Tap squares to log</span>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-white/5 text-slate-200/80">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Habit</th>
                    {daysOfWeek.map((day) => (
                      <th key={day} className="px-3 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300/60">
                        {day}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right font-medium">Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {initialHabits.map((habit) => (
                    <tr key={habit.id} className="border-t border-white/5">
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-100">{habit.name}</p>
                        <p className="mt-1 text-xs text-slate-300/70">{habit.focus}</p>
                      </td>
                      {daysOfWeek.map((day) => {
                        const active = habitMap[habit.id]?.[day];
                        return (
                          <td key={day} className="px-2 py-2 text-center">
                            <button
                              onClick={() => toggleHabitDay(habit.id, day)}
                              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                                active
                                  ? "border-emerald-300/60 bg-emerald-500/30 text-emerald-50"
                                  : "border-white/10 bg-white/5 text-slate-400 hover:border-emerald-300/40 hover:text-emerald-200"
                              }`}
                            >
                              {active ? <ShieldCheck className="h-4 w-4" /> : day.slice(0, 1)}
                            </button>
                          </td>
                        );
                      })}
                      <td className="px-4 py-4 text-right text-slate-200/80">
                        {habit.streak} days
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
          <article className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-emerald-300/40 bg-emerald-500/20 p-3 text-emerald-200">
                <ListChecks className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-50">Non-negotiables</h2>
                <p className="text-xs text-slate-300/70">Anchors that keep discipline automatic.</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-200/80">
              {commitments.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 leading-relaxed"
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <article className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_40px_130px_-40px_rgba(144,97,249,0.45)] backdrop-blur lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-50">Operating Rhythm</h2>
              <Clock className="h-5 w-5 text-slate-300/70" />
            </div>
            <div className="space-y-4">
              {peakHours.map((block) => (
                <div
                  key={block.label}
                  className="rounded-2xl border border-white/10 bg-gradient-to-tr from-white/5 via-white/3 to-white/5 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-300/60">{block.label}</p>
                  <h3 className="mt-2 text-lg font-medium text-slate-50">{block.focus}</h3>
                  <p className="mt-2 text-sm text-slate-200/70">{block.leverage}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-emerald-300/40 bg-emerald-500/20 p-3 text-emerald-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-50">Pillar Insights</h2>
                <p className="text-xs text-slate-300/70">Reinforce the identity every day.</p>
              </div>
            </div>
            <div className="space-y-4">
              {disciplinePillars.map((pillar) => (
                <div key={pillar.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-300/60">{pillar.title}</p>
                  <p className="mt-2 text-sm text-slate-200/80">{pillar.insight}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-50">Reflection Log</h2>
              <span className="text-xs text-slate-300/70">End-of-day recalibration</span>
            </div>
            <textarea
              value={reflection}
              onChange={(event) => setReflection(event.target.value)}
              className="min-h-[220px] w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
            />
            <div className="flex items-center justify-between text-xs text-slate-300/70">
              <span>{reflection.length} characters logged</span>
              <span>Review weekly on Sunday</span>
            </div>
          </article>
          <article className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-emerald-300/40 bg-emerald-500/20 p-3 text-emerald-200">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-50">Quarterly Targets</h2>
                <p className="text-xs text-slate-300/70">Translate discipline into outcomes.</p>
              </div>
            </div>
            <ul className="space-y-4 text-sm text-slate-200/80">
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Professional</p>
                <p className="mt-2 font-medium text-slate-100">Ship flagship product initiative on schedule.</p>
                <p className="mt-1 text-xs text-slate-300/70">Discipline lever: Protect deep-work sprints daily.</p>
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Physical</p>
                <p className="mt-2 font-medium text-slate-100">3x strength sessions + 2x conditioning weekly.</p>
                <p className="mt-1 text-xs text-slate-300/70">Discipline lever: Treat training as non-negotiable meeting.</p>
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Personal</p>
                <p className="mt-2 font-medium text-slate-100">Weekly date night fully present & tech-free.</p>
                <p className="mt-1 text-xs text-slate-300/70">Discipline lever: Plan logistics every Monday morning.</p>
              </li>
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}

function Metric({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-300/60">{label}</p>
        <p className="mt-1 text-sm font-medium text-slate-100">{value}</p>
      </div>
      <span className="text-xs text-emerald-200/80">{trend}</span>
    </div>
  );
}
