import { Component, OnInit, Type } from '@angular/core';
import { OrbitControls } from '@three-ts/orbit-controls';
import * as THREE from 'three';
import { ContainerService } from '../container.service';


var scene:any;
var camera:any;
var renderer:any;
var controls:any;
var itemMaterial:any;
var THIS:any;
declare var $:any;
@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

  ItemsToPack!: Item[];
  Containers!: Container[];
  ItemCounter = 0;
  ContainerCounter = 0;
  ItemsToRender:any[] = [];
  LastItemRenderedIndex = -1;
  ContainerOriginOffset = {
    x: 0,
    y: 0,
    z: 0
  };
  AlgorithmsToUse: AlgorithmModel[] = [
    { AlgorithmID: 1, AlgorithmName: "EB-AFIT" }
  ];

  constructor(private containerService: ContainerService) {
    THIS = this;
   }

  ngOnInit(): void {

    $('[data-toggle="tooltip"]').tooltip(); 
    this.initializeDrawing();
    this.prepareData();
    this.PackContainers();
  }

  initializeDrawing() {
    var container = $('#drawing-container');
  
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.lookAt(scene.position);
  
    //var axisHelper = new THREE.AxisHelper( 5 );
    //scene.add( axisHelper );
  
    // LIGHT
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0,150,100);
    scene.add(light);
  
    // Get the item stuff ready.
    itemMaterial = new THREE.MeshNormalMaterial( { transparent: true, opacity: 0.6 } );
  
    renderer = new THREE.WebGLRenderer( { antialias: true } ); // WebGLRenderer CanvasRenderer
    renderer.setClearColor( 0xf0f0f0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth / 2, window.innerHeight / 2);
    container.append( renderer.domElement );
  
    controls = new OrbitControls( camera, renderer.domElement );
    window.addEventListener( 'resize', this.onWindowResize, false );
  
    this.animate();
  };
  prepareData() {
    this.GenerateItemsToPack();
    this.GenerateContainers();
  }
  onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth / 2, window.innerHeight / 2 );
  }

  animate() {
    if(THIS) {
      requestAnimationFrame( THIS.animate );
      controls.update();
      THIS.render();
    }
  }
  render() {
    renderer.render( scene, camera );
  }
 
  GenerateItemsToPack() {
    this.ItemsToPack = [
      { ID: 1000, Name: 'Item1', Length: 5, Width: 4, Height: 2, Quantity: 1 },
      { ID: 1001, Name: 'Item2', Length: 2, Width: 1, Height: 1, Quantity: 3 },
      { ID: 1002, Name: 'Item3', Length: 9, Width: 7, Height: 3, Quantity: 4 },
      { ID: 1003, Name: 'Item4', Length: 13, Width: 6, Height: 3, Quantity: 8 },
      { ID: 1004, Name: 'Item5', Length: 17, Width: 8, Height: 6, Quantity: 1 },
      { ID: 1005, Name: 'Item6', Length: 3, Width: 3, Height: 2, Quantity: 2 },
    ]
  };

  GenerateContainers() {
    this.Containers = [
      { ID: 1000, Name: 'Box1', Length: 15, Width: 13, Height: 9, AlgorithmPackingResults: [] },
      { ID: 1001, Name: 'Box2', Length: 23, Width: 9, Height: 4, AlgorithmPackingResults: [] },
      { ID: 1002, Name: 'Box3', Length: 16, Width: 16, Height: 6, AlgorithmPackingResults: [] },
      { ID: 1003, Name: 'Box4', Length: 10, Width: 8, Height: 5, AlgorithmPackingResults: [] },
      { ID: 1004, Name: 'Box5', Length: 40, Width: 28, Height: 20, AlgorithmPackingResults: [] },
      { ID: 1005, Name: 'Box6', Length: 29, Width: 19, Height: 4, AlgorithmPackingResults: [] },
      { ID: 1006, Name: 'Box7', Length: 18, Width: 13, Height: 1, AlgorithmPackingResults: [] },
      { ID: 1007, Name: 'Box8', Length: 6, Width: 6, Height: 6, AlgorithmPackingResults: [] },
      { ID: 1008, Name: 'Box9', Length: 8, Width: 5, Height: 5, AlgorithmPackingResults: [] },
      { ID: 1009, Name: 'Box10', Length: 18, Width: 13, Height: 8, AlgorithmPackingResults: [] },
      { ID: 1010, Name: 'Box11', Length: 17, Width: 16, Height: 15, AlgorithmPackingResults: [] },
      { ID: 1011, Name: 'Box12', Length: 32, Width: 10, Height: 9, AlgorithmPackingResults: [] },
      { ID: 1012, Name: 'Box13', Length: 60, Width: 60, Height: 60, AlgorithmPackingResults: [] },
    ]
  };

  AddAlgorithmToUse() {
    var algorithmID = $('#algorithm-select option:selected').val();
    var algorithmName = $('#algorithm-select option:selected').text();
    this.AlgorithmsToUse.push({ AlgorithmID: algorithmID, AlgorithmName: algorithmName });
  };

  RemoveAlgorithmToUse(item:AlgorithmModel) {
    // this.AlgorithmsToUse.remove(item);
  };

  AddNewItemToPack() {
    const NewItemToPack = new Item();
    NewItemToPack.ID = this.ItemCounter++;
    NewItemToPack.Name = '';
    NewItemToPack.Length = 0;
    NewItemToPack.Width = 0;
    NewItemToPack.Height = 0;
    NewItemToPack.Quantity = 0;
    this.ItemsToPack.push(NewItemToPack);
  }

  RemoveItemToPack(item:Item) {
    // self.ItemsToPack.remove(item);
  };

  AddNewContainer() {
    const NewContainer = new Container();
    NewContainer.ID = this.ContainerCounter++;
    // NewContainer.Name('');
    // NewContainer.Length('');
    // NewContainer.Width('');
    // NewContainer.Height('');
    this.Containers.push(NewContainer);
  };

  RemoveContainer(item:Container) {
    // this.Containers.remove(item);
  };

  PackContainers() {
    var algorithmsToUse:any[] = [];

    this.AlgorithmsToUse.forEach(algorithm => {
      algorithmsToUse.push(algorithm.AlgorithmID);
    });

    var itemsToPack:any = [];

    this.ItemsToPack.forEach(item => {
      var itemToPack = {
        ID: item.ID,
        Dim1: item.Length,
        Dim2: item.Width,
        Dim3: item.Height,
        Quantity: item.Quantity
      };
      itemsToPack.push(itemToPack);
    });

    var containers:any = [];

    // Send a packing request for each container in the list.
    this.Containers.forEach(container => {
      var containerToUse = {
        ID: container.ID,
        Length: container.Length,
        Width: container.Width,
        Height: container.Height
      };

      containers.push(containerToUse);
    });

    	// Build container packing request.
		var request = {
			Containers: containers,
			ItemsToPack: itemsToPack,
			AlgorithmTypeIDs: algorithmsToUse
		};


    this.containerService.getPackagingSample(null)
    .subscribe((response:any) => {
      // Tie this response back to the correct containers.
      response.forEach((containerPackingResult:any) => {
        this.Containers.forEach(container => {
          if (container.ID == containerPackingResult.ContainerID) {
            container.AlgorithmPackingResults = (containerPackingResult.AlgorithmPackingResults);
          }
        });
      });
      this.containerLists = response.sort((a:any,b:any) => a.ContainerID - b.ContainerID);
      this.containerIndex = 1;
      this.ShowPackingView(response[this.containerIndex].AlgorithmPackingResults[0], this.Containers[this.containerIndex]);
      setTimeout(() => {
        this.PackItemInRender();
      }, 100);
    });
  }
  containerIndex = 0;
  containerLists: any= []
  changeContainer(operand:number) {
    this.containerIndex += operand;
    this.ShowPackingView(this.containerLists[this.containerIndex].AlgorithmPackingResults[0], this.Containers[this.containerIndex]);
    this.PackItemInRender();
  }

  ShowPackingView(algorithmPackingResult:AlgorithmPackingResults, container:any) {
    
    var selectedObject = scene.getObjectByName('container');
    scene.remove(selectedObject);

    for (var i = 0; i < 1000; i++) {
      var selectedObject = scene.getObjectByName('cube' + i);
      scene.remove(selectedObject);
    }

    camera.position.set(container.Length, container.Length, container.Length);

    this.ItemsToRender = algorithmPackingResult.PackedItems;
    this.LastItemRenderedIndex = (-1);

    this.ContainerOriginOffset.x = -1 * container.Length / 2;
    this.ContainerOriginOffset.y = -1 * container.Height / 2;
    this.ContainerOriginOffset.z = -1 * container.Width / 2;

    var geometry = new THREE.BoxGeometry(container.Length, container.Height, container.Width);
    var geo = new THREE.EdgesGeometry(geometry); // or WireframeGeometry( geometry )
    var mat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    var wireframe = new THREE.LineSegments(geo, mat);
    wireframe.position.set(0, 0, 0);
    wireframe.name = 'container';
    scene.add(wireframe);
  };

  AreItemsPacked() {
    if (this.LastItemRenderedIndex > -1) {
      return true;
    }

    return false;
  };

  AreAllItemsPacked() {
    if (this.ItemsToRender.length === this.LastItemRenderedIndex + 1) {
      return true;
    }

    return false;
  };

  PackItemInRender() {
    var itemIndex = this.LastItemRenderedIndex + 1;

    var itemOriginOffset = {
      x: this.ItemsToRender[itemIndex].PackDimX / 2,
      y: this.ItemsToRender[itemIndex].PackDimY / 2,
      z: this.ItemsToRender[itemIndex].PackDimZ / 2
    };

    var itemGeometry = new THREE.BoxGeometry(this.ItemsToRender[itemIndex].PackDimX, this.ItemsToRender[itemIndex].PackDimY, this.ItemsToRender[itemIndex].PackDimZ);
    var cube = new THREE.Mesh(itemGeometry, itemMaterial);
    cube.position.set(this.ContainerOriginOffset.x + itemOriginOffset.x + this.ItemsToRender[itemIndex].CoordX, this.ContainerOriginOffset.y + itemOriginOffset.y + this.ItemsToRender[itemIndex].CoordY, this.ContainerOriginOffset.z + itemOriginOffset.z + this.ItemsToRender[itemIndex].CoordZ);
    cube.name = 'cube' + itemIndex;
    scene.add(cube);

    this.LastItemRenderedIndex =itemIndex;
  };

  UnpackItemInRender() {
    var selectedObject = scene.getObjectByName('cube' + this.LastItemRenderedIndex);
    scene.remove(selectedObject);
    this.LastItemRenderedIndex = (this.LastItemRenderedIndex - 1);
  };

}


export class Item {
  ID!: string | number;
  Name!: string;
  Length!: number;
  Width!: number;
  Height!: number;
  Quantity!: number;

  constructor() {}
}

export class Container {
   ID!: string | number;
   Name!: string;
   Length!: number;
   Width!: number;
   Height!: number;
   AlgorithmPackingResults!: AlgorithmPackingResults[];
}

export class PackedItems  {
  "ID"!: number;
  "IsPacked"!: number;
  "Dim1"!: number;
  "Dim2"!: number;
  "Dim3"!: number;
  "CoordX"!: number;
  "CoordY"!: number;
  "CoordZ"!: number;
  "PackDimX"!: number;
  "PackDimY"!: number;
  "PackDimZ"!: number;
  "Volume"!: number;
}

export class AlgorithmPackingResults {
  "AlgorithmName": string;
  "IsCompletePack": boolean;
  "AlgorithmID": number;
  "PackTimeInMilliseconds": number;
  "PercentContainerVolumePacked": number;
  "PercentItemVolumePacked": number;
  "UnpackedItems": [];
  "PackedItems": PackedItems[]
}
export class AlgorithmModel { 
   AlgorithmID!: number;
   AlgorithmName!: string 
}