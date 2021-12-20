import { createApp } from 'vue'
import App from './App.vue'
import * as BABYLON from '@babylonjs/core'
import * as CANNON from 'cannon'
import "@babylonjs/loaders"

window.CANNON = CANNON
window.BABYLON = BABYLON

createApp(App).mount('#app')
