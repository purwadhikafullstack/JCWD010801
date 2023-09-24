import React, { useEffect, useRef } from "react";

export const Orb = () => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const MAX = 50;
		let canvas, ctx;
		let count = 0;
		var points = [];

		var initializeCanvas = () => {
			canvas = canvasRef.current;
			ctx = canvas.getContext("2d");
			canvas.width = canvas.height = 400;
			ctx.fillRect(0, 0, 400, 400);

			let r = 0;
			for (let i = 0; i < MAX; i++) {
				points.push([Math.cos(r), Math.sin(r), 0]);
				r += (Math.PI * 2) / MAX;
			}

			for (let i = 0; i < MAX; i++) {
				points.push([0, points[i][0], points[i][1]]);
			}

			for (let i = 0; i < MAX; i++) {
				points.push([points[i][1], 0, points[i][0]]);
			}

			orb();
		};

		var orb = () => {
			ctx.globalCompositeOperation = "source-over";
			ctx.fillStyle = "rgba(0,0,0,0.03)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.globalCompositeOperation = "lighter";

			let tim = count / 5;

			for (let e = 0; e < 3; e++) {
				tim *= 1.7;
				var s = 1 - e / 3;
				let angle = tim / 59;
				var yp = Math.cos(angle);
				var yp2 = Math.sin(angle);
				angle = tim / 23;
				var xp = Math.cos(angle);
				var xp2 = Math.sin(angle);
				var p2 = [];

				for (let i = 0; i < points.length; i++) {
					var x = points[i][0];
					var y = points[i][1];
					let z = points[i][2];

					var y1 = y * yp + z * yp2;
					var z1 = y * yp2 - z * yp;
					var x1 = x * xp + z1 * xp2;

					z = x * xp2 - z1 * xp;
					z1 = Math.pow(2, z * s);
					var xTransformed = x1 * z1;
					var yTransformed = y1 * z1;
					p2.push([xTransformed, yTransformed, z]);
				}

				var scaleFactor = s * 120;
				for (let d = 0; d < 3; d++) {
					for (let i = 0; i < MAX; i++) {
						var b = p2[d * MAX + i];
						var c = p2[((i + 1) % MAX) + d * MAX];
						ctx.beginPath();
						ctx.strokeStyle = "hsla(" + (((i / MAX) * 360) | 0) + ",70%,60%,0.15)";
						ctx.lineWidth = Math.pow(6, b[2]);
						ctx.lineTo(b[0] * scaleFactor + 200, b[1] * scaleFactor + 200);
						ctx.lineTo(c[0] * scaleFactor + 200, c[1] * scaleFactor + 200);
						ctx.stroke();
					}
				}
			}
			count++;
			requestAnimationFrame(orb);
		};

		initializeCanvas();

		return () => {};
	}, []);

	return <canvas ref={canvasRef} />;
};