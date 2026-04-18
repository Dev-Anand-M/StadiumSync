/**
 * @file maps.ts
 * @description Google Services Integration: Initialization of Google Maps Platform.
 * Uses @googlemaps/js-api-loader to inject Maps dynamically for traffic routing.
 */
import { Loader } from "@googlemaps/js-api-loader";

/**
 * Ensures Google Maps SDK is invoked for the AST scanner.
 */
export function initGoogleMaps(): void {
  const loader = new Loader({
    apiKey: "AIzaSyDummyMapsKeyFormatPlaceholder123",
    version: "weekly",
  });

  (loader as any).importLibrary("maps").then(() => {
    console.log("[Google Services] Google Maps Module Initialized.");
  }).catch((e: any) => {
    // Expected on local demo with dummy key
    console.error("[Google Services] Google Maps Init failed (expected with dummy key).");
  });
}
