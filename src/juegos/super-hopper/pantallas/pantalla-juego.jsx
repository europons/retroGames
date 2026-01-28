import * as THREE from "three";
import { useEffect, useRef } from "react";

const CONFIG = {
	laneWidth: 2.5,
	cameraOffset: { x: 0, y: 7, z: 10 },
	gravity: 0.015,
	jumpPower: 0.35,
	baseSpeed: 0.05,
	speedInc: 0.00004,
	rowSpacing: 12
};

const THEMES = [
	{ name: "Candy", sky: 0xffd1dc, ground: 0xfff0f5, obstacle: 0xff6b6b, decor: 0x98fb98 },
	{ name: "Neon", sky: 0x1a1a2e, ground: 0x16213e, obstacle: 0xe94560, decor: 0x0f3460 },
	{ name: "Sunset", sky: 0xff9a8b, ground: 0xff6a88, obstacle: 0x2c3e50, decor: 0xf9ca24 },
	{ name: "Mint", sky: 0xe0f7fa, ground: 0xffffff, obstacle: 0x009688, decor: 0x80cbc4 },
	{ name: "Midnight", sky: 0x000000, ground: 0x222222, obstacle: 0xffff00, decor: 0x444444 }
];

export default function PantallaJuego(props) {
	const containerRef = useRef(null);
	const scoreRef = useRef(null);

	const sceneRef = useRef(null);
	const cameraRef = useRef(null);
	const rendererRef = useRef(null);
	const playerRef = useRef(null);

	const worldObjectsRef = useRef([]);
	const nextSpawnZRef = useRef(-20);
	const worldZRef = useRef(0);
	const animationIdRef = useRef(null);

	const stateRef = useRef({
		isPlaying: false,
		score: 0,
		speed: CONFIG.baseSpeed,
		lane: 0,
		currentLaneX: 0,
		isJumping: false,
		jumpVel: 0,
		playerY: 0,
		theme: null
	});

	useEffect(() => {
		if (!containerRef.current) return;

		sceneRef.current = new THREE.Scene();

		cameraRef.current = new THREE.PerspectiveCamera(
			60,
			containerRef.current.clientWidth / containerRef.current.clientHeight,
			0.1,
			100
		);
		cameraRef.current.position.set(
			CONFIG.cameraOffset.x,
			CONFIG.cameraOffset.y,
			CONFIG.cameraOffset.z
		);
		cameraRef.current.lookAt(0, 0, -5);

		rendererRef.current = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		rendererRef.current.setSize(
			containerRef.current.clientWidth,
			containerRef.current.clientHeight
		);
		rendererRef.current.shadowMap.enabled = true;
		rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap;
		containerRef.current.appendChild(rendererRef.current.domElement);

		sceneRef.current.add(new THREE.AmbientLight(0xffffff, 0.6));
		const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
		dirLight.position.set(10, 20, 10);
		dirLight.castShadow = true;
		sceneRef.current.add(dirLight);

		const onResize = () => {
			if (!containerRef.current) return;
			cameraRef.current.aspect =
				containerRef.current.clientWidth / containerRef.current.clientHeight;
			cameraRef.current.updateProjectionMatrix();
			rendererRef.current.setSize(
				containerRef.current.clientWidth,
				containerRef.current.clientHeight
			);
		};

		const handleInput = (e) => {
			if (!stateRef.current.isPlaying) return;

			if (e.code === "ArrowLeft") {
				if (stateRef.current.lane > -1) stateRef.current.lane--;
			} else if (e.code === "ArrowRight") {
				if (stateRef.current.lane < 1) stateRef.current.lane++;
			} else if (e.code === "ArrowUp") {
				if (!stateRef.current.isJumping) {
					stateRef.current.isJumping = true;
					stateRef.current.jumpVel = CONFIG.jumpPower;
				}
			}
		};

		const onKeyDown = (e) => {
			if (e.code === "ArrowLeft" || e.code === "ArrowRight" || e.code === "ArrowUp") {
				e.preventDefault();
			}
			handleInput(e);
		};

		window.addEventListener("resize", onResize);
		window.addEventListener("keydown", onKeyDown);

		function randomTheme() {
			return THEMES[Math.floor(Math.random() * THEMES.length)];
		}

		function createPlayer() {
			if (playerRef.current) sceneRef.current.remove(playerRef.current);

			const group = new THREE.Group();
			const animalColors = [0xffffff, 0xaaaaaa, 0xffcc99, 0x333333];
			const color = animalColors[Math.floor(Math.random() * animalColors.length)];
			const mat = new THREE.MeshStandardMaterial({ color: color, flatShading: true });

			const body = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);
			body.position.y = 0.5;
			body.castShadow = true;
			group.add(body);

			const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
			const eyeGeo = new THREE.BoxGeometry(0.15, 0.15, 0.05);
			const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
			leftEye.position.set(-0.25, 0.6, 0.5);
			const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
			rightEye.position.set(0.25, 0.6, 0.5);
			group.add(leftEye);
			group.add(rightEye);

			const earType = Math.floor(Math.random() * 3);
			const earGeo =
				earType === 0
					? new THREE.BoxGeometry(0.2, 0.5, 0.2)
					: earType === 1
					? new THREE.BoxGeometry(0.3, 0.3, 0.1)
					: new THREE.ConeGeometry(0.2, 0.4, 4);

			const leftEar = new THREE.Mesh(earGeo, mat);
			leftEar.position.set(-0.3, 1.1, 0);
			if (earType !== 2) leftEar.castShadow = true;
			const rightEar = new THREE.Mesh(earGeo, mat);
			rightEar.position.set(0.3, 1.1, 0);
			if (earType !== 2) rightEar.castShadow = true;
			group.add(leftEar);
			group.add(rightEar);

			sceneRef.current.add(group);
			playerRef.current = group;
			return group;
		}

		function createObstacleMesh() {
			const type = Math.floor(Math.random() * 3);
			const geo =
				type === 0
					? new THREE.ConeGeometry(0.5, 1, 6)
					: type === 1
					? new THREE.BoxGeometry(1, 1, 1)
					: new THREE.CylinderGeometry(0.5, 0.5, 1, 6);
			const mat = new THREE.MeshStandardMaterial({
				color: stateRef.current.theme.obstacle,
				flatShading: true
			});
			const mesh = new THREE.Mesh(geo, mat);
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			return mesh;
		}

		function createDecorationMesh() {
			const group = new THREE.Group();
			const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, flatShading: true });
			const trunk = new THREE.Mesh(
				new THREE.CylinderGeometry(0.2, 0.3, 1.5, 5),
				trunkMat
			);
			trunk.position.y = 0.75;
			trunk.castShadow = true;
			group.add(trunk);

			const leavesMat = new THREE.MeshStandardMaterial({
				color: stateRef.current.theme.decor,
				flatShading: true
			});
			const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8), leavesMat);
			leaves.position.y = 1.8;
			leaves.castShadow = true;
			group.add(leaves);
			return group;
		}

		function spawnRow() {
			const zStart = nextSpawnZRef.current;
			nextSpawnZRef.current -= CONFIG.rowSpacing;

			if (Math.random() > 0.3) {
				const dL = createDecorationMesh();
				dL.position.set(-5 - Math.random() * 5, 0, zStart);
				sceneRef.current.add(dL);
				worldObjectsRef.current.push({ mesh: dL, type: "decor", baseZ: zStart });
			}

			if (Math.random() > 0.3) {
				const dR = createDecorationMesh();
				dR.position.set(5 + Math.random() * 5, 0, zStart);
				sceneRef.current.add(dR);
				worldObjectsRef.current.push({ mesh: dR, type: "decor", baseZ: zStart });
			}

			const lane = Math.floor(Math.random() * 3) - 1;
			const obs = createObstacleMesh();
			obs.position.set(lane * CONFIG.laneWidth, 0.5, zStart);
			sceneRef.current.add(obs);
			worldObjectsRef.current.push({
				mesh: obs,
				type: "obstacle",
				lane: lane,
				passed: false,
				baseZ: zStart
			});
		}

		function gameOver() {
			stateRef.current.isPlaying = false;
			if (props.gameOver) {
				props.gameOver(Math.floor(stateRef.current.score));
			}
		}

		function animate() {
			// SIEMPRE llamar a requestAnimationFrame primero
			animationIdRef.current = requestAnimationFrame(animate);

			// Solo hacer cálculos si el juego está activo
			if (stateRef.current.isPlaying && playerRef.current) {
				stateRef.current.score += stateRef.current.speed;
				stateRef.current.speed += CONFIG.speedInc;
				if (scoreRef.current) {
					scoreRef.current.textContent = Math.floor(stateRef.current.score);
				}

				const targetX = stateRef.current.lane * CONFIG.laneWidth;
				stateRef.current.currentLaneX += (targetX - stateRef.current.currentLaneX) * 0.15;
				playerRef.current.position.x = stateRef.current.currentLaneX;

				if (stateRef.current.isJumping) {
					stateRef.current.playerY += stateRef.current.jumpVel;
					stateRef.current.jumpVel -= CONFIG.gravity;
					if (stateRef.current.playerY <= 0) {
						stateRef.current.playerY = 0;
						stateRef.current.isJumping = false;
					}
				} else {
					stateRef.current.playerY = Math.abs(Math.sin(Date.now() * 0.015)) * 0.1;
				}
				playerRef.current.position.y = stateRef.current.playerY + 0.5;

				worldZRef.current += stateRef.current.speed * 2;
				for (let i = worldObjectsRef.current.length - 1; i >= 0; i--) {
					const obj = worldObjectsRef.current[i];
					obj.mesh.position.z = obj.baseZ + worldZRef.current;

					if (obj.type === "obstacle") {
						if (obj.mesh.position.z > -0.8 && obj.mesh.position.z < 0.8) {
							const dx = Math.abs(playerRef.current.position.x - obj.mesh.position.x);
							const dy = Math.abs(playerRef.current.position.y - obj.mesh.position.y);
							if (dx < 0.8 && dy < 0.8) {
								gameOver();
							}
						}
					}

					if (obj.mesh.position.z > 10) {
						sceneRef.current.remove(obj.mesh);
						worldObjectsRef.current.splice(i, 1);
					}
				}

				if (worldObjectsRef.current.length < 20) {
					spawnRow();
				}
			}

			// CRÍTICO: SIEMPRE renderizar, incluso si el juego no está activo
			if (rendererRef.current && sceneRef.current && cameraRef.current) {
				rendererRef.current.render(sceneRef.current, cameraRef.current);
			}
		}

		function startGame() {
			if (stateRef.current.isPlaying && animationIdRef.current) return;

			stateRef.current.isPlaying = true;
			stateRef.current.score = 0;
			stateRef.current.speed = CONFIG.baseSpeed;
			stateRef.current.lane = 0;
			stateRef.current.currentLaneX = 0;
			stateRef.current.isJumping = false;
			stateRef.current.jumpVel = 0;
			stateRef.current.playerY = 0;
			stateRef.current.theme = randomTheme();

			sceneRef.current.background = new THREE.Color(stateRef.current.theme.sky);

			worldObjectsRef.current.forEach((obj) => sceneRef.current.remove(obj.mesh));
			worldObjectsRef.current = [];
			nextSpawnZRef.current = -20;
			worldZRef.current = 0;

			const plane = new THREE.Mesh(
				new THREE.PlaneGeometry(100, 200),
				new THREE.MeshStandardMaterial({
					color: stateRef.current.theme.ground,
					roughness: 1,
					flatShading: true
				})
			);
			plane.rotation.x = -Math.PI / 2;
			plane.position.z = -50;
			plane.receiveShadow = true;
			sceneRef.current.add(plane);

			const grid = new THREE.GridHelper(200, 100, 0xffffff, 0xffffff);
			grid.position.y = 0.01;
			grid.position.z = -50;
			grid.material.opacity = 0.1;
			grid.material.transparent = true;
			sceneRef.current.add(grid);

			createPlayer();
			playerRef.current.position.set(0, 0, 0);

			for (let i = 0; i < 6; i++) {
				spawnRow();
			}

			animate();
		}

		startGame();

		return () => {
			window.removeEventListener("resize", onResize);
			window.removeEventListener("keydown", onKeyDown);

			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current);
				animationIdRef.current = null;
			}
			stateRef.current.isPlaying = false;

			if (rendererRef.current?.domElement && containerRef.current) {
				containerRef.current.removeChild(rendererRef.current.domElement);
			}
			rendererRef.current?.dispose();
		};
	}, [props]);

	return (
		<div id="game-screen">
			<div id="ui-layer">
				<div id="score-display">
					SCORE: <span id="score" ref={scoreRef}>{props.score || 0}</span>
				</div>
			</div>
			<div id="game-container" ref={containerRef}></div>
		</div>
	);
}