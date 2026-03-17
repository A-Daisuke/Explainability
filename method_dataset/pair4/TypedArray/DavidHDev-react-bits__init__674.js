function __method_wrapper__() {
      init() {
        const options = this.options;
        let curve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1));
        let geometry = new THREE.TubeGeometry(curve, 40, 1, 8, false);

        let instanced = new THREE.InstancedBufferGeometry().copy(geometry);
        instanced.instanceCount = options.lightPairsPerRoadWay * 2;

        let laneWidth = options.roadWidth / options.lanesPerRoad;

        let aOffset = [];
        let aMetrics = [];
        let aColor = [];

        let colors = this.colors;
        if (Array.isArray(colors)) {
          colors = colors.map(c => new THREE.Color(c));
        } else {
          colors = new THREE.Color(colors);
        }

        for (let i = 0; i < options.lightPairsPerRoadWay; i++) {
          let radius = random(options.carLightsRadius);
          let length = random(options.carLightsLength);
          let speed = random(this.speed);

          let carLane = i % options.lanesPerRoad;
          let laneX = carLane * laneWidth - options.roadWidth / 2 + laneWidth / 2;

          let carWidth = random(options.carWidthPercentage) * laneWidth;
          let carShiftX = random(options.carShiftX) * laneWidth;
          laneX += carShiftX;

          let offsetY = random(options.carFloorSeparation) + radius * 1.3;

          let offsetZ = -random(options.length);

          aOffset.push(laneX - carWidth / 2);
          aOffset.push(offsetY);
          aOffset.push(offsetZ);

          aOffset.push(laneX + carWidth / 2);
          aOffset.push(offsetY);
          aOffset.push(offsetZ);

          aMetrics.push(radius);
          aMetrics.push(length);
          aMetrics.push(speed);

          aMetrics.push(radius);
          aMetrics.push(length);
          aMetrics.push(speed);

          let color = pickRandom(colors);
          aColor.push(color.r);
          aColor.push(color.g);
          aColor.push(color.b);

          aColor.push(color.r);
          aColor.push(color.g);
          aColor.push(color.b);
        }

        instanced.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3, false));
        instanced.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 3, false));
        instanced.setAttribute('aColor', new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false));

        let material = new THREE.ShaderMaterial({
          fragmentShader: carLightsFragment,
          vertexShader: carLightsVertex,
          transparent: true,
          uniforms: Object.assign(
            {
              uTime: { value: 0 },
              uTravelLength: { value: options.length },
              uFade: { value: this.fade }
            },
            this.webgl.fogUniforms,
            options.distortion.uniforms
          )
        });

        material.onBeforeCompile = shader => {
          shader.vertexShader = shader.vertexShader.replace(
            '#include <getDistortion_vertex>',
            options.distortion.getDistortion
          );
        };

        let mesh = new THREE.Mesh(instanced, material);
        mesh.frustumCulled = false;
        this.webgl.scene.add(mesh);
        this.mesh = mesh;
      }

}
