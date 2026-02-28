import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { mockProjects, type Project } from "@/data/mockProjects";
import { firebaseAuth } from "./firebaseClient";

const AUTH_KEY = "fundforge_auth_session";
const PROJECTS_KEY = "fundforge_projects";
const HISTORY_KEY = "fundforge_user_history";
const THEME_KEY = "fundforge_theme";
const CONTRIBUTIONS_KEY = "fundforge_user_contributions";
const API_BASE = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000"}/api`;

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
  token?: string;
}

export interface ProjectCommentReply {
  id: string;
  user: string;
  avatar: string;
  text: string;
  date: string;
}

export interface ProjectCommentItem {
  id: string;
  user: string;
  avatar: string;
  text: string;
  date: string;
  replies?: ProjectCommentReply[];
}

export interface StoredProject extends Project {
  createdAt?: string;
  views?: number;
  creatorId?: string;
  comments: ProjectCommentItem[];
}

interface UserHistory {
  viewedProjectIds: string[];
  fundedProjectIds: string[];
  categoryScore: Record<string, number>;
}

interface UserContribution {
  projectId: string;
  amount: number;
  date: string;
}

type UserContributions = Record<string, UserContribution[]>;
type JsonObject = Record<string, unknown>;

interface ApiProject extends JsonObject {
  id: string;
  creator_id?: string;
  title: string;
  description: string;
  category: string;
  image_url?: string;
  goal_amount: number | string;
  raised_amount: number | string;
  backers_count: number | string;
  deadline: string;
  featured?: boolean;
  created_at?: string;
  views?: number | string;
  creator?: { name?: string } | null;
  creator_name?: string;
  rewards?: ApiReward[];
  milestones?: ApiMilestone[];
  comments?: ApiComment[];
  updates?: ApiUpdate[];
}

interface ApiReward extends JsonObject {
  id: string;
  title: string;
  description?: string;
  amount: number | string;
}

interface ApiMilestone extends JsonObject {
  id: string;
  title: string;
  description?: string;
  target_amount: number | string;
  reached: boolean;
}

interface ApiReply extends JsonObject {
  id: string;
  user?: string;
  avatar?: string;
  text: string;
  date?: string;
  created_at?: string;
}

interface ApiComment extends JsonObject {
  id: string;
  user?: string;
  avatar?: string;
  text: string;
  date?: string;
  created_at?: string;
  replies?: ApiReply[];
}

interface ApiUpdate extends JsonObject {
  id: string;
  title: string;
  content: string;
  date?: string;
  created_at?: string;
}

type RazorpayCheckoutResponse = {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  handler: (response: RazorpayCheckoutResponse) => void;
  modal?: { ondismiss?: () => void };
  prefill?: { name?: string; email?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
};

type RazorpayInstance = { open: () => void };

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

const readJson = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

const loadRazorpayScript = async () => {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;

  const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay="checkout"]');
  if (existing) {
    return new Promise<boolean>((resolve) => {
      existing.addEventListener("load", () => resolve(Boolean(window.Razorpay)), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
    });
  }

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpay = "checkout";
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const openRazorpayCheckout = async (params: {
  keyId: string;
  amount: number;
  projectId: string;
  orderId: string;
  userName?: string;
  userEmail?: string;
}) => {
  const ready = await loadRazorpayScript();
  if (!ready || !window.Razorpay) {
    throw new Error("Unable to load Razorpay checkout. Please check your internet and retry.");
  }

  return new Promise<RazorpayCheckoutResponse>((resolve, reject) => {
    const options: RazorpayOptions = {
      key: params.keyId,
      amount: Math.round(params.amount * 100),
      currency: "INR",
      name: "FundForge",
      description: `Contribution for project ${params.projectId}`,
      handler: (response) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled.")),
      },
      prefill: {
        name: params.userName,
        email: params.userEmail,
      },
      notes: {
        local_order_id: params.orderId,
        project_id: params.projectId,
      },
      theme: {
        color: "#0ea5e9",
      },
    };

    const checkout = new window.Razorpay(options);
    checkout.open();
  });
};

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

const getInitialProjects = (): StoredProject[] =>
  mockProjects.map((project) => ({
    ...project,
    createdAt: new Date(Date.now() - project.daysLeft * 24 * 60 * 60 * 1000).toISOString(),
    views: Math.max(project.backers * 6, 500),
    comments: project.comments.map((comment) => ({ ...comment, replies: [] })),
  }));

const getHistoryMap = () => readJson<Record<string, UserHistory>>(HISTORY_KEY, {});
const getContributionsMap = () => readJson<UserContributions>(CONTRIBUTIONS_KEY, {});

const upsertHistory = (userId: string, updateFn: (current: UserHistory) => UserHistory) => {
  const map = getHistoryMap();
  const current = map[userId] ?? { viewedProjectIds: [], fundedProjectIds: [], categoryScore: {} };
  map[userId] = updateFn(current);
  writeJson(HISTORY_KEY, map);
};

const getSessionToken = async () => {
  if (firebaseAuth.currentUser) {
    return firebaseAuth.currentUser.getIdToken();
  }
  const session = getAuthSession();
  return session?.token ?? null;
};

const api = async <T>(path: string, init: RequestInit = {}, auth = false): Promise<T> => {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (auth) {
    const token = await getSessionToken();
    if (!token) {
      throw new Error("Not authenticated.");
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok || payload?.ok === false) {
    throw new Error(payload?.error ?? "Request failed.");
  }
  return payload.data as T;
};

const initials = (name = "User") =>
  name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

const toDaysLeft = (deadline: string) =>
  Math.max(0, Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

const mapApiProject = (item: ApiProject): StoredProject => ({
  id: item.id,
  title: item.title,
  description: item.description,
  creator: item.creator?.name ?? item.creator_name ?? "Unknown Creator",
  creatorId: typeof item.creator_id === "string" ? item.creator_id : undefined,
  category: item.category,
  image: item.image_url || "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=1200&h=700&fit=crop",
  goal: Number(item.goal_amount ?? 0),
  raised: Number(item.raised_amount ?? 0),
  backers: Number(item.backers_count ?? 0),
  daysLeft: toDaysLeft(item.deadline),
  featured: Boolean(item.featured ?? false),
  rewards: (item.rewards ?? []).map((reward: ApiReward) => ({
    id: reward.id,
    title: reward.title,
    description: reward.description ?? "",
    amount: Number(reward.amount ?? 0),
  })),
  milestones: (item.milestones ?? []).map((milestone: ApiMilestone) => ({
    id: milestone.id,
    title: milestone.title,
    description: milestone.description ?? "",
    targetAmount: Number(milestone.target_amount ?? 0),
    reached: Boolean(milestone.reached),
  })),
  comments: (item.comments ?? []).map((comment: ApiComment) => ({
    id: comment.id,
    user: comment.user ?? "User",
    avatar: comment.avatar ?? initials(comment.user),
    text: comment.text,
    date: comment.date ?? comment.created_at ?? "Just now",
    replies: (comment.replies ?? []).map((reply: ApiReply) => ({
      id: reply.id,
      user: reply.user ?? "User",
      avatar: reply.avatar ?? initials(reply.user),
      text: reply.text,
      date: reply.date ?? reply.created_at ?? "Just now",
    })),
  })),
  updates: (item.updates ?? []).map((update: ApiUpdate) => ({
    id: update.id,
    title: update.title,
    content: update.content,
    date: update.date ?? update.created_at ?? "Just now",
  })),
  views: Number(item.views ?? 0),
  createdAt: item.created_at ?? new Date().toISOString(),
});

const saveProjects = (projects: StoredProject[]) => {
  writeJson(PROJECTS_KEY, projects);
};

const mergeProjectIntoCache = (project: StoredProject) => {
  const projects = getProjects();
  const idx = projects.findIndex((item) => item.id === project.id);
  if (idx >= 0) {
    projects[idx] = { ...projects[idx], ...project };
  } else {
    projects.unshift(project);
  }
  saveProjects(projects);
};

export const syncProjectsFromServer = async () => {
  const data = await api<{ items: ApiProject[] }>("/projects?limit=200");
  const normalized = (data.items ?? []).map(mapApiProject);
  saveProjects(normalized);
  return normalized;
};

export const initializeAppData = async () => {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem(PROJECTS_KEY)) {
    writeJson(PROJECTS_KEY, getInitialProjects());
  }
  if (!localStorage.getItem(HISTORY_KEY)) {
    writeJson(HISTORY_KEY, {});
  }
  if (!localStorage.getItem(THEME_KEY)) {
    localStorage.setItem(THEME_KEY, "dark");
  }
  if (!localStorage.getItem(CONTRIBUTIONS_KEY)) {
    writeJson(CONTRIBUTIONS_KEY, {});
  }

  try {
    await syncProjectsFromServer();
  } catch {
    // Keep local fallback data if backend is unavailable.
  }
};

export const getProjects = () => readJson<StoredProject[]>(PROJECTS_KEY, getInitialProjects());

export const getProjectById = (projectId: string) => getProjects().find((project) => project.id === projectId) ?? null;

export const fetchProjectById = async (projectId: string) => {
  const data = await api<ApiProject>(`/projects/${projectId}`);
  const normalized = mapApiProject(data);
  mergeProjectIntoCache(normalized);
  return normalized;
};

export const incrementProjectView = (projectId: string) => {
  const projects = getProjects();
  const updated = projects.map((project) =>
    project.id === projectId ? { ...project, views: (project.views ?? 0) + 1 } : project,
  );
  saveProjects(updated);
};

export const registerUser = async (payload: { name: string; email: string; password: string }) => {
  try {
    const credential = await createUserWithEmailAndPassword(
      firebaseAuth,
      payload.email.trim().toLowerCase(),
      payload.password,
    );
    await updateProfile(credential.user, { displayName: payload.name.trim() });
    const token = await credential.user.getIdToken();

    await api("/auth/bootstrap", { method: "POST" }, true).catch(async () => {
      await api("/auth/bootstrap", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    });

    const session: AuthSession = {
      userId: credential.user.uid,
      email: credential.user.email ?? payload.email.trim().toLowerCase(),
      name: payload.name.trim(),
      token,
    };
    writeJson(AUTH_KEY, session);
    localStorage.setItem("isLoggedIn", "true");
    return { ok: true as const };
  } catch (error: unknown) {
    return { ok: false as const, error: getErrorMessage(error, "Signup failed.") };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const credential = await signInWithEmailAndPassword(firebaseAuth, email.trim().toLowerCase(), password);
    const token = await credential.user.getIdToken();

    let profileName = credential.user.displayName ?? credential.user.email?.split("@")[0] ?? "User";
    try {
      const me = await api<{ profile: { name?: string } | null }>(
        "/auth/me",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      profileName = me.profile?.name ?? profileName;
    } catch {
      // Profile may not exist yet; bootstrap it.
      await api("/auth/bootstrap", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    const session: AuthSession = {
      userId: credential.user.uid,
      email: credential.user.email ?? email.trim().toLowerCase(),
      name: profileName,
      token,
    };

    writeJson(AUTH_KEY, session);
    localStorage.setItem("isLoggedIn", "true");
    return { ok: true as const, session };
  } catch (error: unknown) {
    return { ok: false as const, error: getErrorMessage(error, "Invalid email or password.") };
  }
};

export const getAuthSession = () => readJson<AuthSession | null>(AUTH_KEY, null);

export const isAuthenticated = () => Boolean(getAuthSession());

export const logoutUser = async () => {
  if (typeof window === "undefined") return;
  try {
    await signOut(firebaseAuth);
  } catch {
    // Ignore local logout fallback.
  }
  localStorage.removeItem(AUTH_KEY);
  localStorage.setItem("isLoggedIn", "false");
};

export const recordProjectView = (_userId: string, project: StoredProject) => {
  const session = getAuthSession();
  if (!session) return;

  upsertHistory(session.userId, (history) => {
    const viewed = [project.id, ...history.viewedProjectIds.filter((id) => id !== project.id)].slice(0, 30);
    return {
      ...history,
      viewedProjectIds: viewed,
      categoryScore: {
        ...history.categoryScore,
        [project.category]: (history.categoryScore[project.category] ?? 0) + 1,
      },
    };
  });

  void api(`/projects/${project.id}/views`, { method: "POST" }, true).catch(() => {});
};

export const recordProjectFunding = (_userId: string, project: StoredProject) => {
  const session = getAuthSession();
  if (!session) return;

  upsertHistory(session.userId, (history) => ({
    ...history,
    fundedProjectIds: [project.id, ...history.fundedProjectIds.filter((id) => id !== project.id)].slice(0, 30),
    categoryScore: {
      ...history.categoryScore,
      [project.category]: (history.categoryScore[project.category] ?? 0) + 3,
    },
  }));
};

export const getRecommendedProjects = (userId: string, limit = 3) => {
  const history = getHistoryMap()[userId];
  const projects = getProjects();
  if (!history) {
    return projects.slice(0, limit);
  }

  const fundedSet = new Set(history.fundedProjectIds);
  const viewedSet = new Set(history.viewedProjectIds);

  return projects
    .filter((project) => !fundedSet.has(project.id))
    .map((project) => {
      const categoryPoints = history.categoryScore[project.category] ?? 0;
      const viewedPoints = viewedSet.has(project.id) ? 2 : 0;
      const popularityPoints = project.backers / 500 + project.raised / Math.max(project.goal, 1);
      return { project, score: categoryPoints * 3 + viewedPoints + popularityPoints };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.project);
};

export const addProjectComment = async (projectId: string, payload: { user: string; text: string }) => {
  await api(
    `/projects/${projectId}/comments`,
    {
      method: "POST",
      body: JSON.stringify({ text: payload.text }),
    },
    true,
  );
  await fetchProjectById(projectId);
};

export const addCommentReply = async (projectId: string, commentId: string, payload: { user: string; text: string }) => {
  await api(
    `/projects/${projectId}/comments/${commentId}/replies`,
    {
      method: "POST",
      body: JSON.stringify({ text: payload.text }),
    },
    true,
  );
  await fetchProjectById(projectId);
};

export const fundProject = async (projectId: string, amount: number, userId: string) => {
  const order = await api<{ contributionId: string; razorpayOrderId: string; keyId: string }>(
    "/payments/razorpay/order",
    {
      method: "POST",
      body: JSON.stringify({ projectId, amount }),
    },
    true,
  );

  const session = getAuthSession();
  const checkoutResponse = await openRazorpayCheckout({
    keyId: order.keyId || "rzp_test_dummy",
    amount,
    projectId,
    orderId: order.razorpayOrderId,
    userName: session?.name,
    userEmail: session?.email,
  });

  const confirmation = await api<{ status: "succeeded" | "failed"; project: { raised_amount?: number | string; backers_count?: number | string } | null }>(
    "/payments/razorpay/verify",
    {
      method: "POST",
      body: JSON.stringify({
        razorpayOrderId: order.razorpayOrderId,
        razorpayPaymentId: checkoutResponse.razorpay_payment_id,
        simulate: "success",
      }),
    },
    true,
  );

  if (confirmation.status !== "succeeded" || !confirmation.project) {
    throw new Error("Razorpay dummy payment failed.");
  }

  const projectData = confirmation.project;

  const existing = getProjectById(projectId);
  if (!existing) {
    await syncProjectsFromServer();
    return getProjectById(projectId);
  }

  const updated: StoredProject = {
    ...existing,
    raised: Number(projectData.raised_amount ?? existing.raised),
    backers: Number(projectData.backers_count ?? existing.backers),
  };
  mergeProjectIntoCache(updated);

  const contributions = getContributionsMap();
  const prior = contributions[userId] ?? [];
  contributions[userId] = [{ projectId, amount, date: new Date().toISOString() }, ...prior];
  writeJson(CONTRIBUTIONS_KEY, contributions);

  return updated;
};

export const deleteProject = async (_projectId: string, _creatorName: string) =>
  ({ ok: false as const, error: "Delete API not implemented yet." });

export const addProjectUpdate = async (projectId: string, payload: { title: string; content: string }) => {
  await api(
    `/projects/${projectId}/updates`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    true,
  );
  await fetchProjectById(projectId);
};

interface CreateProjectPayload {
  title: string;
  description: string;
  creator: string;
  category: string;
  image: string;
  goal: number;
  deadline: string;
  rewards: StoredProject["rewards"];
  milestones: StoredProject["milestones"];
}

export const addProject = async (project: CreateProjectPayload) => {
  const created = await api<ApiProject>(
    "/projects",
    {
      method: "POST",
      body: JSON.stringify({
        title: project.title,
        description: project.description,
        category: project.category,
        imageUrl: project.image,
        goalAmount: project.goal,
        deadline: project.deadline,
        rewards: project.rewards.map((reward) => ({
          title: reward.title,
          description: reward.description,
          amount: reward.amount,
        })),
        milestones: project.milestones.map((milestone) => ({
          title: milestone.title,
          description: milestone.description,
          targetAmount: milestone.targetAmount,
        })),
      }),
    },
    true,
  );

  const normalized = mapApiProject({
    ...created,
    creator: { name: project.creator },
    rewards: project.rewards.map((reward) => ({
      id: reward.id,
      title: reward.title,
      description: reward.description,
      amount: reward.amount,
    })),
    milestones: project.milestones.map((milestone, i) => ({
      id: milestone.id,
      title: milestone.title,
      description: milestone.description,
      target_amount: milestone.targetAmount,
      reached: false,
      sequence: i + 1,
    })),
    comments: [],
    updates: [],
  });
  mergeProjectIntoCache(normalized);
  return normalized;
};

export const getThemePreference = () => {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem(THEME_KEY) ?? "dark";
};

export const setThemePreference = (theme: "light" | "dark") => {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, theme);
};

export const getCreatedProjectsByUser = (userName: string) =>
  getProjects().filter((project) => project.creator.toLowerCase() === userName.toLowerCase());

export const getCreatedProjectsByUserId = (userId: string) =>
  getProjects().filter((project) => project.creatorId === userId);

export const getBackedProjectsByUser = (userId: string) => {
  const history = getHistoryMap()[userId];
  if (!history) return [];
  const fundedSet = new Set(history.fundedProjectIds);
  return getProjects().filter((project) => fundedSet.has(project.id));
};
