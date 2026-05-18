import { apiFetch } from "@/shared/api/api";
import { SaveProfile } from "../model/types";
import { Profile } from "@prisma/client";

export const getProfile = () => {
  return apiFetch<Profile>("/api/profile");
};

export const saveProfile = (payload: SaveProfile) => {
  return apiFetch<void>("/api/profile", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
