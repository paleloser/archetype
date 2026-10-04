# Single definition of how the three application images are built.
#
# Used by every release, from any machine, so every build produces the same
# image: same contexts, same tags, same registry-backed cache. Change build
# inputs here and nowhere else.
#
#   docker buildx bake --print                 # resolve without building
#   IMAGE_TAG=$(git rev-parse HEAD) docker buildx bake --push
#   IMAGE_TAG=... docker buildx bake --push server

variable "IMAGE_TAG" {
  # No default: an untagged push would clobber :latest with an unidentifiable
  # image, and IMAGE_TAG is what makes a deploy atomic and a rollback one line.
  default = null
}

variable "REGISTRY" {
  default = "ghcr.io"
}

# `<owner>/<repo>` on GitHub, for the GHCR image names.
variable "REPOSITORY" {
  default = "acme/acme"
}

# The target host's architecture. Resolve it from the host when releasing
# from a laptop of a different one (arm64 vs amd64).
variable "PLATFORM" {
  default = "linux/amd64"
}

# Commit the images are built from. Recorded as an OCI label so a release can tell
# whether an app's sources changed since the image currently tagged :latest,
# and retag instead of rebuilding when they did not.
variable "GIT_SHA" {
  default = ""
}

function "image" {
  params = [app]
  result = "${REGISTRY}/${REPOSITORY}/${app}"
}

function "tags" {
  params = [app]
  result = [
    "${image(app)}:${IMAGE_TAG}",
    "${image(app)}:latest",
  ]
}

# Registry-backed cache outlives the 10 GB GHA cache and is shared across
# branches and machines, which is what keeps unchanged apps cheap to rebuild.
function "cache_from" {
  params = [app]
  result = ["type=registry,ref=${image(app)}:buildcache"]
}

function "cache_to" {
  params = [app]
  result = ["type=registry,ref=${image(app)}:buildcache,mode=max"]
}

target "_common" {
  platforms = [PLATFORM]
  # Provenance attestations turn every push into a multi-manifest index, which
  # a plain `docker compose pull` on the host does not need.
  provenance = false
  labels = {
    "org.opencontainers.image.revision" = notequal(GIT_SHA, "") ? GIT_SHA : IMAGE_TAG
    "org.opencontainers.image.source"   = "https://github.com/${REPOSITORY}"
  }
}

target "server" {
  inherits   = ["_common"]
  context    = "./server"
  dockerfile = "Dockerfile"
  tags       = tags("server")
  cache-from = cache_from("server")
  cache-to   = cache_to("server")
}

target "web" {
  inherits   = ["_common"]
  context    = "./web"
  dockerfile = "Dockerfile"
  tags       = tags("web")
  cache-from = cache_from("web")
  cache-to   = cache_to("web")
}

target "webapp" {
  # Repository root: webapp generates its API client from the server's OpenAPI
  # spec, which lives outside webapp/.
  inherits   = ["_common"]
  context    = "."
  dockerfile = "webapp/Dockerfile"
  tags       = tags("webapp")
  cache-from = cache_from("webapp")
  cache-to   = cache_to("webapp")
}

group "default" {
  targets = ["server", "web", "webapp"]
}
