
uniform float uAngle;
uniform float uProgress;
uniform vec3 uMousePos;
uniform bool uIsMobile;

varying vec2 vUv;
varying float vFrontShadow;

float pi = 3.14159265359;

mat4 rotationMatrix(vec3 axis, float uAngle) {
    axis = normalize(axis);
    float s = sin(uAngle);
    float c = cos(uAngle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}
vec3 rotate(vec3 v, vec3 axis, float uAngle) {
  mat4 m = rotationMatrix(axis, uAngle);
  return (m * vec4(v, 1.0)).xyz;
}

void main() {
  // Pass the texture coordinates to the fragment shader
  vUv = uv;

  // @todo account for aspect ratio!!!
  vec3 newposition = position;

  float rad = 0.4;
  float rolls = 1.;
  // rot
  newposition = rotate(newposition - vec3(-.5,.5,0.), vec3(0.,0.,1.),-uAngle) + vec3(-.5,.5,0.);

  float offs = (newposition.x + 0.5)/(sin(uAngle) + cos(uAngle)) ; // -0.5..0.5 -> 0..1
  float tProgress = clamp( (uProgress - offs*0.99)/0.01 , 0.,1.);

  // shadows
  vFrontShadow = clamp((uProgress - offs*0.95)/0.05,0.7,1.);

  newposition.z =  rad + rad*(1. - offs/2.)*sin(-offs*rolls*pi - 0.5*pi);
  newposition.x =  - 0.5 + rad*(1. - offs/2.)*cos(-offs*rolls*pi + 0.5*pi);
  // rot back
  newposition = rotate(newposition - vec3(-.5,.5,0.), vec3(0.,0.,1.),uAngle) + vec3(-.5,.5,0.);
  // unroll
  newposition = rotate(newposition - vec3(-.5,0.5,rad), vec3(sin(uAngle),cos(uAngle),0.), -pi*uProgress*rolls);
  newposition +=  vec3(
    -.5 + uProgress*cos(uAngle)*(sin(uAngle) + cos(uAngle)), 
    0.5 - uProgress*sin(uAngle)*(sin(uAngle) + cos(uAngle)),
    rad*(1.-uProgress/2.)
  );

  vec3 finalposition = mix(newposition,position,tProgress);
  vec4 modelPosition = modelMatrix * vec4(finalposition, 1.0);

  // Bell shaper
  float k = 6.5;
  float sizaBell = 0.25;
  float correctionValueX = 0.1;
  float correctionValueY = 0.2;

  if (!uIsMobile) {
    modelPosition.z += 
    (1. / (1. + exp(-k * ((finalposition.x - uMousePos.y + correctionValueY ) - 0.))) - 1. / (1. + exp(-k * ((finalposition.x - uMousePos.y + correctionValueY ) - sizaBell))))
    *
    (1. / (1. + exp(-k * ((finalposition.y + uMousePos.x + correctionValueX) - 0.))) - 1. / (1. + exp(-k * ((finalposition.y + uMousePos.x + correctionValueX) - sizaBell))));
  }

  // Calculate the final vertex position in clip space
  gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
