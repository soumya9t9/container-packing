import { Component, OnInit } from '@angular/core';
import { OrbitControls } from '@three-ts/orbit-controls';
import * as THREE from 'three';
var scene: any;
var camera: any;
var renderer: any;
var controls: any;
var itemMaterial: any;
declare var $: any;
var THIS: any;
var cube: any;

@Component({
  selector: 'app-poc',
  templateUrl: './poc.component.html',
  styleUrls: ['./poc.component.scss']
})
export class PocComponent implements OnInit {

  constructor() {
    THIS = this;
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;
    this.animate();
  }

  animate() {
    requestAnimationFrame(THIS.animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

}
