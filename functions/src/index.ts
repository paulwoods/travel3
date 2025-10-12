import {HttpsError, onCall, onRequest} from "firebase-functions/v2/https";
import {initializeApp} from "firebase-admin/app";

// Initialize Admin SDK once per instance
initializeApp();

// Simple HTTP function for sanity checks
export const hello = onRequest({cors: true, region: "us-central1"}, (req, res) => {
    res.status(200).send({message: "Hello from Firebase Functions!"});
});

// Placeholder callable function for future route optimization
// Expected input: { stops: Array<{ lat: number, lng: number } | string> }
export const optimizeRoute = onCall({cors: true, region: "us-central1"}, (request) => {
    const data = request.data ?? {};
    const stops = data.stops;

    if (!Array.isArray(stops) || stops.length < 2) {
        throw new HttpsError(
            "invalid-argument",
            "`stops` must be an array with at least 2 items."
        );
    }

    // For now, just echo back a placeholder response.
    // In Phase 4, this will call Google Directions API and compute an optimized order.
    return {
        ok: true,
        count: stops.length,
        note: "Optimization not implemented yet. This is a stub.",
    };
});
