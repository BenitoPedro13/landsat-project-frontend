"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapContainer, TileLayer, ImageOverlay } from "react-leaflet";
import L from "leaflet";
import * as GeoTIFF from "geotiff";
import "leaflet/dist/leaflet.css";

const MapComponent = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const fetchGeoTIFF = async () => {
      const response = await fetch(
        "http://localhost:3001/s3/get-geotiff-stream/collection02/level-1/standard/etm/1999/001/027/LE07_L1GT_001027_19991201_20200918_02_T2/LE07_L1GT_001027_19991201_20200918_02_T2_B1.TIF"
      ); // Replace with your API endpoint

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer(); // Get the ArrayBuffer directly from the response

        // Use geotiff.js to read the GeoTIFF
        const geoTiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
        const image = await geoTiff.getImage();
        const rasterData = await image.readRasters(); // This will be a TypedArray
        const imgWidth = image.getWidth();
        const imgHeight = image.getHeight();

        // Log the raster data and dimensions
        console.log("Raster data:", rasterData);
        console.log("Width:", imgWidth);
        console.log("Height:", imgHeight);

        // Flatten rasterData if it contains multiple arrays
        const flattenedData = rasterData[0] as Uint8Array; // Assuming single-band image. Adjust accordingly.

        // Convert raster data to a Blob
        const blob = new Blob([flattenedData], { type: "image/tiff" });
        const url = URL.createObjectURL(blob);

        console.log(url);

        // Set the image URL after creating the Blob
        setImageUrl(url);

        // Set dimensions
        setWidth(imgWidth);
        setHeight(imgHeight);

        // Set bounds based on your image dimensions
        setBounds(L.latLngBounds([0, 0], [imgHeight, imgWidth]));
      } else {
        console.error("Failed to fetch GeoTIFF:", response.statusText);
      }
    };

    fetchGeoTIFF();
  }, []);

  if (!imageUrl || !bounds) {
    return <div>Loading...</div>;
  }

  return (
    <MapContainer
      center={[height / 2, width / 2]}
      zoom={3}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ImageOverlay url={imageUrl} bounds={bounds} />
    </MapContainer>
  );
};

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });
