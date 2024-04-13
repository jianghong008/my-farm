import './style.css'
import { Game, WEBGL } from 'phaser'
import RootScene from './scence/root'
import { createRoot } from 'react-dom/client';
import { MainUI } from './ui/MainUI';
import React from 'react';
function main() {
  const box = window.document.getElementById('canvas')
  if (!box) {
    console.warn('no game box')
    return
  }
  const rect = box.getBoundingClientRect()
  new Game({
    type: WEBGL,
    width: rect.width,
    height: rect.height,
    scene: [RootScene],
    canvas: box as HTMLCanvasElement,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 200, x: 0 },
      }
    },
    render: {
      pixelArt: true,
      antialias: false,
    },
    backgroundColor: 0x8cbfc2,
  })

  const uiDom = document.getElementById('ui')
  uiDom?.addEventListener('mousedown',(e: MouseEvent) => {
    e.stopPropagation()
  })

  uiDom?.addEventListener('touchstart',(e: TouchEvent) => {
    e.stopPropagation()
  })

  const ui = createRoot(uiDom!)
  ui.render(<React.StrictMode>
    <MainUI />
  </React.StrictMode>)
}
main()