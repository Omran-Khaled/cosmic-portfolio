import { a as blackHole, c as planets, d as identity, i as timeline, l as orbits, n as useUniverse, o as galaxies, s as storyStops, t as UniverseProvider, u as contact } from "./useUniverse-C-hY1lCL.js";
import React, { Component, Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
//#region src/data/languages.ts
var languages = [{
	name: "Arabic",
	level: "Native",
	strength: 1
}, {
	name: "English",
	level: "Professional working",
	strength: .72
}];
//#endregion
//#region src/data/manifesto.ts
var manifesto = [
	"Interfaces are systems, not decorations.",
	"Every element on screen must earn its place.",
	"Constraints produce clarity.",
	"Accessible by default, fast by design.",
	"The best code reveals the thinking behind it."
];
//#endregion
//#region src/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region src/components/overlay/HUD.parts.tsx
var STOP_LABELS = {
	sun: "Identity",
	orbits: "Skill orbits",
	blackhole: "AI singularity",
	station: "Contact",
	...Object.fromEntries(galaxies.map((g) => [g.id, g.name]))
};
var DESTINATIONS = [
	{
		id: "sun",
		label: "Identity core",
		kind: "sun"
	},
	{
		id: "orbits",
		label: "Skill orbits",
		kind: "orbits"
	},
	...planets.map((p) => ({
		id: p.id,
		label: p.name,
		kind: "planet"
	})),
	...galaxies.map((g) => ({
		id: g.id,
		label: g.name,
		kind: "galaxy"
	})),
	{
		id: "blackhole",
		label: "AI engineering",
		kind: "blackhole"
	},
	{
		id: "station",
		label: "Contact station",
		kind: "station"
	}
];
var StoryControls = React.memo(({ storyIndex, onPrev, onNext, onExit }) => {
	return /* @__PURE__ */ jsxs("div", {
		className: "glass-panel flex items-center gap-2 rounded-full px-2 py-1.5",
		children: [
			/* @__PURE__ */ jsx("button", {
				onClick: onPrev,
				className: "rounded-full px-2 py-1 text-xs text-muted-foreground hover:text-foreground",
				"aria-label": "Previous stop",
				children: "←"
			}),
			/* @__PURE__ */ jsx("span", {
				className: "min-w-28 text-center text-xs text-foreground",
				children: STOP_LABELS[storyStops[storyIndex]] ?? "Journey"
			}),
			/* @__PURE__ */ jsx("button", {
				onClick: onNext,
				className: "rounded-full px-2 py-1 text-xs text-muted-foreground hover:text-foreground",
				"aria-label": "Next stop",
				children: "→"
			}),
			/* @__PURE__ */ jsx("button", {
				onClick: onExit,
				className: "rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground hover:bg-secondary/80",
				children: "Exit"
			})
		]
	});
});
StoryControls.displayName = "StoryControls";
var WarpPalette = React.memo(({ open, query, results, onQueryChange, onClose, onWarp }) => {
	return /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsx(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		onClick: onClose,
		className: "pointer-events-auto absolute inset-0 z-40 flex items-start justify-center bg-void/70 px-4 pt-28 backdrop-blur-sm",
		children: /* @__PURE__ */ jsxs(motion.div, {
			initial: {
				opacity: 0,
				y: -12,
				scale: .97
			},
			animate: {
				opacity: 1,
				y: 0,
				scale: 1
			},
			exit: {
				opacity: 0,
				y: -12,
				scale: .97
			},
			onClick: (e) => e.stopPropagation(),
			className: "glass-panel w-[min(92vw,30rem)] overflow-hidden rounded-2xl p-3",
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "Warp destination selector",
			children: [/* @__PURE__ */ jsx("input", {
				autoFocus: true,
				value: query,
				onChange: (e) => onQueryChange(e.target.value),
				onKeyDown: (e) => {
					if (e.key === "Enter" && results[0]) onWarp(results[0]);
				},
				placeholder: "Warp to a planet, galaxy or station…",
				"aria-label": "Search destinations",
				className: "w-full rounded-xl border border-border bg-void/60 px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/60"
			}), /* @__PURE__ */ jsxs("div", {
				className: "mt-2 max-h-64 overflow-y-auto",
				children: [results.map((d) => /* @__PURE__ */ jsx("button", {
					onClick: () => onWarp(d),
					className: "w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground",
					children: d.label
				}, d.id)), results.length === 0 && /* @__PURE__ */ jsx("p", {
					className: "px-3 py-4 text-xs text-muted-foreground",
					children: "No destination matches that signal."
				})]
			})]
		})
	}) });
});
WarpPalette.displayName = "WarpPalette";
var NavigationMap = React.memo(({ focus, setFocus }) => {
	if (!focus) return null;
	return /* @__PURE__ */ jsxs(motion.nav, {
		initial: {
			opacity: 0,
			x: -24
		},
		animate: {
			opacity: 1,
			x: 0
		},
		transition: { delay: .5 },
		className: "glass-panel pointer-events-auto absolute bottom-16 left-4 z-20 hidden max-h-[58vh] w-64 overflow-y-auto rounded-2xl p-4 md:block md:left-6",
		"aria-label": "Navigation map",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "label-mono",
				children: "Navigation map"
			}),
			/* @__PURE__ */ jsx("button", {
				onClick: () => setFocus({
					kind: "sun",
					id: "sun"
				}),
				className: cn("mt-3 w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary/60", focus?.id === "sun" && "bg-secondary text-foreground"),
				children: "☀️ Identity core"
			}),
			/* @__PURE__ */ jsx("button", {
				onClick: () => setFocus({
					kind: "orbits",
					id: "orbits"
				}),
				className: cn("mt-1 w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary/60", focus?.id === "orbits" && "bg-secondary text-foreground"),
				children: "🌀 All skill orbits"
			}),
			orbits.map((orbit) => /* @__PURE__ */ jsxs("div", {
				className: "mt-3",
				children: [/* @__PURE__ */ jsxs("p", {
					className: "flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider",
					style: { color: orbit.color },
					children: [/* @__PURE__ */ jsx("span", {
						className: "h-1.5 w-1.5 rounded-full",
						style: { background: orbit.color }
					}), orbit.name]
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-1 space-y-0.5",
					children: planets.filter((p) => p.orbit === orbit.id).map((planet) => /* @__PURE__ */ jsx("button", {
						onClick: () => setFocus({
							kind: "planet",
							id: planet.id
						}),
						className: cn("w-full rounded-md px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground", focus?.id === planet.id && "bg-secondary text-foreground"),
						children: planet.name
					}, planet.id))
				})]
			}, orbit.id)),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-4 space-y-0.5 border-t border-border pt-3",
				children: [
					galaxies.map((g) => /* @__PURE__ */ jsxs("button", {
						onClick: () => setFocus({
							kind: "galaxy",
							id: g.id
						}),
						className: cn("w-full rounded-md px-3 py-1.5 text-left text-xs text-muted-foreground hover:bg-secondary/60 hover:text-foreground", focus?.id === g.id && "bg-secondary text-foreground"),
						children: ["🌌 ", g.name]
					}, g.id)),
					/* @__PURE__ */ jsx("button", {
						onClick: () => setFocus({
							kind: "blackhole",
							id: "blackhole"
						}),
						className: "w-full rounded-md px-3 py-1.5 text-left text-xs text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
						children: "🕳 AI engineering"
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: () => setFocus({
							kind: "station",
							id: "station"
						}),
						className: "w-full rounded-md px-3 py-1.5 text-left text-xs text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
						children: "🛰 Contact station"
					})
				]
			})
		]
	});
});
NavigationMap.displayName = "NavigationMap";
//#endregion
//#region src/components/overlay/HUD.tsx
function HUD() {
	const { focus, setFocus, mode, storyIndex, startStory, nextStop, prevStop, exitStory, clearFocus, autoOrbit, toggleAutoOrbit } = useUniverse();
	const [jump, setJump] = useState(false);
	const [query, setQuery] = useState("");
	const results = useMemo(() => DESTINATIONS.filter((d) => d.label.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 8), [query]);
	const closeJump = useCallback(() => {
		setJump(false);
		setQuery("");
	}, []);
	const warpTo = useCallback((destination) => {
		setFocus({
			kind: destination.kind,
			id: destination.id
		});
		closeJump();
	}, [setFocus, closeJump]);
	useEffect(() => {
		const onKey = (e) => {
			const tag = e.target?.tagName;
			const typing = tag === "INPUT" || tag === "TEXTAREA";
			if (e.key === "Escape") {
				if (jump) setJump(false);
				else clearFocus();
				return;
			}
			if (typing) return;
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setJump(true);
				return;
			}
			if (e.key === "j" || e.key === "/") {
				e.preventDefault();
				setJump(true);
			} else if (e.key === "ArrowRight" || e.key === "n") nextStop();
			else if (e.key === "ArrowLeft" || e.key === "p") prevStop();
			else if (e.key === " ") {
				e.preventDefault();
				if (mode === "story") exitStory();
				else startStory();
			} else if (e.key === "f") toggleAutoOrbit();
			else if (e.key === "r") {
				const random = DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];
				if (random) setFocus({
					kind: random.kind,
					id: random.id
				});
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		jump,
		clearFocus,
		nextStop,
		prevStop,
		mode,
		exitStory,
		startStory,
		toggleAutoOrbit,
		setFocus
	]);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs(motion.header, {
			initial: {
				opacity: 0,
				y: -16
			},
			animate: {
				opacity: 1,
				y: 0
			},
			transition: { delay: .2 },
			className: "pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-start justify-between gap-4 p-4 md:p-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "pointer-events-auto",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "label-mono text-primary",
						children: "Explorable Universe"
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "font-display text-xl font-bold tracking-tight text-starlight md:text-2xl",
						children: identity.name
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "text-xs text-muted-foreground md:text-sm",
						children: [
							identity.role,
							" · ",
							identity.location
						]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "pointer-events-auto flex flex-wrap items-center justify-end gap-2",
				children: [
					/* @__PURE__ */ jsxs("button", {
						onClick: () => setJump(true),
						className: "rounded-full border border-border bg-void/60 px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground",
						children: ["⌖ Warp to… ", /* @__PURE__ */ jsx("span", {
							className: "ml-1 opacity-60",
							children: "J"
						})]
					}),
					mode === "story" ? /* @__PURE__ */ jsx(StoryControls, {
						storyIndex,
						onPrev: prevStop,
						onNext: nextStop,
						onExit: exitStory
					}) : /* @__PURE__ */ jsx("button", {
						onClick: startStory,
						className: "rounded-full border border-primary/50 bg-primary/15 px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/25",
						children: "▶ Story mode"
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: toggleAutoOrbit,
						"aria-pressed": !autoOrbit,
						className: cn("rounded-full border px-4 py-2 text-xs transition-colors", autoOrbit ? "border-border text-muted-foreground hover:text-foreground" : "border-signal/60 bg-signal/15 text-signal"),
						children: autoOrbit ? "🛰 Auto drift" : "🕹 Free flight"
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: clearFocus,
						className: "rounded-full border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground",
						children: "Reset view"
					})
				]
			})]
		}),
		/* @__PURE__ */ jsx(NavigationMap, {
			focus,
			setFocus
		}),
		/* @__PURE__ */ jsx("div", {
			className: "pointer-events-none absolute bottom-4 left-0 right-0 z-20 flex justify-center px-4",
			children: /* @__PURE__ */ jsx("p", {
				className: "label-mono rounded-full border border-border/70 bg-void/70 px-4 py-1.5 text-center text-[10px]",
				children: "drag · rotate \xA0/\xA0 scroll · zoom \xA0/\xA0 J · warp \xA0/\xA0 ← → · travel \xA0/\xA0 F · free flight \xA0/\xA0 R · random"
			})
		}),
		/* @__PURE__ */ jsx(WarpPalette, {
			open: jump,
			query,
			results,
			onQueryChange: setQuery,
			onClose: closeJump,
			onWarp: warpTo
		})
	] });
}
//#endregion
//#region src/components/shared/InfoRow.tsx
function InfoRow({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-baseline justify-between gap-4 border-b border-border/60 py-2 last:border-0",
		children: [/* @__PURE__ */ jsx("span", {
			className: "label-mono",
			children: label
		}), /* @__PURE__ */ jsx("span", {
			className: "text-sm text-foreground",
			children: value
		})]
	});
}
function Block({ label, children }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
		className: "label-mono",
		children: label
	}), /* @__PURE__ */ jsx("div", {
		className: "mt-2 text-sm leading-relaxed text-muted-foreground",
		children
	})] });
}
function Bullets({ items, dot = "bg-accent" }) {
	return /* @__PURE__ */ jsx("ul", {
		className: "space-y-2",
		children: items.map((item) => /* @__PURE__ */ jsxs("li", {
			className: "flex gap-3 text-sm leading-relaxed text-muted-foreground",
			children: [/* @__PURE__ */ jsx("span", { className: `mt-2 h-1 w-1 shrink-0 rounded-full ${dot}` }), item]
		}, item))
	});
}
function LinkButton({ href, children, primary }) {
	return /* @__PURE__ */ jsx("a", {
		href,
		target: "_blank",
		rel: "noreferrer noopener",
		className: primary ? "flex-1 rounded-xl border border-primary/50 bg-primary/15 px-3 py-2 text-center text-xs font-medium text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/25" : "flex-1 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-center text-xs font-medium text-foreground transition-all hover:-translate-y-0.5 hover:bg-secondary",
		children
	});
}
function Meter({ value, color }) {
	return /* @__PURE__ */ jsx("div", {
		className: "h-1 w-full overflow-hidden rounded-full bg-secondary",
		children: /* @__PURE__ */ jsx("div", {
			className: "h-full rounded-full",
			style: {
				width: `${value * 100}%`,
				background: color ?? "var(--color-primary, currentColor)"
			}
		})
	});
}
//#endregion
//#region src/components/overlay/panels/IdentityPanel.tsx
var IdentityPanel = React.memo(() => {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "text-sm leading-relaxed text-foreground",
				children: identity.headline
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-2",
				children: identity.stats.map((s) => /* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-border/70 bg-secondary/30 p-3",
					children: [/* @__PURE__ */ jsx("p", {
						className: "label-mono",
						children: s.label
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm font-medium text-foreground",
						children: s.value
					})]
				}, s.label))
			}),
			/* @__PURE__ */ jsx(Block, {
				label: "Profile",
				children: /* @__PURE__ */ jsx("p", { children: identity.bio })
			}),
			/* @__PURE__ */ jsx(Block, {
				label: "Operating principles",
				children: /* @__PURE__ */ jsx(Bullets, {
					items: identity.principles,
					dot: "bg-primary"
				})
			}),
			/* @__PURE__ */ jsx(Block, {
				label: "Signal fragments",
				children: /* @__PURE__ */ jsx(Bullets, {
					items: identity.fragments,
					dot: "bg-primary"
				})
			})
		]
	});
});
IdentityPanel.displayName = "IdentityPanel";
//#endregion
//#region src/components/overlay/panels/OrbitPanel.tsx
var OrbitPanel = React.memo(() => {
	return /* @__PURE__ */ jsx("div", {
		className: "space-y-4",
		children: orbits.map((orbit) => /* @__PURE__ */ jsxs("div", {
			className: "rounded-xl border border-border/70 bg-secondary/30 p-3",
			children: [/* @__PURE__ */ jsx("p", {
				className: "text-xs font-semibold uppercase tracking-wider",
				style: { color: orbit.color },
				children: orbit.name
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-2 space-y-1.5",
				children: planets.filter((p) => p.orbit === orbit.id).map((p) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex justify-between text-xs",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-foreground",
						children: p.name
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-muted-foreground",
						children: [Math.round(p.level * 100), "%"]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-1",
					children: /* @__PURE__ */ jsx(Meter, {
						value: p.level,
						color: orbit.color
					})
				})] }, p.id))
			})]
		}, orbit.id))
	});
});
OrbitPanel.displayName = "OrbitPanel";
//#endregion
//#region src/components/overlay/panels/PlanetPanel.tsx
var PlanetPanel = React.memo(({ id }) => {
	const planet = planets.find((p) => p.id === id);
	if (!planet) return null;
	if (!orbits.find((o) => o.id === planet.orbit)) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between text-xs text-muted-foreground",
				children: [/* @__PURE__ */ jsx("span", {
					className: "label-mono",
					children: "Depth signal"
				}), /* @__PURE__ */ jsxs("span", { children: [Math.round(planet.level * 100), "%"] })]
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-2",
				children: /* @__PURE__ */ jsx(Meter, {
					value: planet.level,
					color: planet.color
				})
			})] }),
			/* @__PURE__ */ jsx(Block, {
				label: "How I work here",
				children: /* @__PURE__ */ jsx(Bullets, {
					items: planet.depth,
					dot: "bg-primary"
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-signal/40 bg-signal/10 p-3",
				children: [/* @__PURE__ */ jsx("p", {
					className: "label-mono text-signal",
					children: "In practice"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm leading-relaxed text-foreground",
					children: planet.evidence
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ jsx("p", {
					className: "label-mono",
					children: "Moons · sub-skills"
				}), planet.moons.map((moon) => /* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-border/70 bg-secondary/30 p-3",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-sm font-medium text-foreground",
							children: moon.name
						}),
						moon.note && /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs leading-relaxed text-muted-foreground",
							children: moon.note
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-2 flex flex-wrap gap-1.5",
							children: moon.tags.map((tag) => /* @__PURE__ */ jsx("span", {
								className: "rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground",
								children: tag
							}, tag))
						})
					]
				}, moon.name))]
			})
		]
	});
});
PlanetPanel.displayName = "PlanetPanel";
//#endregion
//#region src/components/overlay/VideoPortal.tsx
/**
* Cinematic video portal. The video element is only mounted once the modal is
* opened, and `preload="none"` guarantees no bytes are fetched until the user
* actually presses play — so the 3D scene never competes with video bandwidth.
*/
function VideoPortal({ open, src, title, onClose }) {
	const videoRef = useRef(null);
	const [playing, setPlaying] = useState(false);
	useEffect(() => {
		if (!open) {
			setPlaying(false);
			const v = videoRef.current;
			if (v) {
				v.pause();
				v.removeAttribute("src");
				v.load();
			}
		}
	}, [open]);
	useEffect(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);
	return /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsx(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .25 },
		onClick: onClose,
		className: "fixed inset-0 z-50 flex items-center justify-center bg-void/85 p-4 backdrop-blur-md",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": `${title} demo video`,
		children: /* @__PURE__ */ jsxs(motion.div, {
			initial: {
				opacity: 0,
				scale: .92,
				y: 16
			},
			animate: {
				opacity: 1,
				scale: 1,
				y: 0
			},
			exit: {
				opacity: 0,
				scale: .95,
				y: 12
			},
			transition: {
				type: "spring",
				stiffness: 260,
				damping: 26
			},
			onClick: (e) => e.stopPropagation(),
			className: "glass-panel w-[min(92vw,56rem)] overflow-hidden rounded-2xl",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-border/60 px-5 py-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "label-mono text-primary",
						children: "Live demo"
					}), /* @__PURE__ */ jsx("h3", {
						className: "font-display text-lg font-semibold text-starlight",
						children: title
					})] }), /* @__PURE__ */ jsx("button", {
						onClick: onClose,
						"aria-label": "Close video",
						className: "rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
						children: "✕ Close"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "relative aspect-video w-full bg-black",
					children: [/* @__PURE__ */ jsx("video", {
						ref: videoRef,
						src,
						preload: "none",
						controls: true,
						playsInline: true,
						onPlay: () => setPlaying(true),
						onPause: () => setPlaying(false),
						className: "h-full w-full"
					}), !playing && /* @__PURE__ */ jsx("div", {
						className: "pointer-events-none absolute inset-0 flex items-center justify-center",
						children: /* @__PURE__ */ jsx("div", {
							className: "flex h-16 w-16 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-2xl text-primary",
							children: "▶"
						})
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "px-5 py-3 text-center",
					children: /* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: "Press play to stream the demo. Video loads on demand — no bandwidth used until you start it."
					})
				})
			]
		})
	}) });
}
//#endregion
//#region src/components/overlay/panels/GalaxyPanel.tsx
var GalaxyPanel = React.memo(({ id }) => {
	const galaxy = galaxies.find((g) => g.id === id);
	const [demoOpen, setDemoOpen] = useState(false);
	if (!galaxy) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ jsx("button", {
					onClick: () => setDemoOpen(true),
					className: "flex-1 rounded-xl border border-primary/50 bg-primary/15 px-3 py-2 text-center text-xs font-medium text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/25",
					children: "▶ Watch demo"
				}), /* @__PURE__ */ jsx(LinkButton, {
					href: galaxy.links.github,
					children: "⌥ GitHub"
				})]
			}),
			/* @__PURE__ */ jsx(VideoPortal, {
				open: demoOpen,
				src: galaxy.links.demo,
				title: galaxy.name,
				onClose: () => setDemoOpen(false)
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-2",
				children: [
					["Role", galaxy.role],
					["Duration", galaxy.duration],
					["Type", galaxy.type],
					["Status", galaxy.status]
				].map(([label, value]) => /* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-border/70 bg-secondary/30 p-2.5",
					children: [/* @__PURE__ */ jsx("p", {
						className: "label-mono",
						children: label
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-0.5 text-xs text-foreground",
						children: value
					})]
				}, label))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap gap-1.5",
				children: galaxy.stack.map((tech) => /* @__PURE__ */ jsx("span", {
					className: "rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-[11px] text-primary",
					children: tech
				}, tech))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex gap-2",
				children: galaxy.metrics.map((m) => /* @__PURE__ */ jsxs("div", {
					className: "flex-1 rounded-xl border border-border/70 bg-void/40 p-2.5 text-center",
					children: [/* @__PURE__ */ jsx("p", {
						className: "font-display text-sm font-semibold text-starlight",
						children: m.value
					}), /* @__PURE__ */ jsx("p", {
						className: "label-mono mt-0.5 text-[10px]",
						children: m.label
					})]
				}, m.label))
			}),
			/* @__PURE__ */ jsx(Block, {
				label: "Problem",
				children: /* @__PURE__ */ jsx("p", { children: galaxy.layers.problem })
			}),
			/* @__PURE__ */ jsx(Block, {
				label: "Solution",
				children: /* @__PURE__ */ jsx("p", { children: galaxy.layers.solution })
			}),
			/* @__PURE__ */ jsx(Block, {
				label: "Feature set",
				children: /* @__PURE__ */ jsx(Bullets, {
					items: galaxy.features,
					dot: "bg-primary"
				})
			}),
			/* @__PURE__ */ jsx(Block, {
				label: "Engineering decisions",
				children: /* @__PURE__ */ jsx(Bullets, { items: galaxy.layers.decisions })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ jsx("p", {
					className: "label-mono",
					children: "Hard problems"
				}), galaxy.challenges.map((c) => /* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-nebula/40 bg-nebula/10 p-3",
					children: [/* @__PURE__ */ jsx("p", {
						className: "font-display text-sm font-semibold text-nebula-foreground",
						children: c.title
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm leading-relaxed text-muted-foreground",
						children: c.body
					})]
				}, c.title))]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-signal/40 bg-signal/10 p-3",
				children: [/* @__PURE__ */ jsx("p", {
					className: "label-mono text-signal",
					children: "Impact"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm leading-relaxed text-foreground",
					children: galaxy.layers.impact
				})]
			})
		]
	});
});
GalaxyPanel.displayName = "GalaxyPanel";
//#endregion
//#region src/components/overlay/panels/BlackHolePanel.tsx
var BlackHolePanel = React.memo(() => {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-5",
		children: [
			blackHole.pillars.map((p) => /* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-nebula/40 bg-nebula/10 p-3",
				children: [/* @__PURE__ */ jsx("p", {
					className: "font-display text-sm font-semibold text-nebula-foreground",
					children: p.title
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm leading-relaxed text-muted-foreground",
					children: p.body
				})]
			}, p.title)),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "label-mono",
				children: "The loop"
			}), /* @__PURE__ */ jsx("ol", {
				className: "mt-2 space-y-2 border-l border-border pl-4",
				children: blackHole.loop.map((l, i) => /* @__PURE__ */ jsxs("li", {
					className: "relative",
					children: [
						/* @__PURE__ */ jsx("span", { className: "absolute -left-[21px] mt-1.5 h-2 w-2 rounded-full bg-primary" }),
						/* @__PURE__ */ jsxs("p", {
							className: "text-sm font-medium text-foreground",
							children: [
								i + 1,
								". ",
								l.step
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs leading-relaxed text-muted-foreground",
							children: l.body
						})
					]
				}, l.step))
			})] }),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "label-mono",
				children: "Constellation · learning path"
			}), /* @__PURE__ */ jsx("ol", {
				className: "mt-2 space-y-3",
				children: timeline.map((t) => /* @__PURE__ */ jsxs("li", {
					className: "rounded-xl border border-border/70 bg-secondary/30 p-3",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "label-mono text-primary",
							children: t.year
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm font-medium text-foreground",
							children: t.title
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs leading-relaxed text-muted-foreground",
							children: t.detail
						})
					]
				}, t.year))
			})] })
		]
	});
});
BlackHolePanel.displayName = "BlackHolePanel";
//#endregion
//#region src/components/overlay/panels/ContactPanel.tsx
var ContactPanel = React.memo(() => {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ jsx("div", { children: contact.lines.map((l) => /* @__PURE__ */ jsx(InfoRow, {
				label: l.label,
				value: l.value
			}, l.label)) }),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ jsx("p", {
					className: "label-mono",
					children: "Channels"
				}), contact.channels.map((c) => /* @__PURE__ */ jsxs("a", {
					href: c.href,
					target: "_blank",
					rel: "noreferrer noopener",
					className: "flex items-center justify-between rounded-xl border border-border bg-secondary/30 px-3 py-2 text-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/10",
					children: [/* @__PURE__ */ jsx("span", {
						className: "label-mono",
						children: c.label
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-foreground",
						children: [c.obfuscated ?? c.value, " ↗"]
					})]
				}, c.label))]
			}),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "label-mono",
				children: "Language signals"
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-3 space-y-3",
				children: languages.map((lang) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex justify-between text-xs text-muted-foreground",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-foreground",
						children: lang.name
					}), /* @__PURE__ */ jsx("span", { children: lang.level })]
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-1.5",
					children: /* @__PURE__ */ jsx(Meter, { value: lang.strength })
				})] }, lang.name))
			})] }),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "label-mono",
				children: "Cosmic manifesto"
			}), /* @__PURE__ */ jsx("ul", {
				className: "mt-2 space-y-1.5",
				children: manifesto.map((m) => /* @__PURE__ */ jsxs("li", {
					className: "text-sm italic text-muted-foreground",
					children: [
						"\"",
						m,
						"\""
					]
				}, m))
			})] })
		]
	});
});
ContactPanel.displayName = "ContactPanel";
//#endregion
//#region src/components/overlay/DetailPanel.tsx
function DetailPanel() {
	const { focus, clearFocus } = useUniverse();
	if (!focus) return null;
	let PanelComponent = null;
	switch (focus.kind) {
		case "sun":
			PanelComponent = IdentityPanel;
			break;
		case "orbits":
			PanelComponent = OrbitPanel;
			break;
		case "planet":
			PanelComponent = PlanetPanel;
			break;
		case "galaxy":
			PanelComponent = GalaxyPanel;
			break;
		case "blackhole":
			PanelComponent = BlackHolePanel;
			break;
		case "station":
			PanelComponent = ContactPanel;
			break;
		default: return null;
	}
	const getPanelContent = () => {
		switch (focus.kind) {
			case "sun": return {
				eyebrow: "Identity Core",
				title: "Omran Khaled",
				subtitle: "Front-end Developer · Damascus, Syria"
			};
			case "orbits": return {
				eyebrow: "Skill orbits",
				title: "Four systems of practice",
				subtitle: "Every planet belongs to an orbit; every orbit answers a different kind of question."
			};
			case "planet": {
				const planet = planets.find((p) => p.id === focus.id);
				if (!planet) return null;
				const orbit = orbits.find((o) => o.id === planet.orbit);
				if (!orbit) return null;
				return {
					eyebrow: orbit.name,
					title: planet.name,
					subtitle: planet.summary
				};
			}
			case "galaxy": {
				const galaxy = galaxies.find((g) => g.id === focus.id);
				if (!galaxy) return null;
				return {
					eyebrow: `Project Galaxy · ${galaxy.year}`,
					title: galaxy.name,
					subtitle: galaxy.tagline
				};
			}
			case "blackhole": return {
				eyebrow: "Singularity",
				title: "AI Engineering",
				subtitle: "The loop of engineering with AI assistance"
			};
			case "station": return {
				eyebrow: "Uplink",
				title: "Contact",
				subtitle: "Signal open for front-end and AI-assisted engineering work."
			};
			default: return null;
		}
	};
	const content = getPanelContent();
	if (!content || !PanelComponent) return null;
	return /* @__PURE__ */ jsx(AnimatePresence, {
		mode: "wait",
		children: /* @__PURE__ */ jsxs(motion.aside, {
			initial: {
				opacity: 0,
				x: 48,
				filter: "blur(6px)"
			},
			animate: {
				opacity: 1,
				x: 0,
				filter: "blur(0px)"
			},
			exit: {
				opacity: 0,
				x: 48,
				filter: "blur(6px)"
			},
			transition: {
				type: "spring",
				stiffness: 240,
				damping: 30
			},
			className: "glass-panel pointer-events-auto absolute right-4 top-20 z-20 max-h-[74vh] w-[min(92vw,27rem)] overflow-y-auto rounded-2xl p-5 md:right-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "label-mono text-primary",
						children: content.eyebrow
					}), /* @__PURE__ */ jsx("h2", {
						className: "mt-1 font-display text-2xl font-semibold text-starlight",
						children: content.title
					})] }), /* @__PURE__ */ jsx("button", {
						onClick: clearFocus,
						"aria-label": "Close panel",
						className: "rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
						children: "✕"
					})]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm leading-relaxed text-muted-foreground",
					children: content.subtitle
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-5",
					children: /* @__PURE__ */ jsx(PanelComponent, { id: focus.id })
				})
			]
		}, focus.id)
	});
}
//#endregion
//#region src/components/overlay/Intro.tsx
function Intro() {
	const [open, setOpen] = useState(true);
	const { startStory } = useUniverse();
	return /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsx(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: {
			opacity: 0,
			scale: 1.08,
			filter: "blur(8px)"
		},
		transition: {
			duration: .8,
			ease: [
				.22,
				1,
				.36,
				1
			]
		},
		className: "pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-void/80 px-6 backdrop-blur-md",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-xl text-center",
			children: [
				/* @__PURE__ */ jsx(motion.p, {
					initial: {
						opacity: 0,
						y: 12
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: .2 },
					className: "label-mono text-primary",
					children: "System online · Portfolio as a universe"
				}),
				/* @__PURE__ */ jsx(motion.h1, {
					initial: {
						opacity: 0,
						y: 18
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: .35 },
					className: "mt-4 font-display text-4xl font-bold leading-tight text-starlight md:text-6xl",
					children: /* @__PURE__ */ jsx("span", {
						className: "text-cosmic",
						children: identity.name
					})
				}),
				/* @__PURE__ */ jsxs(motion.p, {
					initial: {
						opacity: 0,
						y: 18
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: .5 },
					className: "mt-3 text-sm text-muted-foreground md:text-base",
					children: [
						identity.role,
						" · ",
						identity.location
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-8 space-y-2",
					children: manifesto.slice(0, 3).map((line, i) => /* @__PURE__ */ jsx(motion.p, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						transition: {
							delay: .8 + i * .45,
							duration: 1.1
						},
						className: "text-sm italic text-muted-foreground",
						children: line
					}, line))
				}),
				/* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						y: 14
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: 2.2 },
					className: "mt-10 flex flex-wrap items-center justify-center gap-3",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => setOpen(false),
						className: "rounded-full border border-primary/60 bg-primary/15 px-6 py-3 text-sm font-medium text-primary transition-all hover:bg-primary/25 hover:shadow-[var(--shadow-glow)]",
						children: "Enter the universe"
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => {
							startStory();
							setOpen(false);
						},
						className: "rounded-full border border-border px-6 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground",
						children: "Take the guided journey"
					})]
				})
			]
		})
	}, "intro") });
}
//#endregion
//#region src/components/overlay/MobileUniverse.tsx
function Section({ eyebrow, title, children }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "px-5 py-10",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "label-mono text-primary",
				children: eyebrow
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-1 font-display text-2xl font-semibold text-starlight",
				children: title
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-5",
				children
			})
		]
	});
}
/** Simplified 2D exploration for small screens and low-power devices. */
function MobileUniverse() {
	const [demo, setDemo] = useState(null);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[image:var(--gradient-cosmos)] pb-16",
		children: [
			/* @__PURE__ */ jsx(VideoPortal, {
				open: demo !== null,
				src: demo?.src ?? "",
				title: demo?.title ?? "",
				onClose: () => setDemo(null)
			}),
			/* @__PURE__ */ jsxs("header", {
				className: "px-5 pb-6 pt-14 text-center",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "label-mono text-primary",
						children: "Explorable universe · simplified"
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "mt-3 font-display text-4xl font-bold text-cosmic",
						children: identity.name
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: [
							identity.role,
							" · ",
							identity.location
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-6 space-y-2",
						children: identity.fragments.map((f, i) => /* @__PURE__ */ jsx(motion.p, {
							initial: {
								opacity: 0,
								y: 8
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { delay: i * .12 },
							className: "glass-panel rounded-full px-4 py-2 text-xs text-muted-foreground",
							children: f
						}, f))
					})
				]
			}),
			/* @__PURE__ */ jsx(Section, {
				eyebrow: "Orbits",
				title: "Skill systems",
				children: /* @__PURE__ */ jsx("div", {
					className: "space-y-6",
					children: orbits.map((orbit) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "text-xs font-semibold uppercase tracking-wider",
						style: { color: orbit.color },
						children: orbit.name
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-2 space-y-2",
						children: planets.filter((p) => p.orbit === orbit.id).map((planet) => /* @__PURE__ */ jsxs("div", {
							className: "glass-panel rounded-xl p-3",
							children: [
								/* @__PURE__ */ jsxs("p", {
									className: "text-sm font-medium text-foreground",
									children: ["🪐 ", planet.name]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-xs leading-relaxed text-muted-foreground",
									children: planet.summary
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-2 flex flex-wrap gap-1.5",
									children: planet.moons.flatMap((m) => m.tags).map((tag) => /* @__PURE__ */ jsx("span", {
										className: "rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground",
										children: tag
									}, tag))
								})
							]
						}, planet.id))
					})] }, orbit.id))
				})
			}),
			/* @__PURE__ */ jsx(Section, {
				eyebrow: "Galaxies",
				title: "Projects",
				children: /* @__PURE__ */ jsx("div", {
					className: "space-y-4",
					children: galaxies.map((g) => /* @__PURE__ */ jsxs("article", {
						className: "glass-panel rounded-2xl p-4",
						children: [
							/* @__PURE__ */ jsxs("h3", {
								className: "font-display text-lg font-semibold",
								style: { color: g.color },
								children: ["🌌 ", g.name]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: g.tagline
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-3 flex gap-2",
								children: [/* @__PURE__ */ jsx("button", {
									onClick: () => setDemo({
										src: g.links.demo,
										title: g.name
									}),
									className: "flex-1 rounded-xl border border-primary/50 bg-primary/15 px-3 py-2 text-center text-xs font-medium text-primary",
									children: "▶ Watch demo"
								}), /* @__PURE__ */ jsx("a", {
									href: g.links.github,
									target: "_blank",
									rel: "noreferrer noopener",
									className: "flex-1 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-center text-xs font-medium text-foreground",
									children: "⌥ GitHub"
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-3 grid grid-cols-2 gap-2 text-[10px]",
								children: [
									["Role", g.role],
									["Year", g.year],
									["Duration", g.duration],
									["Status", g.status]
								].map(([label, value]) => /* @__PURE__ */ jsxs("div", {
									className: "rounded-lg border border-border/70 bg-secondary/30 p-2",
									children: [/* @__PURE__ */ jsx("p", {
										className: "label-mono",
										children: label
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-0.5 text-foreground",
										children: value
									})]
								}, label))
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-3 flex flex-wrap gap-1.5",
								children: g.stack.map((s) => /* @__PURE__ */ jsx("span", {
									className: "rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] text-primary",
									children: s
								}, s))
							}),
							/* @__PURE__ */ jsx("ul", {
								className: "mt-3 space-y-1 text-[11px] text-muted-foreground",
								children: g.features.map((f) => /* @__PURE__ */ jsxs("li", { children: ["· ", f] }, f))
							}),
							/* @__PURE__ */ jsxs("dl", {
								className: "mt-4 space-y-3 text-xs leading-relaxed",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
										className: "label-mono",
										children: "Problem"
									}), /* @__PURE__ */ jsx("dd", {
										className: "mt-1 text-muted-foreground",
										children: g.layers.problem
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
										className: "label-mono",
										children: "Solution"
									}), /* @__PURE__ */ jsx("dd", {
										className: "mt-1 text-muted-foreground",
										children: g.layers.solution
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
										className: "label-mono",
										children: "Decisions"
									}), /* @__PURE__ */ jsx("dd", {
										className: "mt-1 space-y-1 text-muted-foreground",
										children: g.layers.decisions.map((d) => /* @__PURE__ */ jsxs("p", { children: ["· ", d] }, d))
									})] }),
									/* @__PURE__ */ jsxs("div", {
										className: "rounded-lg border border-signal/40 bg-signal/10 p-2",
										children: [/* @__PURE__ */ jsx("dt", {
											className: "label-mono text-signal",
											children: "Impact"
										}), /* @__PURE__ */ jsx("dd", {
											className: "mt-1 text-foreground",
											children: g.layers.impact
										})]
									})
								]
							})
						]
					}, g.id))
				})
			}),
			/* @__PURE__ */ jsx(Section, {
				eyebrow: "Singularity",
				title: blackHole.title,
				children: /* @__PURE__ */ jsx("div", {
					className: "space-y-3",
					children: blackHole.pillars.map((p) => /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-nebula/40 bg-nebula/10 p-3",
						children: [/* @__PURE__ */ jsx("p", {
							className: "font-display text-sm font-semibold text-nebula-foreground",
							children: p.title
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs leading-relaxed text-muted-foreground",
							children: p.body
						})]
					}, p.title))
				})
			}),
			/* @__PURE__ */ jsx(Section, {
				eyebrow: "Constellation",
				title: "Training & education",
				children: /* @__PURE__ */ jsx("ol", {
					className: "relative space-y-5 border-l border-border pl-5",
					children: timeline.map((t) => /* @__PURE__ */ jsxs("li", { children: [
						/* @__PURE__ */ jsx("span", { className: "absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-primary" }),
						/* @__PURE__ */ jsx("p", {
							className: "label-mono text-primary",
							children: t.year
						}),
						/* @__PURE__ */ jsx("p", {
							className: "font-display text-sm font-semibold text-foreground",
							children: t.title
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: t.body
						})
					] }, t.year))
				})
			}),
			/* @__PURE__ */ jsx(Section, {
				eyebrow: "Signals",
				title: "Languages",
				children: /* @__PURE__ */ jsx("div", {
					className: "space-y-3",
					children: languages.map((l) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between text-xs",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-foreground",
							children: l.name
						}), /* @__PURE__ */ jsx("span", {
							className: "text-muted-foreground",
							children: l.level
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-1.5 h-1 overflow-hidden rounded-full bg-secondary",
						children: /* @__PURE__ */ jsx("div", {
							className: "h-full rounded-full bg-primary animate-signal",
							style: { width: `${l.strength * 100}%` }
						})
					})] }, l.name))
				})
			}),
			/* @__PURE__ */ jsxs(Section, {
				eyebrow: "Uplink",
				title: contact.title,
				children: [/* @__PURE__ */ jsx("div", {
					className: "glass-panel rounded-2xl p-4",
					children: contact.lines.map((l) => /* @__PURE__ */ jsxs("div", {
						className: "flex justify-between border-b border-border/60 py-2 last:border-0",
						children: [/* @__PURE__ */ jsx("span", {
							className: "label-mono",
							children: l.label
						}), /* @__PURE__ */ jsx("span", {
							className: "text-sm text-foreground",
							children: l.value
						})]
					}, l.label))
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-6 space-y-2 text-center",
					children: manifesto.map((m) => /* @__PURE__ */ jsxs("p", {
						className: "text-xs italic text-muted-foreground",
						children: [
							"“",
							m,
							"”"
						]
					}, m))
				})]
			})
		]
	});
}
//#endregion
//#region src/components/ErrorBoundary.tsx
var ErrorBoundary = class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			error: null
		};
	}
	static getDerivedStateFromError(error) {
		return {
			hasError: true,
			error
		};
	}
	componentDidCatch(error, info) {
		console.error("ErrorBoundary caught an error:", error, info);
		this.props.onError?.(error, info);
	}
	render() {
		if (this.state.hasError) {
			if (this.props.fallback) return this.props.fallback;
			return /* @__PURE__ */ jsx("div", {
				className: "flex min-h-[400px] items-center justify-center rounded-2xl border border-border/70 bg-secondary/30 p-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-md space-y-4 text-center",
					children: [
						/* @__PURE__ */ jsx("h2", {
							className: "font-display text-2xl font-semibold text-starlight",
							children: "Something went wrong"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: "The cosmic canvas encountered an unexpected error. Please try refreshing the page."
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: () => this.setState({
								hasError: false,
								error: null
							}),
							className: "rounded-xl border border-primary/50 bg-primary/15 px-4 py-2 text-sm font-medium text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/25",
							children: "Try again"
						})
					]
				})
			});
		}
		return this.props.children;
	}
};
//#endregion
//#region src/hooks/use-mobile.tsx
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
	const [isMobile, setIsMobile] = useState(void 0);
	useEffect(() => {
		const mql = window.matchMedia(`(max-width: 767px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);
	return !!isMobile;
}
//#endregion
//#region src/features/universe/UniverseExperience.tsx
var UniverseCanvas = lazy(() => import("./UniverseCanvas-D7pFhHYS.js"));
function Loading() {
	return /* @__PURE__ */ jsx("div", {
		className: "absolute inset-0 flex items-center justify-center bg-[image:var(--gradient-cosmos)]",
		children: /* @__PURE__ */ jsxs("div", {
			className: "text-center",
			children: [/* @__PURE__ */ jsx("div", { className: "mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary" }), /* @__PURE__ */ jsx("p", {
				className: "label-mono mt-4",
				children: "Charting the universe…"
			})]
		})
	});
}
function UniverseExperience() {
	const [mounted, setMounted] = useState(false);
	const isMobile = useIsMobile();
	useEffect(() => setMounted(true), []);
	if (!mounted) return /* @__PURE__ */ jsx(Loading, {});
	if (isMobile) return /* @__PURE__ */ jsx(MobileUniverse, {});
	return /* @__PURE__ */ jsx(UniverseProvider, { children: /* @__PURE__ */ jsxs("main", {
		className: "relative h-screen w-full overflow-hidden bg-void",
		children: [
			/* @__PURE__ */ jsx(ErrorBoundary, {
				fallback: /* @__PURE__ */ jsx(Loading, {}),
				children: /* @__PURE__ */ jsx(Suspense, {
					fallback: /* @__PURE__ */ jsx(Loading, {}),
					children: /* @__PURE__ */ jsx(UniverseCanvas, {})
				})
			}),
			/* @__PURE__ */ jsx(HUD, {}),
			/* @__PURE__ */ jsx(DetailPanel, {}),
			/* @__PURE__ */ jsx(Intro, {})
		]
	}) });
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
var SplitComponent = UniverseExperience;
//#endregion
export { SplitComponent as component };
