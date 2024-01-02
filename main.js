import { Camera } from 'three'; // import camerara
import './style.css' // import style sheet
import * as THREE from 'three'; // import everything from three js library need to be changed to just import what we need
import { Scene } from 'three'; // import scene
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' // add orbitals for user to navigate the scene
import { FontLoader } from 'three/addons/loaders/FontLoader.js'; // import loader for fonts
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'; // import text geometry
import Stats from 'three/addons/libs/stats.module.js'; // and import stats


//  define variables needed
let starGeo, stars, material;

//  setup scene camerara and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas'),
});

// configure the renderer
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// define orbitals
const controls = new OrbitControls( camera, document.querySelector('#canvas') );
controls.update();

// define geometry for stars and vertices
const geometry = new THREE.BufferGeometry();
const vertices = [];

// load sprite whoch is the texture for the stars
const sprite = new THREE.TextureLoader().load( './assets/star.png' );
sprite.colorSpace = THREE.SRGBColorSpace;

// create 10000 stars' vertices randomly
for ( let i = 0; i < 10000; i ++ ) {

	const x = 2000 * Math.random() - 1000;
	const y = 2000 * Math.random() - 1000;
	const z = 2000 * Math.random() - 1000;

	vertices.push( x, y, z );

}

// add them to the geometry
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

// define our point material
material = new THREE.PointsMaterial( { color: 0xaaaaaa, size: 3, map: sprite } );

// create our stars and add it to our scene
const particles = new THREE.Points( geometry, material );
scene.add( particles );

// add fancy text
let line, uniforms;

const loader = new FontLoader(); // initialise loader
loader.load( './assets/helvetiker_bold.typeface.json', function ( font ) {
	init( font );
	animate();
} ); // load the font

camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.z = 400;

scene = new THREE.Scene();
scene.background = new THREE.Color( 0x050505 );
            
renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas'),
});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
function init( font ) {

	uniforms = {

		amplitude: { value: 5.0 },
		opacity: { value: 0.3 },
		color: { value: new THREE.Color( 0xffffff ) }

	};

	const shaderMaterial = new THREE.ShaderMaterial( {

		uniforms: uniforms,
		vertexShader: document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		transparent: true

	});


	const text_te_geometry = new TextGeometry( 'Happy New Year', {

		font: font,

			size: 10,
			height: 15,
			curveSegments: 10,

			bevelThickness: 5,
			bevelSize: 1.5,
			bevelEnabled: true,
			bevelSegments: 10,

		}
	);

	text_te_geometry.x = -300;
	text_te_geometry.y = -300000;
	text_te_geometry.z = -300;

	const count = text_te_geometry.attributes.position.count;

	const displacement = new THREE.Float32BufferAttribute( count * 3, 3 );
	text_te_geometry.setAttribute( 'displacement', displacement );

	const customColor = new THREE.Float32BufferAttribute( count * 3, 3 );
	text_te_geometry.setAttribute( 'customColor', customColor );

	const color = new THREE.Color( 0xffffff );

	for ( let i = 0, l = customColor.count; i < l; i ++ ) {

		color.setHSL( i / l, 0.5, 0.5 );
		color.toArray( customColor.array, i * customColor.itemSize );

	}

	line = new THREE.Line( text_te_geometry, shaderMaterial );
	line.rotation.x = 0.2;
	scene.add( line );
}

// animate the scene
function animate() {
    // function to animate the scene
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.1; // Update y position for each star
        if (positions[i + 1] < -500) {
            positions[i + 1] = 500; // Reset y position if star goes below -500
        }
    }

	// rotate the stars
    geometry.attributes.position.needsUpdate = true;
    particles.rotation.y += 0.002;
	particles.position.x += 0.01;

	// rotate words
	const time = Date.now() * 0.001;

	line.rotation.y = 0.25 * time;

	uniforms.amplitude.value = Math.sin( 0.5 * time );
	uniforms.color.value.offsetHSL( 0.0005, 0, 0 );

	const attributes = line.geometry.attributes;
	const array = attributes.displacement.array;

	for ( let i = 0, l = array.length; i < l; i += 3 ) {

		array[ i ] += 0.3 * ( 0.5 - Math.random() );
		array[ i + 1 ] += 0.3 * ( 0.5 - Math.random() );
		array[ i + 2 ] += 0.3 * ( 0.5 - Math.random() );

	}

	attributes.displacement.needsUpdate = true;

	// update orbital controls
	controls.update();

	// add the scene and renderer to the scene
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// run the three js scene
// animate the scene
animate();