import { DEFAULT_SETTINGS } from "./calculations";
import type { Project } from "./types";
import { newId } from "./id";

const STORAGE_KEY = "wall-area-calculator-v1";

export function createEmptyProject(): Project {
  return {
    id: newId(),
    name: "Новый объект",
    rooms: [],
    settings: { ...DEFAULT_SETTINGS },
  };
}

export function loadProject(): Project {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyProject();
    const parsed = JSON.parse(raw) as Project;
    return {
      ...createEmptyProject(),
      ...parsed,
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
    };
  } catch {
    return createEmptyProject();
  }
}

export function saveProject(project: Project): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
}
