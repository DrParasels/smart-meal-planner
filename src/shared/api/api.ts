export async function apiFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  // DELETE часто возвращает 204 No Content (пустое тело)
  if (res.status === 204) {
    return undefined as T;
  }
  // Если тело пустое — тоже не пытаемся парсить JSON
  const contentLength = res.headers.get("content-length");
  if (contentLength === "0") {
    return undefined as T;
  }
  // Иногда сервер может вернуть не JSON
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

type Registration = {
  login: string;
  email: string;
  password: string;
};

export const register = (payload: Registration) => {
  return apiFetch<void>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

type Login = {
  email: string;
  password: string;
};

export const login = (payload: Login) => {
  return apiFetch<void>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  })
}
