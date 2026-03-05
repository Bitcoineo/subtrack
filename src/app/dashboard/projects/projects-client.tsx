"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Project } from "@/db/schema";

interface ProjectsClientProps {
  initialProjects: Project[];
  canCreate: boolean;
  limit: number | null;
}

export function ProjectsClient({
  initialProjects,
  canCreate,
  limit,
}: ProjectsClientProps) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const atLimit = limit !== null && projects.length >= limit;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to create project");
        return;
      }

      setProjects((prev) => [...prev, data.data]);
      setName("");
      setDescription("");
      setShowForm(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(projectId: string) {
    setDeletingId(projectId);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        router.refresh();
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-6">
        <p className="text-sm text-gray-500">
          {projects.length}
          {limit !== null ? ` / ${limit}` : ""} projects
        </p>
        {atLimit && !canCreate ? (
          <Link
            href="/pricing"
            className="text-sm font-medium text-accent hover:text-[#0555c4] transition-colors duration-150"
          >
            Upgrade for unlimited projects
          </Link>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            disabled={!canCreate && atLimit}
            className="px-5 py-2 bg-[#191C1F] text-white text-sm font-medium rounded-full hover:bg-[#2a2d31] transition-colors duration-150 disabled:opacity-50 shrink-0"
          >
            New Project
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 bg-white rounded-xl shadow-sm p-5"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="project-name"
                className="block text-sm font-medium text-[#191C1F] mb-1.5"
              >
                Name
              </label>
              <input
                id="project-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-[#191C1F] focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-shadow duration-150"
                placeholder="My Project"
              />
            </div>
            <div>
              <label
                htmlFor="project-description"
                className="block text-sm font-medium text-[#191C1F] mb-1.5"
              >
                Description
              </label>
              <input
                id="project-description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-[#191C1F] focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-shadow duration-150"
                placeholder="Optional description"
              />
            </div>
            {error && (
              <p className="text-sm text-[#E5484D]">{error}</p>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[#191C1F] text-white text-sm font-medium rounded-full hover:bg-[#2a2d31] transition-colors duration-150 disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Project"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError(null);
                }}
                className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-[#191C1F] transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <p className="text-gray-400">No projects yet. Create your first one!</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
          {projects.map((project) => (
            <div
              key={project.id}
              className="px-4 md:px-5 py-4 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-[#191C1F] truncate">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-sm text-gray-400 mt-0.5">
                    {project.description}
                  </p>
                )}
                <p className="text-xs text-gray-300 mt-1">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(project.id)}
                disabled={deletingId === project.id}
                className="text-sm text-gray-400 hover:text-[#E5484D] disabled:opacity-50 transition-colors duration-150 shrink-0 py-1 pl-3"
              >
                {deletingId === project.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
