varying vec3 vNormal;
varying vec3 vViewDirection;

uniform vec3 lightDirection1; // First directional light
uniform vec3 lightColor1;
uniform float lightIntensity1;

uniform vec3 lightDirection2; // Second directional light (from the top)
uniform vec3 lightColor2;
uniform float lightIntensity2;

uniform vec3 ambientColor;
uniform float ambientIntensity; 
uniform float metalness;
uniform float roughness;

// PBR functions
float DistributionGGX(vec3 N, vec3 H, float roughness) {
  float a = roughness * roughness;
  float a2 = a * a;
  float NdotH = max(dot(N, H), 0.0);
  float NdotH2 = NdotH * NdotH;

  float denom = (NdotH2 * (a2 - 1.0) + 1.0);
  denom = 3.141592653589793 * denom * denom;

  return a2 / denom;
}

float GeometrySchlickGGX(float NdotV, float roughness) {
  float r = (roughness + 1.0);
  float k = (r * r) / 8.0;

  float denom = NdotV * (1.0 - k) + k;
  return NdotV / denom;
}

float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
  float NdotV = max(dot(N, V), 0.0);
  float NdotL = max(dot(N, L), 0.0);
  float ggx1 = GeometrySchlickGGX(NdotV, roughness);
  float ggx2 = GeometrySchlickGGX(NdotL, roughness);
  return ggx1 * ggx2;
}

vec3 FresnelSchlick(float cosTheta, vec3 F0) {
  return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

vec3 calculateLightContribution(vec3 L, vec3 lightColor, float lightIntensity, vec3 N, vec3 V, vec3 albedo, float metalness, float roughness) {
  vec3 H = normalize(V + L); // Halfway vector
  vec3 F0 = mix(vec3(0.04), albedo, metalness);

  // Cook-Torrance BRDF
  float NDF = DistributionGGX(N, H, roughness);
  float G = GeometrySmith(N, V, L, roughness);
  vec3 F = FresnelSchlick(max(dot(H, V), 0.0), F0);

  vec3 kS = F; // Specular reflection
  vec3 kD = (vec3(1.0) - kS) * (1.0 - metalness); // Diffuse reflection

  vec3 numerator = NDF * G * F;
  float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0);
  vec3 specular = numerator / max(denominator, 0.001);

  // Combine lighting
  float NdotL = max(dot(N, L), 0.0);
  return (kD * albedo / 3.141592653589793 + specular) * lightColor * lightIntensity * NdotL;
}

void main() {
  vec3 N = normalize(vNormal); // Normal
  vec3 V = normalize(vViewDirection); // View direction

  // Material properties
  vec3 albedo = vec3(1.0); // Base color (white)

  // Calculate contribution from the first directional light
  vec3 L1 = normalize(lightDirection1);
  vec3 Lo1 = calculateLightContribution(L1, lightColor1, lightIntensity1, N, V, albedo, metalness, roughness);

  // Calculate contribution from the second directional light (from the top)
  vec3 L2 = normalize(lightDirection2);
  vec3 Lo2 = calculateLightContribution(L2, lightColor2, lightIntensity2, N, V, albedo, metalness, roughness);

  // Combine lighting from both lights
  vec3 Lo = Lo1 + Lo2;

  // Add ambient light
  vec3 ambient = ambientColor * albedo * ambientIntensity;

  // Output color
  gl_FragColor = vec4(Lo + ambient, 1.0);
}