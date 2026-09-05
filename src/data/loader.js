import { useEffect, useState } from "react";

// Runtime access to the static JSON that tools/build-data.mjs writes into
// public/data/. Every file is fetched at most once per page load and shared.
const base = import.meta.env.BASE_URL || "/";
const cache = new Map();

function fetchJson(name) {
  if (!cache.has(name)) {
    const p = fetch(`${base}data/${name}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load ${name} (${r.status})`);
        return r.json();
      })
      .catch((err) => {
        cache.delete(name); // let a later render retry
        throw err;
      });
    cache.set(name, p);
  }
  return cache.get(name);
}

export const loadIndex = () => fetchJson("index.json");

// Same slug tools/build-data.mjs writes and the R2 video keys use:
// 110.36(7)(D)(i) -> 110-36-7-D-i
export const tekSlug = (code) => code.replace(/[().]+/g, "-").replace(/-+$/, "");
export const loadTek = (code) => fetchJson(`tek/${tekSlug(code)}.json`);

function useLoaded(name, loader) {
  const [state, setState] = useState({ data: null, error: null });
  useEffect(() => {
    let live = true;
    if (!name) return undefined;
    setState({ data: null, error: null });
    loader(name)
      .then((data) => live && setState({ data, error: null }))
      .catch((error) => live && setState({ data: null, error }));
    return () => {
      live = false;
    };
  }, [name, loader]);
  return state;
}

/** The slim index of all 278 TEKS: {data, error}. data is null while loading. */
export function useIndex() {
  return useLoaded("index.json", fetchJson);
}

/** One full entry by code, e.g. useTek("110.36(1)(B)"). */
export function useTek(code) {
  return useLoaded(code ? `tek/${tekSlug(code)}.json` : null, fetchJson);
}
