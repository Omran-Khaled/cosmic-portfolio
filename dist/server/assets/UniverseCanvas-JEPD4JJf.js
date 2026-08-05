import { a as blackHole, c as planets, d as identity, i as timeline, l as orbits, n as useUniverse, o as galaxies, r as useUniverseStore, u as contact } from "./useUniverse-uSElxtBe.js";
import { Suspense, useMemo, useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, Html, OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";
//#region src/components/universe/Starfield.tsx
var STAR_PALETTE = [
	new THREE.Color("#bae6fd"),
	new THREE.Color("#f5d0fe"),
	new THREE.Color("#fde68a"),
	new THREE.Color("#ffffff")
];
function createStarfieldGeometry(count) {
	const positions = new Float32Array(count * 3);
	const colors = new Float32Array(count * 3);
	for (let i = 0; i < count; i++) {
		const r = 90 + Math.random() * 160;
		const theta = Math.random() * Math.PI * 2;
		const phi = Math.acos(2 * Math.random() - 1);
		positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
		positions[i * 3 + 1] = r * Math.cos(phi) * .6;
		positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
		const c = STAR_PALETTE[Math.floor(Math.random() * STAR_PALETTE.length)];
		if (!c) continue;
		colors[i * 3] = c.r;
		colors[i * 3 + 1] = c.g;
		colors[i * 3 + 2] = c.b;
	}
	const geo = new THREE.BufferGeometry();
	geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
	geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
	return geo;
}
function Starfield({ count = 2600 }) {
	const ref = useRef(null);
	const geometry = useMemo(() => createStarfieldGeometry(count), [count]);
	useFrame((_, delta) => {
		if (ref.current) ref.current.rotation.y += delta * .007;
	});
	return /* @__PURE__ */ jsx("points", {
		ref,
		geometry,
		children: /* @__PURE__ */ jsx("pointsMaterial", {
			size: .7,
			sizeAttenuation: true,
			vertexColors: true,
			transparent: true,
			opacity: .85,
			depthWrite: false
		})
	});
}
//#endregion
//#region src/constants/camera.ts
var DEFAULT_POS = new THREE.Vector3(0, 22, 62);
var DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);
var ORIGIN = new THREE.Vector3(0, 0, 0);
var UP_AXIS = new THREE.Vector3(0, 1, 0);
var FOCUS_DISTANCE = {
	sun: 14,
	planet: 6,
	galaxy: 30,
	blackhole: 32,
	station: 12,
	orbits: 52
};
var DRIFT_SPEED = .045;
var DRIFT_Y_FREQ = .22;
var DRIFT_FREQ = .18;
var SWING_SPEED = .12;
var SWING_AMPLITUDE = .35;
var VERTICAL_OFFSET_RATIO = .35;
var WARP_DISTANCE_MULTIPLIER = .35;
var WARP_DECAY_RATE = 3.2;
var TRANSITION_SPEED_BASE = 1.6;
var TRANSITION_SPEED_FACTOR = .06;
var TARGET_LERP_SPEED = 3.5;
var DEFAULT_DIRECTION = new THREE.Vector3(0, 0, 1);
//#endregion
//#region src/components/universe/CameraRig.tsx
/**
* Cinematic camera: eases toward the focused body, keeps a slow free drift while
* exploring, and punches the field of view on every warp for a sense of travel.
*/
function CameraRig({ controls }) {
	const { camera } = useThree();
	const focus = useUniverseStore((s) => s.focus);
	const nodes = useUniverseStore((s) => s.nodes);
	const autoOrbit = useUniverseStore((s) => s.autoOrbit);
	const warpAt = useUniverseStore((s) => s.warpAt);
	const desiredPos = useRef(DEFAULT_POS.clone());
	const desiredTarget = useRef(DEFAULT_TARGET.clone());
	const drift = useRef(0);
	const lastWarp = useRef(0);
	const warpEnergy = useRef(0);
	const baseFov = useRef(null);
	const nodePosition = useRef(new THREE.Vector3());
	const direction = useRef(new THREE.Vector3());
	const verticalOffset = useRef(new THREE.Vector3());
	useFrame(({ clock }, delta) => {
		const cam = camera;
		if (baseFov.current === null && cam.isPerspectiveCamera) baseFov.current = cam.fov;
		if (warpAt !== lastWarp.current) {
			lastWarp.current = warpAt;
			warpEnergy.current = 1;
		}
		warpEnergy.current = THREE.MathUtils.damp(warpEnergy.current, 0, WARP_DECAY_RATE, delta);
		if (focus) {
			const node = focus.kind === "orbits" ? ORIGIN : nodes.get(focus.id);
			if (node) {
				const dist = FOCUS_DISTANCE[focus.kind] ?? 14;
				direction.current.copy(node).normalize();
				if (direction.current.lengthSq() < .001) direction.current.copy(DEFAULT_DIRECTION);
				if (autoOrbit) {
					const swing = clock.getElapsedTime() * SWING_SPEED;
					direction.current.applyAxisAngle(UP_AXIS, Math.sin(swing) * SWING_AMPLITUDE);
				}
				desiredTarget.current.copy(node);
				nodePosition.current.copy(node);
				verticalOffset.current.set(0, dist * VERTICAL_OFFSET_RATIO, 0);
				desiredPos.current.copy(nodePosition.current).add(direction.current.multiplyScalar(dist * (1 + warpEnergy.current * WARP_DISTANCE_MULTIPLIER))).add(verticalOffset.current);
			}
		} else if (!autoOrbit) {
			const ctrlFree = controls.current;
			if (ctrlFree) ctrlFree.update();
			return;
		} else {
			drift.current += delta * DRIFT_SPEED;
			const r = 62 + Math.sin(clock.getElapsedTime() * DRIFT_FREQ) * 4;
			desiredPos.current.set(Math.sin(drift.current) * r, 22 + Math.sin(clock.getElapsedTime() * DRIFT_Y_FREQ) * 3, Math.cos(drift.current) * r);
			desiredTarget.current.copy(DEFAULT_TARGET);
		}
		const gap = camera.position.distanceTo(desiredPos.current);
		const speed = THREE.MathUtils.clamp(TRANSITION_SPEED_BASE + gap * TRANSITION_SPEED_FACTOR, TRANSITION_SPEED_BASE, 6);
		camera.position.lerp(desiredPos.current, 1 - Math.exp(-speed * delta));
		if (cam.isPerspectiveCamera && baseFov.current !== null) {
			const targetFov = baseFov.current + warpEnergy.current * 16;
			cam.fov += (targetFov - cam.fov) * Math.min(1, delta * 6);
			cam.updateProjectionMatrix();
		}
		const ctrl = controls.current;
		if (ctrl) ctrl.target.lerp(desiredTarget.current, 1 - Math.exp(-TARGET_LERP_SPEED * delta));
		else camera.lookAt(desiredTarget.current);
	});
	return null;
}
//#endregion
//#region src/components/celestial/Sun.tsx
function Sun() {
	const core = useRef(null);
	const halo = useRef(null);
	const worldPosition = useRef(new THREE.Vector3());
	const active = useUniverseStore((s) => s.hovered === "sun");
	const isFocused = useUniverseStore((s) => s.focus?.id === "sun");
	const setFocus = useUniverseStore((s) => s.setFocus);
	const setHovered = useUniverseStore((s) => s.setHovered);
	const registerNode = useUniverseStore((s) => s.registerNode);
	useFrame(({ clock }) => {
		const t = clock.getElapsedTime();
		if (core.current) {
			core.current.rotation.y = t * .08;
			const s = (active ? 1.12 : 1) + Math.sin(t * 1.4) * .015;
			core.current.scale.setScalar(s);
			if (isFocused) registerNode("sun", core.current.getWorldPosition(worldPosition.current));
		}
		if (halo.current) halo.current.scale.setScalar(1.5 + Math.sin(t * .9) * .05);
	});
	return /* @__PURE__ */ jsxs("group", { children: [
		/* @__PURE__ */ jsx("pointLight", {
			intensity: 2.2,
			distance: 40,
			decay: 2,
			color: "#ffd8a8"
		}),
		/* @__PURE__ */ jsxs("mesh", {
			ref: core,
			onClick: (e) => {
				e.stopPropagation();
				setFocus({
					kind: "sun",
					id: "sun"
				});
			},
			onPointerOver: (e) => {
				e.stopPropagation();
				setHovered("sun");
			},
			onPointerOut: () => setHovered(null),
			children: [/* @__PURE__ */ jsx("icosahedronGeometry", { args: [2.6, 6] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
				color: "#ffb257",
				emissive: "#ff9d3c",
				emissiveIntensity: active ? 3.2 : 2.2,
				roughness: .35
			})]
		}),
		/* @__PURE__ */ jsxs("mesh", {
			ref: halo,
			children: [/* @__PURE__ */ jsx("sphereGeometry", { args: [
				3.1,
				32,
				32
			] }), /* @__PURE__ */ jsx("meshBasicMaterial", {
				color: "#ffb257",
				transparent: true,
				opacity: .09,
				side: THREE.BackSide
			})]
		}),
		(active || isFocused) && /* @__PURE__ */ jsx(Html, {
			center: true,
			distanceFactor: 26,
			position: [
				0,
				4.6,
				0
			],
			style: { pointerEvents: "none" },
			children: /* @__PURE__ */ jsxs("div", {
				className: "pointer-events-none select-none whitespace-nowrap text-center",
				children: [/* @__PURE__ */ jsx("p", {
					className: "label-mono text-accent",
					children: "Identity Core"
				}), /* @__PURE__ */ jsx("p", {
					className: "font-display text-lg font-semibold text-starlight",
					children: identity.name
				})]
			})
		})
	] });
}
//#endregion
//#region src/components/celestial/PlanetSystem.tsx
var ORBIT_SEGMENTS = 180;
var MOON_SEGMENTS = 16;
var PLANET_SEGMENTS = 40;
var GLOW_SEGMENTS = 24;
function OrbitRing({ radius, color }) {
	const geometry = useMemo(() => {
		const pts = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0).getPoints(ORBIT_SEGMENTS).map((p) => new THREE.Vector3(p.x, 0, p.y));
		return new THREE.BufferGeometry().setFromPoints(pts);
	}, [radius]);
	return /* @__PURE__ */ jsxs("line", { children: [/* @__PURE__ */ jsx("primitive", {
		object: geometry,
		attach: "geometry"
	}), /* @__PURE__ */ jsx("lineBasicMaterial", {
		color,
		transparent: true,
		opacity: .18
	})] });
}
function Moon({ index, count, color, size }) {
	const ref = useRef(null);
	const position = useRef(new THREE.Vector3());
	const dist = size * 2.2 + index * size * .9;
	const speed = .8 + index * .25;
	const phase = index / count * Math.PI * 2;
	useFrame(({ clock }) => {
		const t = clock.getElapsedTime() * speed + phase;
		if (ref.current) {
			position.current.set(Math.cos(t) * dist, Math.sin(t * 1.4) * size * .5, Math.sin(t) * dist);
			ref.current.position.copy(position.current);
		}
	});
	return /* @__PURE__ */ jsxs("mesh", {
		ref,
		children: [/* @__PURE__ */ jsx("sphereGeometry", { args: [
			size * .22,
			MOON_SEGMENTS,
			MOON_SEGMENTS
		] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
			color,
			emissive: color,
			emissiveIntensity: .6,
			roughness: .5
		})]
	});
}
function PlanetBody({ planet }) {
	const group = useRef(null);
	const body = useRef(null);
	const worldPosition = useRef(new THREE.Vector3());
	const targetScale = useRef(new THREE.Vector3());
	const isHovered = useUniverseStore((s) => s.hovered === planet.id);
	const isFocused = useUniverseStore((s) => s.focus?.id === planet.id);
	const isActive = isHovered || isFocused;
	const setFocus = useUniverseStore((s) => s.setFocus);
	const setHovered = useUniverseStore((s) => s.setHovered);
	const registerNode = useUniverseStore((s) => s.registerNode);
	useFrame(({ clock }) => {
		const t = clock.getElapsedTime() * planet.speed + planet.offset;
		if (group.current) {
			group.current.position.set(Math.cos(t) * planet.radius, Math.sin(t * .6) * 1.2, Math.sin(t) * planet.radius);
			if (isFocused) registerNode(planet.id, group.current.getWorldPosition(worldPosition.current));
		}
		if (body.current) {
			body.current.rotation.y += .004;
			const target = isActive ? 1.35 : 1;
			targetScale.current.setScalar(target);
			body.current.scale.lerp(targetScale.current, .12);
		}
	});
	return /* @__PURE__ */ jsxs("group", {
		ref: group,
		children: [
			/* @__PURE__ */ jsxs("mesh", {
				ref: body,
				onClick: (e) => {
					e.stopPropagation();
					setFocus({
						kind: "planet",
						id: planet.id
					});
				},
				onPointerOver: (e) => {
					e.stopPropagation();
					setHovered(planet.id);
				},
				onPointerOut: () => setHovered(null),
				children: [/* @__PURE__ */ jsx("sphereGeometry", { args: [
					planet.size,
					PLANET_SEGMENTS,
					PLANET_SEGMENTS
				] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
					color: planet.color,
					emissive: planet.color,
					emissiveIntensity: isActive ? 1.5 : .45,
					roughness: .4,
					metalness: .25
				})]
			}),
			/* @__PURE__ */ jsxs("mesh", { children: [/* @__PURE__ */ jsx("sphereGeometry", { args: [
				planet.size * 1.5,
				GLOW_SEGMENTS,
				GLOW_SEGMENTS
			] }), /* @__PURE__ */ jsx("meshBasicMaterial", {
				color: planet.color,
				transparent: true,
				opacity: isActive ? .16 : .06,
				side: THREE.BackSide
			})] }),
			planet.moons.map((moon, i) => /* @__PURE__ */ jsx(Moon, {
				index: i,
				count: planet.moons.length,
				color: planet.color,
				size: planet.size
			}, moon.name)),
			isActive && /* @__PURE__ */ jsx(Html, {
				center: true,
				distanceFactor: 30,
				position: [
					0,
					planet.size + 1.4,
					0
				],
				style: { pointerEvents: "none" },
				children: /* @__PURE__ */ jsx("div", {
					className: "glass-panel pointer-events-none whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-starlight",
					children: planet.name
				})
			})
		]
	});
}
function PlanetSystem() {
	return /* @__PURE__ */ jsx("group", { children: planets.map((planet) => {
		const orbit = orbits.find((o) => o.id === planet.orbit);
		if (!orbit) return null;
		return /* @__PURE__ */ jsxs("group", { children: [/* @__PURE__ */ jsx(OrbitRing, {
			radius: planet.radius,
			color: orbit.color
		}), /* @__PURE__ */ jsx(PlanetBody, { planet })] }, planet.id);
	}) });
}
//#endregion
//#region src/components/celestial/Galaxies.tsx
var STAR_COUNT = 1400;
var DISC_RADIUS = 6;
var DISC_SEGMENTS = 3;
var WHITE = new THREE.Color("#ffffff");
function createGalaxyGeometry(color) {
	const positions = new Float32Array(STAR_COUNT * 3);
	const colors = new Float32Array(STAR_COUNT * 3);
	const base = new THREE.Color(color);
	for (let i = 0; i < STAR_COUNT; i++) {
		const arm = i % DISC_SEGMENTS;
		const dist = Math.pow(Math.random(), .6) * DISC_RADIUS;
		const angle = dist * .9 + arm / DISC_SEGMENTS * Math.PI * 2 + Math.random() * .25;
		positions[i * 3] = Math.cos(angle) * dist + (Math.random() - .5) * .4;
		positions[i * 3 + 1] = (Math.random() - .5) * (1.4 - dist * .15);
		positions[i * 3 + 2] = Math.sin(angle) * dist + (Math.random() - .5) * .4;
		const c = base.clone().lerp(WHITE, Math.max(0, 1 - dist / 5));
		colors[i * 3] = c.r;
		colors[i * 3 + 1] = c.g;
		colors[i * 3 + 2] = c.b;
	}
	const geo = new THREE.BufferGeometry();
	geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
	geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
	return geo;
}
function GalaxyDisc({ galaxy }) {
	const group = useRef(null);
	const disc = useRef(null);
	const worldPosition = useRef(new THREE.Vector3());
	const targetScale = useRef(new THREE.Vector3());
	const isHovered = useUniverseStore((s) => s.hovered === galaxy.id);
	const isFocused = useUniverseStore((s) => s.focus?.id === galaxy.id);
	const isActive = isHovered || isFocused;
	const setFocus = useUniverseStore((s) => s.setFocus);
	const setHovered = useUniverseStore((s) => s.setHovered);
	const registerNode = useUniverseStore((s) => s.registerNode);
	const geometry = useMemo(() => createGalaxyGeometry(galaxy.color), [galaxy.color]);
	useFrame((_, delta) => {
		if (disc.current) disc.current.rotation.y += delta * (isHovered ? .28 : .08);
		if (group.current) {
			const target = isActive ? 1.18 : 1;
			targetScale.current.setScalar(target);
			group.current.scale.lerp(targetScale.current, .1);
			if (isFocused) registerNode(galaxy.id, group.current.getWorldPosition(worldPosition.current));
		}
	});
	return /* @__PURE__ */ jsxs("group", {
		ref: group,
		position: galaxy.position,
		rotation: [
			.5,
			0,
			.25
		],
		children: [
			/* @__PURE__ */ jsx("points", {
				ref: disc,
				geometry,
				children: /* @__PURE__ */ jsx("pointsMaterial", {
					size: .16,
					sizeAttenuation: true,
					vertexColors: true,
					transparent: true,
					opacity: .95,
					depthWrite: false
				})
			}),
			/* @__PURE__ */ jsxs("mesh", {
				onClick: (e) => {
					e.stopPropagation();
					setFocus({
						kind: "galaxy",
						id: galaxy.id
					});
				},
				onPointerOver: (e) => {
					e.stopPropagation();
					setHovered(galaxy.id);
				},
				onPointerOut: () => setHovered(null),
				children: [/* @__PURE__ */ jsx("sphereGeometry", { args: [
					5.6,
					20,
					20
				] }), /* @__PURE__ */ jsx("meshBasicMaterial", {
					transparent: true,
					opacity: 0,
					depthWrite: false
				})]
			}),
			/* @__PURE__ */ jsxs("mesh", { children: [/* @__PURE__ */ jsx("sphereGeometry", { args: [
				1.1,
				24,
				24
			] }), /* @__PURE__ */ jsx("meshBasicMaterial", {
				color: galaxy.color,
				transparent: true,
				opacity: .35
			})] }),
			isActive && /* @__PURE__ */ jsx(Html, {
				center: true,
				distanceFactor: 44,
				position: [
					0,
					6.5,
					0
				],
				style: { pointerEvents: "none" },
				children: /* @__PURE__ */ jsxs("div", {
					className: "pointer-events-none select-none whitespace-nowrap text-center",
					children: [/* @__PURE__ */ jsx("p", {
						className: "label-mono",
						children: "Galaxy"
					}), /* @__PURE__ */ jsx("p", {
						className: "font-display text-base font-semibold text-starlight",
						children: galaxy.name
					})]
				})
			})
		]
	});
}
function Galaxies() {
	return /* @__PURE__ */ jsx("group", { children: galaxies.map((galaxy) => /* @__PURE__ */ jsx(GalaxyDisc, { galaxy }, galaxy.id)) });
}
//#endregion
//#region src/components/celestial/BlackHole.tsx
function BlackHole() {
	const group = useRef(null);
	const disc = useRef(null);
	const ring = useRef(null);
	const worldPosition = useRef(new THREE.Vector3());
	const active = useUniverseStore((s) => s.hovered === "blackhole" || s.focus?.id === "blackhole");
	const setFocus = useUniverseStore((s) => s.setFocus);
	const setHovered = useUniverseStore((s) => s.setHovered);
	const registerNode = useUniverseStore((s) => s.registerNode);
	const isFocused = useUniverseStore((s) => s.focus?.id === "blackhole");
	useFrame(({ clock }, delta) => {
		const t = clock.getElapsedTime();
		if (disc.current) disc.current.rotation.z += delta * (active ? 1.1 : .4);
		if (ring.current) {
			ring.current.rotation.z -= delta * .6;
			ring.current.scale.setScalar(1 + Math.sin(t * 1.6) * .03);
		}
		if (group.current && isFocused) registerNode("blackhole", group.current.getWorldPosition(worldPosition.current));
	});
	return /* @__PURE__ */ jsxs("group", {
		ref: group,
		position: blackHole.position,
		rotation: [
			.55,
			.3,
			0
		],
		children: [
			/* @__PURE__ */ jsxs("mesh", {
				onClick: (e) => {
					e.stopPropagation();
					setFocus({
						kind: "blackhole",
						id: "blackhole"
					});
				},
				onPointerOver: (e) => {
					e.stopPropagation();
					setHovered("blackhole");
				},
				onPointerOut: () => setHovered(null),
				children: [/* @__PURE__ */ jsx("sphereGeometry", { args: [
					3.2,
					48,
					48
				] }), /* @__PURE__ */ jsx("meshBasicMaterial", { color: "#03040a" })]
			}),
			/* @__PURE__ */ jsxs("mesh", {
				ref: disc,
				rotation: [
					Math.PI / 2.1,
					0,
					0
				],
				children: [/* @__PURE__ */ jsx("torusGeometry", { args: [
					5.2,
					.75,
					2,
					128
				] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
					color: "#8b5cf6",
					emissive: "#a78bfa",
					emissiveIntensity: active ? 3 : 1.6,
					roughness: .2
				})]
			}),
			/* @__PURE__ */ jsxs("mesh", {
				ref: ring,
				rotation: [
					Math.PI / 2.1,
					0,
					0
				],
				children: [/* @__PURE__ */ jsx("torusGeometry", { args: [
					7.4,
					.12,
					2,
					128
				] }), /* @__PURE__ */ jsx("meshBasicMaterial", {
					color: "#22d3ee",
					transparent: true,
					opacity: active ? .8 : .35
				})]
			}),
			/* @__PURE__ */ jsxs("mesh", { children: [/* @__PURE__ */ jsx("sphereGeometry", { args: [
				4.1,
				32,
				32
			] }), /* @__PURE__ */ jsx("meshBasicMaterial", {
				color: "#7c3aed",
				transparent: true,
				opacity: .12,
				side: THREE.BackSide
			})] }),
			active && /* @__PURE__ */ jsx(Html, {
				center: true,
				distanceFactor: 46,
				position: [
					0,
					9,
					0
				],
				style: { pointerEvents: "none" },
				children: /* @__PURE__ */ jsxs("div", {
					className: "pointer-events-none select-none whitespace-nowrap text-center",
					children: [/* @__PURE__ */ jsx("p", {
						className: "label-mono text-nebula",
						children: "Singularity"
					}), /* @__PURE__ */ jsx("p", {
						className: "font-display text-base font-semibold text-starlight",
						children: blackHole.title
					})]
				})
			})
		]
	});
}
//#endregion
//#region src/components/celestial/SpaceStation.tsx
function SpaceStation() {
	const group = useRef(null);
	const ring = useRef(null);
	const worldPosition = useRef(new THREE.Vector3());
	const active = useUniverseStore((s) => s.hovered === "station" || s.focus?.id === "station");
	const isFocused = useUniverseStore((s) => s.focus?.id === "station");
	const setFocus = useUniverseStore((s) => s.setFocus);
	const setHovered = useUniverseStore((s) => s.setHovered);
	const registerNode = useUniverseStore((s) => s.registerNode);
	useFrame((_, delta) => {
		if (ring.current) ring.current.rotation.z += delta * .5;
		if (group.current) {
			group.current.rotation.y += delta * .1;
			if (isFocused) registerNode("station", group.current.getWorldPosition(worldPosition.current));
		}
	});
	return /* @__PURE__ */ jsxs("group", {
		ref: group,
		position: contact.position,
		children: [/* @__PURE__ */ jsxs("group", {
			onClick: (e) => {
				e.stopPropagation();
				setFocus({
					kind: "station",
					id: "station"
				});
			},
			onPointerOver: (e) => {
				e.stopPropagation();
				setHovered("station");
			},
			onPointerOut: () => setHovered(null),
			children: [
				/* @__PURE__ */ jsxs("mesh", {
					ref: ring,
					rotation: [
						Math.PI / 2,
						0,
						0
					],
					children: [/* @__PURE__ */ jsx("torusGeometry", { args: [
						2.6,
						.24,
						12,
						64
					] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
						color: "#67e8f9",
						emissive: "#22d3ee",
						emissiveIntensity: active ? 2.4 : 1,
						metalness: .7,
						roughness: .25
					})]
				}),
				/* @__PURE__ */ jsxs("mesh", { children: [/* @__PURE__ */ jsx("capsuleGeometry", { args: [
					.5,
					2.4,
					8,
					20
				] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
					color: "#e2e8f0",
					metalness: .85,
					roughness: .3
				})] }),
				/* @__PURE__ */ jsxs("mesh", {
					position: [
						0,
						0,
						0
					],
					rotation: [
						0,
						0,
						Math.PI / 2
					],
					children: [/* @__PURE__ */ jsx("boxGeometry", { args: [
						.14,
						5.6,
						.9
					] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
						color: "#334155",
						metalness: .6,
						roughness: .4,
						emissive: "#0ea5e9",
						emissiveIntensity: .35
					})]
				})
			]
		}), active && /* @__PURE__ */ jsx(Html, {
			center: true,
			distanceFactor: 36,
			position: [
				0,
				4.2,
				0
			],
			style: { pointerEvents: "none" },
			children: /* @__PURE__ */ jsxs("div", {
				className: "pointer-events-none select-none whitespace-nowrap text-center",
				children: [/* @__PURE__ */ jsx("p", {
					className: "label-mono text-primary",
					children: "Uplink"
				}), /* @__PURE__ */ jsx("p", {
					className: "font-display text-base font-semibold text-starlight",
					children: contact.title
				})]
			})
		})]
	});
}
//#endregion
//#region src/components/celestial/Constellation.tsx
var POINT_SPACING = 13;
var POINT_Y_AMPLITUDE = 5;
var POINT_Z_OFFSET = 4;
var START_X = -26;
var START_Z = -30;
var points = timeline.map((_, i) => new THREE.Vector3(START_X + i * POINT_SPACING, 26 + Math.sin(i * 1.4) * POINT_Y_AMPLITUDE, START_Z + i * POINT_Z_OFFSET));
function Constellation() {
	const group = useRef(null);
	const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), []);
	useFrame(({ clock }) => {
		if (group.current) group.current.position.y = Math.sin(clock.getElapsedTime() * .3) * .6;
	});
	return /* @__PURE__ */ jsxs("group", {
		ref: group,
		children: [/* @__PURE__ */ jsxs("line", { children: [/* @__PURE__ */ jsx("primitive", {
			object: lineGeometry,
			attach: "geometry"
		}), /* @__PURE__ */ jsx("lineBasicMaterial", {
			color: "#67e8f9",
			transparent: true,
			opacity: .35
		})] }), timeline.map((entry, i) => {
			const point = points[i];
			if (!point) return null;
			return /* @__PURE__ */ jsxs("group", {
				position: point,
				children: [/* @__PURE__ */ jsxs("mesh", { children: [/* @__PURE__ */ jsx("sphereGeometry", { args: [
					.42,
					20,
					20
				] }), /* @__PURE__ */ jsx("meshStandardMaterial", {
					color: "#e0f2fe",
					emissive: "#67e8f9",
					emissiveIntensity: 1.8
				})] }), /* @__PURE__ */ jsx(Html, {
					center: true,
					distanceFactor: 48,
					position: [
						0,
						2,
						0
					],
					style: { pointerEvents: "none" },
					children: /* @__PURE__ */ jsxs("div", {
						className: "pointer-events-none w-40 select-none text-center",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "label-mono text-primary",
								children: entry.year
							}),
							/* @__PURE__ */ jsx("p", {
								className: "font-display text-sm font-semibold text-starlight",
								children: entry.title
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-[11px] leading-snug text-muted-foreground",
								children: entry.body
							})
						]
					})
				})]
			}, `${entry.year}-${i}`);
		})]
	});
}
//#endregion
//#region src/constants/universe.ts
var CAMERA_NEAR = .1;
var CAMERA_POSITION = new THREE.Vector3(0, 22, 62);
var DPR_MAX = 1.75;
var DAMPING_FACTOR = .06;
var ROTATE_SPEED = .5;
var ZOOM_SPEED = .8;
var PAN_SPEED = .6;
var BACKGROUND_COLOR = "#050512";
var FOG_COLOR = "#050512";
var AMBIENT_LIGHT_INTENSITY = .35;
var HEMISPHERE_LIGHT_INTENSITY = .25;
var HEMISPHERE_LIGHT_COLOR = "#67e8f9";
var HEMISPHERE_LIGHT_GROUND_COLOR = "#1e1b4b";
//#endregion
//#region src/components/universe/UniverseCanvas.tsx
function UniverseCanvas() {
	const controls = useRef(null);
	const { clearFocus, autoOrbit } = useUniverse();
	return /* @__PURE__ */ jsxs(Canvas, {
		dpr: [1, DPR_MAX],
		gl: {
			antialias: true,
			powerPreference: "high-performance"
		},
		camera: {
			position: CAMERA_POSITION.toArray(),
			fov: 55,
			near: CAMERA_NEAR,
			far: 600
		},
		onPointerMissed: () => clearFocus(),
		children: [
			/* @__PURE__ */ jsx("color", {
				attach: "background",
				args: [BACKGROUND_COLOR]
			}),
			/* @__PURE__ */ jsx("fog", {
				attach: "fog",
				args: [
					FOG_COLOR,
					90,
					260
				]
			}),
			/* @__PURE__ */ jsx("ambientLight", { intensity: AMBIENT_LIGHT_INTENSITY }),
			/* @__PURE__ */ jsx("hemisphereLight", {
				intensity: HEMISPHERE_LIGHT_INTENSITY,
				color: HEMISPHERE_LIGHT_COLOR,
				groundColor: HEMISPHERE_LIGHT_GROUND_COLOR
			}),
			/* @__PURE__ */ jsxs(Suspense, {
				fallback: null,
				children: [
					/* @__PURE__ */ jsx(Starfield, {}),
					/* @__PURE__ */ jsx(Sun, {}),
					/* @__PURE__ */ jsx(PlanetSystem, {}),
					/* @__PURE__ */ jsx(Galaxies, {}),
					/* @__PURE__ */ jsx(BlackHole, {}),
					/* @__PURE__ */ jsx(SpaceStation, {}),
					/* @__PURE__ */ jsx(Constellation, {}),
					/* @__PURE__ */ jsx(Preload, { all: true })
				]
			}),
			/* @__PURE__ */ jsx(CameraRig, { controls }),
			/* @__PURE__ */ jsx(OrbitControls, {
				ref: controls,
				makeDefault: true,
				enablePan: !autoOrbit,
				screenSpacePanning: true,
				enableDamping: true,
				dampingFactor: DAMPING_FACTOR,
				rotateSpeed: ROTATE_SPEED,
				zoomSpeed: ZOOM_SPEED,
				panSpeed: PAN_SPEED,
				minDistance: 4,
				maxDistance: 220
			}),
			/* @__PURE__ */ jsx(AdaptiveDpr, { pixelated: true })
		]
	});
}
//#endregion
export { UniverseCanvas as default };
