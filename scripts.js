const mobileConfig = {
	sizeRange: [0.8, 2.3],
	speedRange: [0.1, 0.4],
	opacityRange: [0.1, 0.4],
	particleCount: 100
};

const desktopConfig = {
	sizeRange: [1, 3],
	speedRange: [0.2, 0.6],
	opacityRange: [0.1, 0.4],
	particleCount: 200
};

function onMount(callback) {
	document.addEventListener('DOMContentLoaded', callback);
}

onMount(function () {
	const isMobile = window.innerWidth <= 768;
	const particleConfig = isMobile ? mobileConfig : desktopConfig;

	const canvas = document.getElementById('particlesCanvas');
	const ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	let particlesArray = [];

	function Particle(x, y, size, speed, directionAngle, finalOpacity) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.speed = speed;
		this.directionX = Math.cos(directionAngle) * speed;
		this.directionY = Math.sin(directionAngle) * speed;
		this.finalOpacity = finalOpacity;
		this.opacity = 0;

		this.update = function () {
			this.x += this.directionX;
			this.y += this.directionY;
			this.fadeIn();
		};

		this.fadeIn = function () {
			if (this.opacity < this.finalOpacity) {
				this.opacity += 0.005;
			}
		};

		this.draw = function () {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
			ctx.fill();
		};
	}

	function init() {
		particlesArray = [];
		for (let i = 0; i < particleConfig.particleCount; i++) {
			let x = Math.random() * canvas.width;
			let y = Math.random() * canvas.height;
			let size = Math.random() * (particleConfig.sizeRange[1] - particleConfig.sizeRange[0]) + particleConfig.sizeRange[0];
			let speed = Math.random() * (particleConfig.speedRange[1] - particleConfig.speedRange[0]) + particleConfig.speedRange[0];
			let directionAngle = Math.floor(Math.random() * 360);
			let opacity = Math.random() * (particleConfig.opacityRange[1] - particleConfig.opacityRange[0]) + particleConfig.opacityRange[0];
			particlesArray.push(new Particle(x, y, size, speed, directionAngle, opacity));
		}
	}

	init();

	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (let i = 0; i < particlesArray.length; i++) {
			particlesArray[i].update();
			particlesArray[i].draw();
		}
		requestAnimationFrame(animate);
	}

	// Get the query parameters from the current URL
	const params = new URLSearchParams(window.location.search);

	// If the particles off query parameter is set to 1, don't run animate()
	if (params.get('particles') !== 'off') {
		setTimeout(() => {
			animate();
		}, 5000);
	}
});
