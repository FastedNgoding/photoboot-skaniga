import { useState, useRef, useEffect, useCallback } from "react";
import QRCode from "qrcode";
import { ArrowInDownSquareHalf, Copy, Home } from "@boxicons/react";

import astronotImg1 from "../assets/astronot1.png";
import astronotImg2 from "../assets/astronot2.png";
import planetImg from "../assets/planet.png";

import hkImg1 from "../assets/hk1.png";
import hkImg2 from "../assets/hk2.png";
import hkImg3 from "../assets/hk3.png";

import swImg1 from "../assets/sw1.png";
import swImg2 from "../assets/sw2.png";
import swImg3 from "../assets/sw3.png";

import lImg1 from "../assets/l1.png";
import lImg2 from "../assets/l2.png";
import lImg3 from "../assets/l3.png";

import dbImg1 from "../assets/db1.png";
import dbImg2 from "../assets/db2.png";
import dbImg3 from "../assets/db3.png";

import opImg1 from "../assets/op1.png";
import opImg2 from "../assets/op2.png";
import opImg3 from "../assets/op3.png";

import saImg1 from "../assets/sa1.png";
import saImg2 from "../assets/sa2.png";
import saImg3 from "../assets/sa3.png";

import omImg1 from "../assets/om1.png";
import omImg2 from "../assets/om2.png";
import omImg3 from "../assets/om3.png";


const IMGBB_API_KEY = "ab03a93ae55127be2fc02960dfde7834";
const CLOUDINARY_CLOUD = "dlb2wugmt";
const CLOUDINARY_PRESET = "photobooth_skaniga";

const W = 600;
const PH = 320;
const GAP = 18;
const PAD = 36;
const FH = 130;
const H = PAD + (PH + GAP) * 3 - GAP + PAD + FH;

function extractColors(gradStr) {
  const m = gradStr.match(/#[a-fA-F0-9]{6}/g) || ["#333333", "#666666"];
  return [m[0], m[m.length - 1]];
}

function loadStaticImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawStar(c, cx, cy, sp, or, ir, col) {
  let r = (Math.PI / 2) * 3,
    x,
    y,
    st = Math.PI / sp;
  c.beginPath();
  c.moveTo(cx, cy - or);
  for (let i = 0; i < sp; i++) {
    x = cx + Math.cos(r) * or;
    y = cy + Math.sin(r) * or;
    c.lineTo(x, y);
    r += st;
    x = cx + Math.cos(r) * ir;
    y = cy + Math.sin(r) * ir;
    c.lineTo(x, y);
    r += st;
  }
  c.lineTo(cx, cy - or);
  c.closePath();
  c.fillStyle = col;
  c.fill();
}

function drawPlanet(c, x, y, r, col, rc) {
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fillStyle = col;
  c.fill();
  c.strokeStyle = rc;
  c.lineWidth = 2;
  c.beginPath();
  c.ellipse(x, y, r * 1.8, r * 0.4, Math.PI / 6, 0, Math.PI * 2);
  c.stroke();
}


function drawBow(c, x, y, s, col) {
  c.fillStyle = col;
  c.beginPath();
  c.ellipse(x - s * 0.6, y, s * 0.5, s * 0.3, -0.3, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.ellipse(x + s * 0.6, y, s * 0.5, s * 0.3, 0.3, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.arc(x, y, s * 0.25, 0, Math.PI * 2);
  c.fill();
}

function drawHeart(c, x, y, s, col) {
  c.fillStyle = col;
  c.beginPath();
  c.moveTo(x, y + s * 0.3);
  c.bezierCurveTo(x, y, x - s * 0.5, y - s * 0.3, x - s * 0.5, y - s * 0.6);
  c.bezierCurveTo(x - s * 0.5, y - s * 1.1, x, y - s * 1.1, x, y - s * 0.7);
  c.bezierCurveTo(
    x,
    y - s * 1.1,
    x + s * 0.5,
    y - s * 1.1,
    x + s * 0.5,
    y - s * 0.6,
  );
  c.bezierCurveTo(x + s * 0.5, y - s * 0.3, x, y, x, y + s * 0.3);
  c.fill();
}

function drawStrawberry(c, x, y, s, col) {
  c.fillStyle = col;
  c.beginPath();
  c.moveTo(x, y - s);
  c.bezierCurveTo(
    x + s * 0.8,
    y - s * 0.5,
    x + s * 0.8,
    y + s * 0.5,
    x,
    y + s * 0.8,
  );
  c.bezierCurveTo(x - s * 0.8, y + s * 0.5, x - s * 0.8, y - s * 0.5, x, y - s);
  c.fill();
  c.fillStyle = "#2d5016";
  c.beginPath();
  c.moveTo(x, y - s);
  c.lineTo(x - s * 0.3, y - s * 1.3);
  c.lineTo(x - s * 0.1, y - s * 1.1);
  c.lineTo(x, y - s * 1.4);
  c.lineTo(x + s * 0.1, y - s * 1.1);
  c.lineTo(x + s * 0.3, y - s * 1.3);
  c.closePath();
  c.fill();
  c.fillStyle = "#fff8";
  c.beginPath();
  c.arc(x - s * 0.2, y - s * 0.2, s * 0.08, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.arc(x + s * 0.15, y + s * 0.1, s * 0.06, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.arc(x - s * 0.1, y + s * 0.3, s * 0.05, 0, Math.PI * 2);
  c.fill();
}

function drawPaw(c, x, y, s, col) {
  c.fillStyle = col;
  c.beginPath();
  c.ellipse(x, y + s * 0.3, s * 0.35, s * 0.45, 0, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.ellipse(x - s * 0.4, y - s * 0.1, s * 0.18, s * 0.22, -0.4, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.ellipse(x + s * 0.4, y - s * 0.1, s * 0.18, s * 0.22, 0.4, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.ellipse(
    x - s * 0.15,
    y - s * 0.35,
    s * 0.16,
    s * 0.2,
    -0.2,
    0,
    Math.PI * 2,
  );
  c.fill();
  c.beginPath();
  c.ellipse(x + s * 0.15, y - s * 0.35, s * 0.16, s * 0.2, 0.2, 0, Math.PI * 2);
  c.fill();
}

function drawLightsaber(c, x, y, l, col, a) {
  c.save();
  c.translate(x, y);
  c.rotate(a);
  c.shadowBlur = 15;
  c.shadowColor = col;
  c.fillStyle = col;
  c.fillRect(-3, -l, 6, l);
  c.shadowBlur = 0;
  c.fillStyle = "#888";
  c.fillRect(-4, 0, 8, 18);
  c.fillStyle = "#666";
  c.fillRect(-5, 18, 10, 4);
  c.restore();
}

function drawTie(c, x, y, s, col) {
  c.fillStyle = col;
  c.beginPath();
  c.moveTo(x, y - s);
  c.lineTo(x + s * 0.3, y);
  c.lineTo(x, y + s);
  c.lineTo(x - s * 0.3, y);
  c.closePath();
  c.fill();
  c.fillStyle = "#333";
  c.fillRect(x - s * 1.2, y - s * 0.8, s * 0.3, s * 1.6);
  c.fillRect(x + s * 0.9, y - s * 0.8, s * 0.3, s * 1.6);
  c.strokeStyle = col;
  c.lineWidth = 1.5;
  c.beginPath();
  c.moveTo(x - s * 1.05, y - s * 0.5);
  c.lineTo(x - s * 0.3, y - s * 0.2);
  c.stroke();
  c.beginPath();
  c.moveTo(x - s * 1.05, y + s * 0.5);
  c.lineTo(x - s * 0.3, y + s * 0.2);
  c.stroke();
  c.beginPath();
  c.moveTo(x + s * 1.05, y - s * 0.5);
  c.lineTo(x + s * 0.3, y - s * 0.2);
  c.stroke();
  c.beginPath();
  c.moveTo(x + s * 1.05, y + s * 0.5);
  c.lineTo(x + s * 0.3, y + s * 0.2);
  c.stroke();
}

function drawDragonBallOrb(c, x, y, r, col, count) {
  c.fillStyle = col;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#ffffff44";
  c.beginPath();
  c.arc(x - r * 0.25, y - r * 0.25, r * 0.3, 0, Math.PI * 2);
  c.fill();
  const positions = [
    [0, 0],
    [-0.3, -0.2], [0.3, -0.2],
    [-0.15, 0.25], [0.15, 0.25],
    [-0.3, 0.1], [0.3, 0.1],
  ];
  for (let i = 0; i < Math.min(count, 7); i++) {
    drawStar(c, x + positions[i][0] * r, y + positions[i][1] * r, 5, r * 0.15, r * 0.07, "#cc0000");
  }
}

function drawAnchor(c, x, y, s, col) {
  c.strokeStyle = col;
  c.lineWidth = 2.5;
  c.lineCap = "round";
  c.beginPath();
  c.arc(x, y - s * 0.6, s * 0.25, 0, Math.PI * 2);
  c.stroke();
  c.beginPath();
  c.moveTo(x, y - s * 0.35);
  c.lineTo(x, y + s * 0.6);
  c.stroke();
  c.beginPath();
  c.moveTo(x - s * 0.5, y + s * 0.3);
  c.quadraticCurveTo(x - s * 0.5, y + s * 0.7, x, y + s * 0.6);
  c.stroke();
  c.beginPath();
  c.moveTo(x + s * 0.5, y + s * 0.3);
  c.quadraticCurveTo(x + s * 0.5, y + s * 0.7, x, y + s * 0.6);
  c.stroke();
  c.beginPath();
  c.moveTo(x - s * 0.35, y - s * 0.1);
  c.lineTo(x + s * 0.35, y - s * 0.1);
  c.stroke();
}

function drawCherryBlossom(c, x, y, s, col) {
  c.fillStyle = col;
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
    const px = x + Math.cos(angle) * s * 0.5;
    const py = y + Math.sin(angle) * s * 0.5;
    c.beginPath();
    c.ellipse(px, py, s * 0.35, s * 0.25, angle, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = "#fff176";
  c.beginPath();
  c.arc(x, y, s * 0.15, 0, Math.PI * 2);
  c.fill();
}

function drawPixelHeart(c, x, y, s, col) {
  c.fillStyle = col;
  const pattern = [
    [0,1,0,0,0,1,0],
    [1,1,1,0,1,1,1],
    [1,1,1,1,1,1,1],
    [0,1,1,1,1,1,0],
    [0,0,1,1,1,0,0],
    [0,0,0,1,0,0,0],
  ];
  const ps = s / 7;
  const ox = x - (7 * ps) / 2;
  const oy = y - (6 * ps) / 2;
  pattern.forEach((row, ry) => {
    row.forEach((val, rx) => {
      if (val) c.fillRect(ox + rx * ps, oy + ry * ps, ps, ps);
    });
  });
}

function drawPixelStar(c, x, y, s, col) {
  c.fillStyle = col;
  const pattern = [
    [0,0,0,1,0,0,0],
    [0,0,1,1,1,0,0],
    [1,1,1,1,1,1,1],
    [0,1,1,1,1,1,0],
    [0,1,0,1,0,1,0],
    [1,0,0,0,0,0,1],
  ];
  const ps = s / 7;
  const ox = x - (7 * ps) / 2;
  const oy = y - (6 * ps) / 2;
  pattern.forEach((row, ry) => {
    row.forEach((val, rx) => {
      if (val) c.fillRect(ox + rx * ps, oy + ry * ps, ps, ps);
    });
  });
}

function drawDeco(c, t, W, H) {
  const id = t.id;
  if (id === "astronaut") {
    c.globalAlpha = 0.25;
    drawPlanet(c, 60, 70, 18, "#4488ff", "#88ccff");
    drawPlanet(c, W - 55, H - 90, 14, "#ff6b6b", "#ffaaaa");
    drawPlanet(c, W - 80, 100, 10, "#ffd93d", "#ffeeaa");
    drawStar(c, 100, 40, 5, 8, 4, "#ffffff");
    drawStar(c, W - 100, 50, 4, 10, 5, "#88ccff");
    drawStar(c, 80, H - 60, 5, 6, 3, "#ffffff");
    drawStar(c, W - 70, H - 50, 4, 7, 3.5, "#ffaaaa");
    drawStar(c, W / 2, 25, 4, 5, 2.5, "#ffffff");
    c.globalAlpha = 0.08;
    c.strokeStyle = "#4488ff";
    c.lineWidth = 1;
    c.beginPath();
    c.arc(W / 2, H / 2, 120, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.arc(W / 2, H / 2, 180, 0.5, Math.PI * 2.2);
    c.stroke();
    c.globalAlpha = 1;
  }
  if (id === "hellokitty") {
    c.globalAlpha = 0.3;
    drawBow(c, 70, 60, 22, "#ff6b9d");
    drawBow(c, W - 70, 55, 18, "#ff8fab");
    drawBow(c, 60, H - 70, 20, "#ff6b9d");
    drawBow(c, W - 65, H - 65, 16, "#ff8fab");
    drawHeart(c, 110, 45, 14, "#ff8fab");
    drawHeart(c, W - 110, 50, 12, "#ff6b9d");
    drawHeart(c, 90, H - 50, 11, "#ff8fab");
    drawHeart(c, W - 90, H - 55, 13, "#ff6b9d");
    c.globalAlpha = 0.06;
    c.fillStyle = "#ff8fab";
    for (let i = 0; i < 15; i++) {
      c.beginPath();
      c.arc(
        40 + (i % 5) * (W / 5),
        30 + Math.floor(i / 5) * (H / 4),
        25,
        0,
        Math.PI * 2,
      );
      c.fill();
    }
    c.globalAlpha = 1;
  }
  if (id === "lotso") {
    c.globalAlpha = 0.3;
    const imageLotso = new Image();
    imageLotso.src = "https://images.seeklogo.com/logo-png/61/2/lotso-logo-png_seeklogo-614152.png"
    drawStrawberry(c, 75, 70, 18, "#e74c3c");
    drawStrawberry(c, W - 70, 65, 16, "#e74c3c");
    drawStrawberry(c, 65, H - 75, 17, "#e74c3c");
    drawStrawberry(c, W - 75, H - 70, 15, "#e74c3c");
    c.drawImage(imageLotso, W - 75, H - 70, 50, 50);
    drawPaw(c, 110, 50, 14, "#d2691e");
    c.drawImage(imageLotso, 110, 50, 50, 50);
    drawPaw(c, W - 105, 55, 12, "#d2691e");
    drawPaw(c, 95, H - 55, 13, "#d2691e");
    drawPaw(c, W - 95, H - 60, 11, "#d2691e");
    c.globalAlpha = 0.06;
    c.fillStyle = "#e74c3c";
    for (let i = 0; i < 12; i++) {
      c.beginPath();
      c.arc(
        50 + (i % 4) * (W / 4),
        40 + Math.floor(i / 4) * (H / 4),
        20,
        0,
        Math.PI * 2,
      );
      c.fill();
    }
    c.globalAlpha = 1;
  }
  if (id === "starwars") {
    c.globalAlpha = 0.35;
    drawStar(c, 80, 55, 4, 10, 5, "#ffd700");
    drawStar(c, W - 75, 60, 5, 8, 4, "#ffd700");
    drawStar(c, 70, H - 65, 4, 7, 3.5, "#ffd700");
    drawStar(c, W - 80, H - 70, 5, 9, 4.5, "#ffd700");
    drawStar(c, W / 2, 30, 4, 6, 3, "#ffffff");
    drawTie(c, 100, 85, 10, "#888");
    drawTie(c, W - 100, H - 85, 9, "#888");
    drawLightsaber(c, 50, H / 2, 40, "#ff0000", -0.3);
    drawLightsaber(c, W - 50, H / 2 + 30, 35, "#00ff00", 0.3);
    c.globalAlpha = 0.06;
    c.strokeStyle = "#ffd700";
    c.lineWidth = 1;
    c.beginPath();
    c.arc(W / 2, H / 2, 100, 0, Math.PI * 2);
    c.stroke();
    c.globalAlpha = 1;
  }
  if (id === "dragonball") {
    c.globalAlpha = 0.3;
    drawDragonBallOrb(c, 70, 60, 16, "#ff9800", 4);
    drawDragonBallOrb(c, W - 65, 70, 14, "#ff9800", 7);
    drawDragonBallOrb(c, 55, H - 65, 15, "#ff9800", 1);
    drawDragonBallOrb(c, W - 60, H - 60, 13, "#ff9800", 3);
    drawStar(c, 100, 45, 5, 10, 5, "#ffcc02");
    drawStar(c, W - 100, 55, 4, 8, 4, "#ffcc02");
    drawStar(c, 85, H - 55, 5, 7, 3, "#ffcc02");
    drawStar(c, W - 85, H - 50, 4, 9, 4, "#ffcc02");
    c.globalAlpha = 0.08;
    c.strokeStyle = "#ffa000";
    c.lineWidth = 1.5;
    c.beginPath();
    c.arc(W / 2, H / 2, 130, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.arc(W / 2, H / 2, 170, 0.8, Math.PI * 1.8);
    c.stroke();
    c.globalAlpha = 1;
  }
  if (id === "onepiece") {
    c.globalAlpha = 0.3;
    drawAnchor(c, 70, 65, 18, "#e53935");
    drawAnchor(c, W - 70, H - 65, 16, "#e53935");
    drawStar(c, W - 80, 60, 5, 8, 4, "#29b6f6");
    drawStar(c, 80, H - 60, 4, 7, 3, "#29b6f6");
    drawStar(c, W / 2, 30, 5, 6, 3, "#ffffff");
    drawStar(c, 110, 50, 4, 5, 2.5, "#29b6f6");
    drawStar(c, W - 110, H - 55, 4, 6, 3, "#29b6f6");
    c.globalAlpha = 0.08;
    c.strokeStyle = "#29b6f6";
    c.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      c.beginPath();
      for (let wx = 0; wx < W; wx += 5) {
        const wy = H - 80 + i * 20 + Math.sin(wx * 0.03 + i) * 10;
        wx === 0 ? c.moveTo(wx, wy) : c.lineTo(wx, wy);
      }
      c.stroke();
    }
    c.globalAlpha = 1;
  }
  if (id === "sakura") {
    c.globalAlpha = 0.3;
    drawCherryBlossom(c, 65, 55, 16, "#e91e63");
    drawCherryBlossom(c, W - 60, 60, 14, "#f06292");
    drawCherryBlossom(c, 70, H - 60, 15, "#e91e63");
    drawCherryBlossom(c, W - 65, H - 55, 13, "#f06292");
    drawCherryBlossom(c, W / 2 - 40, 35, 10, "#f48fb1");
    drawCherryBlossom(c, W / 2 + 50, H - 40, 11, "#f48fb1");
    drawHeart(c, 100, 50, 12, "#e91e63");
    drawHeart(c, W - 95, 55, 10, "#f06292");
    drawHeart(c, 90, H - 50, 11, "#e91e63");
    drawHeart(c, W - 85, H - 55, 9, "#f06292");
    c.globalAlpha = 0.06;
    c.fillStyle = "#f06292";
    for (let i = 0; i < 15; i++) {
      c.beginPath();
      c.arc(
        40 + (i % 5) * (W / 5),
        30 + Math.floor(i / 5) * (H / 4),
        20, 0, Math.PI * 2
      );
      c.fill();
    }
    c.globalAlpha = 1;
  }
  if (id === "retrogame") {
    c.globalAlpha = 0.3;
    drawPixelHeart(c, 70, 55, 28, "#00e676");
    drawPixelHeart(c, W - 70, H - 55, 24, "#b388ff");
    drawPixelStar(c, W - 75, 60, 26, "#00e676");
    drawPixelStar(c, 75, H - 60, 22, "#b388ff");
    drawStar(c, 100, 40, 4, 6, 3, "#00e676");
    drawStar(c, W - 100, 45, 5, 5, 2.5, "#b388ff");
    drawStar(c, W / 2, 28, 4, 5, 2.5, "#ffffff");
    c.globalAlpha = 0.06;
    c.strokeStyle = "#00e676";
    c.lineWidth = 0.5;
    for (let gx = 0; gx < W; gx += 30) {
      c.beginPath();
      c.moveTo(gx, 0);
      c.lineTo(gx, H);
      c.stroke();
    }
    for (let gy = 0; gy < H; gy += 30) {
      c.beginPath();
      c.moveTo(0, gy);
      c.lineTo(W, gy);
      c.stroke();
    }
    c.globalAlpha = 1;
  }
}

function buildStrip(photos, template) {
  return new Promise((resolve, reject) => {
    const cv = document.createElement("canvas");
    cv.width = W;
    cv.height = H;
    const c = cv.getContext("2d");
    const g = c.createLinearGradient(0, 0, 0, H);
    const [c1, c2] = extractColors(template.stripBg);
    g.addColorStop(0, c1);
    g.addColorStop(0.5, c2);
    g.addColorStop(1, c1);
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
    drawDeco(c, template, W, H);
    c.strokeStyle = template.border;
    c.lineWidth = 8;
    c.strokeRect(4, 4, W - 8, H - 8);
    c.strokeStyle = template.border + "33";
    c.lineWidth = 2;
    c.strokeRect(16, 16, W - 32, H - 32);
    const loadImg = (src) =>
      new Promise((res, rej) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => res(img);
        img.onerror = () => rej(new Error("Failed"));
        img.src = src;
      });
    Promise.all(photos.map((p) => loadImg(p)))
      .then(async (imgs) => {
        imgs.forEach((img, i) => {
          const y = PAD + i * (PH + GAP);
          const x = PAD;
          const pw = W - PAD * 2;

          c.fillStyle = template.border + "11";
          c.fillRect(x, y, pw, PH);

          c.save();
          c.beginPath();
          c.rect(x, y, pw, PH);
          c.clip();

          const sx = pw / img.width;
          const sy = PH / img.height;
          const s = Math.max(sx, sy);

          const dw = img.width * s;
          const dh = img.height * s;

          c.translate(x + pw / 2, y + PH / 2);
          c.scale(-1, 1);
          c.drawImage(img, -dw / 2, -dh / 2, dw, dh);

          c.restore();

          c.strokeStyle = template.border + "77";
          c.lineWidth = 4;
          c.strokeRect(x, y, pw, PH);

          c.fillStyle = "rgba(0,0,0,0.5)";
          c.fillRect(x + pw - 42, y + PH - 24, 42, 24);
          c.font = 'bold 12px "Urbanist", sans-serif';
          c.fillStyle = "#ffffff";
          c.textAlign = "right";
          c.fillText(`${i + 1}/${imgs.length}`, x + pw - 8, y + PH - 8);
          c.textAlign = "left";
        });
        if (template.id === "astronaut") {
          const imageAstrounot1 = await loadStaticImage(astronotImg1);
          const imageAstrounot2 = await loadStaticImage(astronotImg2);
          const imagePlanet = await loadStaticImage(planetImg);
          c.drawImage(imageAstrounot1, -20, 5, 140, 140);
          c.drawImage(imageAstrounot2, PAD * 13, 36 * 20 / 2 - 30, 140, 140);
          c.drawImage(imagePlanet, 8, 36 * 20 - 20, 130, 80);
        }
        if (template.id === "hellokitty") {
          const imageHK1 = await loadStaticImage(hkImg1);
          const imageHK2 = await loadStaticImage(hkImg2);
          const imageHK3 = await loadStaticImage(hkImg3);
          c.drawImage(imageHK1, 13, 8, 140, 140);
          c.drawImage(imageHK2, PAD * 13, 36 * 20 / 2 - 30, 140, 140);
          c.drawImage(imageHK3, 15, 36 * 20 - 20, 120, 100);
        }
        if (template.id === "starwars") {
          const imageSW1 = await loadStaticImage(swImg1);
          const imageSW2 = await loadStaticImage(swImg2);
          const imageSW3 = await loadStaticImage(swImg3);
          c.drawImage(imageSW1, 17, 25, 160, 80);
          c.drawImage(imageSW2, PAD * 13, 36 * 20 / 2 - 30, 140, 140);
          c.drawImage(imageSW3, 15, 36 * 20 - 50, 120, 135);
        }
        if (template.id === "lotso") {
          const imageL1 = await loadStaticImage(lImg1);
          const imageL2 = await loadStaticImage(lImg2);
          const imageL3 = await loadStaticImage(lImg3);
          c.drawImage(imageL1, 5, -5, 130, 130);
          c.drawImage(imageL2, PAD * 13, 36 * 21 / 2, 100, 100);
          c.drawImage(imageL3, 5, 36 * 20 - 40, 120, 135);
        }
        if (template.id === "dragonball") {
          const imgDb1 = await loadStaticImage(dbImg1);
          const imgDb2 = await loadStaticImage(dbImg2);
          const imgDb3 = await loadStaticImage(dbImg3);
          c.drawImage(imgDb1, -10, 5, 140, 140);
          c.drawImage(imgDb2, PAD * 13, 36 * 20 / 2 - 30, 130, 130);
          c.drawImage(imgDb3, 5, 36 * 20 - 30, 130, 130);
        }
        if (template.id === "onepiece") {
          const imgOp1 = await loadStaticImage(opImg1);
          const imgOp2 = await loadStaticImage(opImg2);
          const imgOp3 = await loadStaticImage(opImg3);
          c.drawImage(imgOp1, -10, 5, 140, 140);
          c.drawImage(imgOp2, PAD * 13, 36 * 20 / 2 - 30, 140, 140);
          c.drawImage(imgOp3, 5, 36 * 20 - 30, 100, 130);
        }
        if (template.id === "sakura") {
          const imgSa1 = await loadStaticImage(saImg1);
          const imgSa2 = await loadStaticImage(saImg2);
          const imgSa3 = await loadStaticImage(saImg3);
          c.drawImage(imgSa1, 10, 12, 100, 140);
          c.drawImage(imgSa2, PAD * 13, 36 * 20 / 2 - 30, 120, 140);
          c.drawImage(imgSa3, 0, 36 * 20 - 30, 130, 130);
        }
        if (template.id === "omnom") {
          const imgOm1 = await loadStaticImage(omImg1);
          const imgOm2 = await loadStaticImage(omImg2);
          const imgOm3 = await loadStaticImage(omImg3);
          c.drawImage(imgOm1, 10, 12, 130, 140);
          c.drawImage(imgOm2, PAD * 13, 36 * 20 / 2 - 30, 120, 120);
          c.drawImage(imgOm3, 0, 36 * 20 - 30, 130, 130);
        }

        const fy = H - FH + 24;
        const bf = template.font.includes("Bebas")
          ? '"Bebas Neue", sans-serif'
          : '"Playfair Display", serif';
        c.font = `bold 44px ${bf}`;
        c.fillStyle = template.textColor;
        c.textAlign = "center";
        c.shadowColor = template.border + "66";
        c.shadowBlur = 10;
        c.fillText("SKANIGA PORTRAIT", W / 2, fy + 12);
        c.shadowBlur = 0;
        c.strokeStyle = template.border + "55";
        c.lineWidth = 1.5;
        c.beginPath();
        c.moveTo(W / 2 - 80, fy + 28);
        c.lineTo(W / 2 + 80, fy + 28);
        c.stroke();
        c.font = '16px "Urbanist", sans-serif';
        c.fillStyle = template.textColor + "bb";
        c.fillText(template.overlayText, W / 2, fy + 50);
        const dt = new Date().toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        c.font = '13px "Urbanist", sans-serif';
        c.fillStyle = template.textColor + "99";
        c.fillText(dt, W / 2, fy + 72);
        c.font = 'bold 12px "Urbanist", sans-serif';
        c.fillStyle = template.border + "cc";
        c.fillText(template.name.toUpperCase(), W / 2, fy + 92);
        c.textAlign = "left";
        resolve(cv.toDataURL("image/jpeg", 0.96));
      })
      .catch(reject);
  });
}

async function upImgBB(b64) {
  try {
    const b = b64.replace(/^data:image\/jpeg;base64,/, "");
    const fd = new FormData();
    fd.append("image", b);
    const r = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      { method: "POST", body: fd },
    );
    const j = await r.json();
    if (j.data && j.data.url)
      return { ok: true, url: "https://ibb.co.com/" + j.data.id };
    return { ok: false, err: j.error?.message || "Fail" };
  } catch (e) {
    return { ok: false, err: e.message };
  }
}

async function upCloud(b64) {
  try {
    const fd = new FormData();
    fd.append("file", b64);
    fd.append("upload_preset", CLOUDINARY_PRESET);
    fd.append("folder", "skaniga-portrait");
    const r = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
      { method: "POST", body: fd },
    );
    const d = await r.json();
    if (d.secure_url) return { ok: true, url: d.secure_url };
    return { ok: false, err: d.error?.message || "Fail" };
  } catch (e) {
    return { ok: false, err: e.message };
  }
}

const CSS = `
@keyframes sk-fl { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-20px) rotate(5deg)} }
.sk-fl { animation: sk-fl 4s ease-in-out infinite }
@keyframes sk-sd { from{transform:translate(-50%,-100%);opacity:0} to{transform:translate(-50%,0);opacity:1} }
.sk-sd { animation: sk-sd 0.4s ease-out }
@keyframes sk-fi { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
.sk-fi { animation: sk-fi 0.6s ease-out }
@keyframes sk-zi { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
.sk-zi { animation: sk-zi 0.5s ease-out }
@keyframes sk-ss { from{transform:rotate(0)} to{transform:rotate(360deg)} }
.sk-ss { animation: sk-ss 3s linear infinite }
@keyframes sk-bs { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
.sk-bs { animation: sk-bs 2s ease-in-out infinite }
`;

export default function FinalPage({ photos, template, onRestart }) {
  const [stripUrl, setStripUrl] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);
  const [status, setStatus] = useState("idle");
  const [shareUrl, setShareUrl] = useState(null);
  const [toast, setToast] = useState(false);
  const [err, setErr] = useState(null);
  const stripRef = useRef(null);

  useEffect(() => {
    const sid = "sk-css";
    if (!document.getElementById(sid)) {
      const s = document.createElement("style");
      s.id = sid;
      s.textContent = CSS;
      document.head.appendChild(s);
    }
    return () => {
      const e = document.getElementById(sid);
      if (e) e.remove();
    };
  }, []);

  const goFull = useCallback(() => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  }, []);

  const exitFull = useCallback(() => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => goFull(), 300);
    return () => clearTimeout(t);
  }, [goFull]);

  const buildAndUpload = useCallback(async () => {
    try {
      setStatus("building");
      setErr(null);
      const strip = await buildStrip(photos, template);
      setStripUrl(strip);
      setStatus("uploading");
      let url = strip,
        ok = false;
      const r1 = await upImgBB(strip);
      if (r1.ok) {
        url = r1.url;
        ok = true;
      } else {
        const r2 = await upCloud(strip);
        if (r2.ok) {
          url = r2.url;
          ok = true;
        }
      }
      if (!ok) setErr("Upload cloud gagal, mode offline aktif");
      setShareUrl(url);
      setStatus("generating-qr");
      const qd = url.startsWith("data:")
        ? `https://skaniga.app/photo/${Date.now()}`
        : url;
      const q = await QRCode.toDataURL(qd, {
        width: 260,
        margin: 2,
        color: {
          dark:
            template.id === "starwars"
              ? "#FFD700"
              : template.id === "astronaut"
                ? "#4488ff"
                : template.id === "lotso"
                  ? "#D2691E"
                  : template.id === "dragonball"
                    ? "#ffa000"
                    : template.id === "onepiece"
                      ? "#e53935"
                      : template.id === "sakura"
                        ? "#e91e63"
                        : template.id === "retrogame"
                          ? "#00e676"
                          : "#ff6b9d",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      });
      setQrUrl(q);
      setStatus("done");
    } catch (e) {
      console.error(e);
      setErr("Error: " + e.message);
      setStatus("error");
    }
  }, [photos, template]);

  useEffect(() => {
    let active = true;
    setTimeout(() => {
      if (active) {
        buildAndUpload();
      }
    }, 0);
    return () => {
      active = false;
    };
  }, [buildAndUpload]);

  const download = () => {
    if (!stripUrl) return;
    const a = document.createElement("a");
    a.href = stripUrl;
    a.download = `skaniga-portrait-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const copyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRestart = () => {
    exitFull();
    onRestart();
  };

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: template.bg }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute sk-fl"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`,
              opacity: 0.12,
              fontSize: `${20 + i * 8}px`,
            }}
          >
            {template.emoji}
          </div>
        ))}
      </div>
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 sk-sd">
          <div
            className="rounded-2xl px-6 py-3 shadow-2xl backdrop-blur-md"
            style={{
              background: "rgba(0,0,0,0.85)",
              border: `1px solid ${template.border}44`,
            }}
          >
            <p className="text-white font-medium text-sm flex items-center gap-2">
              <span>📸</span>
              {status === "done"
                ? "Foto berhasil didownload!"
                : "Link berhasil disalin!"}
            </p>
          </div>
        </div>
      )}
      {err && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 sk-sd">
          <div
            className="rounded-2xl px-6 py-3 shadow-2xl backdrop-blur-md"
            style={{
              background: "rgba(180,140,30,0.9)",
              border: "1px solid rgba(255,200,50,0.3)",
            }}
          >
            <p className="text-white font-medium text-sm flex items-center gap-2">
              <span>⚠️</span>
              {err}
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-center px-10 md:px-16 lg:px-24 pt-8 pb-3 relative z-10 shrink-0">
        <div className="text-center">
          <span
            className="text-2xl font-bold tracking-[0.2em]"
            style={{
              color: template.textColor,
              fontFamily: template.font,
              textShadow: `0 2px 12px ${template.border}44`,
            }}
          >
            HASIL FOTO
          </span>
          <div
            className="h-0.5 w-20 mx-auto mt-1.5 rounded-full"
            style={{ background: template.border }}
          />
        </div>
      </div>
      {status !== "done" && status !== "error" && (
        <div className="relative z-10 mx-8 mb-3 shrink-0">
          
        </div>
      )}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-5 px-6 pb-3 relative z-10 min-h-0 overflow-y-auto">
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div className="relative">
            {stripUrl ? (
              <div
                className="rounded-2xl overflow-hidden shadow-2xl sk-fi"
                style={{
                  border: `4px solid ${template.border}`,
                  boxShadow: `0 25px 70px ${template.border}33, 0 0 0 1px ${template.border}22`,
                }}
              >
                <img
                  src={stripUrl}
                  alt="Photo strip"
                  className="w-full h-auto max-w-full object-contain"
                  ref={stripRef}
                  style={{
                    maxWidth: "min(420px, 80vw)",
                    maxHeight: "60vh",
                  }}
                />
              </div>
            ) : (
              <div
                className="w-64 lg:w-80 rounded-2xl flex items-center justify-center animate-pulse"
                style={{
                  height: 520,
                  background: "rgba(255,255,255,0.08)",
                  border: `2px dashed ${template.border}66`,
                }}
              >
                <div className="text-center">
                  <div className="text-5xl mb-4 sk-ss">⚙️</div>
                  <p
                    className="font-medium text-sm"
                    style={{ color: template.textColor }}
                  >
                    Memproses foto...
                  </p>
                </div>
              </div>
            )}
            <div
              className="absolute -top-3 -right-3 rounded-full px-4 py-1.5 text-xs font-bold shadow-lg"
              style={{ background: template.border, color: "#fff" }}
            >
              {template.emoji} {template.name}
            </div>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={download}
              disabled={!stripUrl}
              className="rounded-2xl w-27 h-8 px-6 py-3 font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg backdrop-blur-md flex justify-center items-center"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: template.textColor,
                border: `1px solid ${template.border}44`,
              }}
            >
              <span>
                <ArrowInDownSquareHalf />
              </span>{" "}
              Download
            </button>
            {shareUrl && !shareUrl.startsWith("data:") && (
              <button
                onClick={copyLink}
                className="rounded-2xl w-27 h-8 px-6 py-3 font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg backdrop-blur-md flex justify-center items-center"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: template.textColor,
                  border: `1px solid ${template.border}44`,
                }}
              >
                <span>
                  <Copy />
                </span>{" "}
                Copy Link
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div
            className="rounded-3xl p-5 flex flex-col items-center gap-3 backdrop-blur-md"
            style={{
              background: "rgba(0,0,0,0.35)",
              border: `2px solid ${template.border}33`,
              minWidth: 180,
              boxShadow: `0 12px 45px ${template.border}22`,
            }}
          >
            <div className="text-center">
              <p
                className="font-bold text-center text-sm mb-1"
                style={{ color: template.textColor }}
              >
                Scan untuk simpan
              </p>
              <p
                className="text-xs opacity-50"
                style={{ color: template.textColor }}
              >
                {shareUrl && !shareUrl.startsWith("data:")
                  ? "Cloud Upload"
                  : "Mode Offline"}
              </p>
            </div>
            {qrUrl ? (
              <div
                className="sk-zi rounded-2xl overflow-hidden p-3 bg-white shadow-xl"
                style={{ border: `3px solid ${template.border}` }}
              >
                <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
              </div>
            ) : (
              <div
                className="w-48 h-48 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: `2px dashed ${template.border}66`,
                }}
              >
                <div className="text-center">
                  <div className="text-4xl sk-ss">🔲</div>
                  <p
                    className="text-xs mt-2 font-medium"
                    style={{ color: template.textColor, opacity: 0.7 }}
                  >
                    Generating...
                  </p>
                </div>
              </div>
            )}
            <div className="text-center space-y-1">
              <p
                className="font-medium text-xs opacity-80 max-w-44"
                style={{ color: template.textColor }}
              >
                {shareUrl && !shareUrl.startsWith("data:")
                  ? "Scan QR untuk buka foto"
                  : "QR preview • Download untuk simpan"}
              </p>
              {shareUrl && !shareUrl.startsWith("data:") && (
                <p
                  className="text-[10px] opacity-40 font-mono truncate max-w-44"
                  style={{ color: template.textColor }}
                >
                  {shareUrl}
                </p>
              )}
            </div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-3xl sk-bs">{template.emoji}</p>
            <div>
              <p
                className="font-bold text-sm"
                style={{ color: template.textColor }}
              >
                {template.name}
              </p>
              <p
                className="text-xs opacity-50"
                style={{ color: template.textColor }}
              >
                SKANIGA PORTRAIT
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 pb-4 px-4 text-center space-y-2 shrink-0">
        {status === "done" && (
          <p
            className="text-xs opacity-40"
            style={{ color: template.textColor }}
          >
            {shareUrl && !shareUrl.startsWith("data:")
              ? "Foto tersimpan di cloud • Scan QR untuk akses"
              : "Mode offline aktif • Download untuk simpan"}
          </p>
        )}
        <div className="flex justify-center">
          <button
            onClick={handleRestart}
            className="w-50 h-11 flex justify-center items-center rounded-2xl px-8 py-3 font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-md gap-2"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: `1px solid ${template.border}44`,
            }}
          >
            <Home /> <span>Kembali ke Beranda</span>
          </button>
        </div>
        <div className="h-4"></div>
      </div>
    </div>
  );
}
