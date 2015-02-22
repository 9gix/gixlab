"use strict";

var Texmap = (function(){
    var TEXTURE_WIDTH = 100,
        TEXTURE_HEIGHT = 100,
        CANVAS_WIDTH = 600,
        CANVAS_HEIGHT = 400;

    var renderer = null,
        scene = null,
        camera = null,
        root = null,
        group = null,
        orbitControls = null,
        texture = null;
    var textureCanvas = null;
    var duration = 5000;
    var currentTime = Date.now();


    function animate(){
        var now = Date.now();
        var deltat = now - currentTime;
        currentTime = now;
        var fract = deltat / duration;
        var angle = Math.PI * 2 * fract;
        group.rotation.x += angle / 19;
        group.rotation.y += angle / 17;
        group.rotation.z += angle / 18;
    }

    function run(){
        requestAnimationFrame(function(){
            run();
        });
        renderer.render(scene, camera);
        animate();

        orbitControls.update();
    }

    function initScene(canvas){
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
        });
        renderer.setSize(canvas.width, canvas.height);
        scene = new THREE.Scene();
        root  = new THREE.Object3D();
        group = new THREE.Object3D();



        // var light = new THREE.DirectionalLight(0xffffff, 1.5);
        // light.position.set(0, 0, 1);
        // root.add(light);

        
        camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
        camera.position.set(0,0,5);
        scene.add(camera);







        return scene;
    }

    function mapTextureToObject(){

        var textureUrl = textureCanvas.toDataURL();
        texture = THREE.ImageUtils.loadTexture(textureUrl);;

        var material = new THREE.MeshBasicMaterial({
            map: texture
        });


        var geometry = new THREE.BoxGeometry(2, 2, 2);
        var cube = new THREE.Mesh(geometry, material);
        cube.rotation.x = Math.PI / 6;
        cube.rotation.y = Math.PI / 4;

        // cube.position.z = -6;
        group.add(cube);
        root.add(group);
        scene.add(root);
    }

    function initEventListener(canvas){
        
    }

    function initControl(canvas){
        orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
        var mapBtn = document.getElementById('map-button');
        mapBtn.addEventListener('click', function(e){
            mapTextureToObject();
        });

        var textureImg = document.getElementById('texture-image');
        textureImg.addEventListener('change', function(e){
            var files = e.target.files;
            if (files && files[0]){
                var reader = new FileReader();
                reader.onload = function(evt){
                    var textureContext = textureCanvas.getContext('2d');
                    var img = new Image();
                    img.src = evt.target.result;
                    textureContext.drawImage(img, 0, 0, 100, 100);
                };

                reader.readAsDataURL(files[0]);
            }
        })
    }

    function init(){
        var canvas = document.getElementById("result-canvas");
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        textureCanvas = document.getElementById('texture-canvas');
        textureCanvas.width = TEXTURE_WIDTH;
        textureCanvas.height = TEXTURE_HEIGHT;

        initScene(canvas);
        initEventListener(canvas);
        initControl();


        run();

    }

    return {
        init: init,
    };
})();


document.addEventListener("DOMContentLoaded", function(){
    Texmap.init();
});