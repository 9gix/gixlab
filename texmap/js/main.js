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

    var cylinder_geometry = null,
        cylinder_mesh = null;

    var textureCanvas = null;


    function animate(){
        var rotation_tween = new TWEEN.Tween(group.rotation)
            .to({y: Math.PI * 2}, 60000)
            .repeat(Infinity)
            .start();
    }

    function run(){
        requestAnimationFrame(function(){
            run();
        });
        renderer.render(scene, camera);

        TWEEN.update();

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
        camera.position.set(0,10,10);
        scene.add(camera);


        
        cylinder_geometry = new THREE.CylinderGeometry(1,1,4,32,1,true);
        cylinder_mesh = new THREE.Mesh(cylinder_geometry, 
            new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                wireframe: true,
            })); 
        cylinder_mesh.position.y = 2.1;


        var plane_texture = THREE.ImageUtils.loadTexture('img/marble_floor.jpg');
        plane_texture.wrapS = plane_texture.wrapT = THREE.RepeatWrapping;
        plane_texture.repeat.set(4,4);
        
        var plane_mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10, 50, 50),
            new THREE.MeshBasicMaterial({
                // color: 0x00ff00,
                map: plane_texture,
                side: THREE.DoubleSide
            }));

        plane_mesh.rotation.x = -Math.PI / 2;

        // cylinder_mesh.rotation.x = Math.PI / 6;
        // cylinder_mesh.rotation.y = Math.PI / 4;
        group.add(cylinder_mesh);
        group.add(plane_mesh);
        root.add(group);
        scene.add(root);


        return scene;
    }

    function mapTextureToObject(){

        if (!cylinder_mesh.material.map){
            cylinder_mesh.material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
            });
        }

        var textureUrl = textureCanvas.toDataURL();
        texture = THREE.ImageUtils.loadTexture(textureUrl);;

        cylinder_mesh.material.map = texture;
        cylinder_mesh.material.needUpdate = true;
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
        });
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

        animate();
        run();

    }

    return {
        init: init,
    };
})();


document.addEventListener("DOMContentLoaded", function(){
    Texmap.init();
});
