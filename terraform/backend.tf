terraform {
  backend "gcs" {
    bucket = "pixelgate-tf-state"
    prefix = "pixelgate/state"
  }
}
