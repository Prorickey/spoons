"use client";

import { SessionProvider, useSession } from 'next-auth/react';
import NavBar from "@/app/navbar";
import { useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from 'next/image';
import { redirect } from 'next/navigation';

const containerStyle = {
  width: "100%",
  height: "700px",
};

const bounds = {
  right: -78.91885945368958,
  left: -78.92249652911377,
  top: 36.02159666152667,
  bottom: 36.017214435989516
}

const mapOptions = {
  disableDefaultUI: true, // Hides default controls (optional)
  /*styles: [ // This removes all the text and labels on the screen
    {
      featureType: "all",
      elementType: "labels",
      stylers: [{ visibility: "off" }], // Removes all labels
    },
  ],*/
};

const center = { lat: 36.018950, lng: -78.920737 };

function MyTarget() {

  const { data: session, update: update } = useSession()

  const [showContestForm, setContestForm] = useState(true)
  const [showKillForm, setShowKillForm] = useState<boolean>(false)
  const [mapCenter, setMapCenter] = useState(center);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState(center);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const center = mapRef.current?.getCenter();
      if(center) setMapCenter({ lat: center.lat(), lng: center.lng() });
      if(
        event.latLng.lat() > bounds.top ||
        event.latLng.lat() < bounds.bottom ||
        event.latLng.lng() > bounds.right ||
        event.latLng.lng() < bounds.left
      ) {
        setError("You can only kill people on campus. You cannot select a location off campus.")
      } else {
        setMarkerPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() });
        setError(null)
      }
    }
  };

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const submitKillClick = () => {
    if(!showKillForm) setShowKillForm(true);
  }

  const sendKillData = () => {
    if(!selectedDate) return setError("Please select date.");
    fetch("/api/submitKill", {
      method: "POST",
      body: JSON.stringify({
        date: selectedDate,
        lat: markerPosition.lat,
        lng: markerPosition.lng
      })
    }).then(r => {
      if(r.ok) {
        update()
        setShowKillForm(false)
        return null;
      }
      return r.text();
    }).then(r => setError(r))
  }

  const contestKill = () => {
    setContestForm(true)
  }

  const submitContestKill = () => {
    fetch("/api/contestKill", {
      method: "POST"
    }).then(r => {
      if(r.ok) {
        setContestForm(false)
        return null;
      }
      return r.text();
    }).then(r => setError(r))
  }

  // TODO: Enable referer restrictions before pushing to prod
  return (
    <main>
      <NavBar current={"mytarget"} />
      <div className="flex flex-row w-full p-10 pt-20 justify-center">
        <div className="flex flex-col w-5/6 lg:w-1/2 gap-y-4 justify-center">
          {
            session?.user.killed ?
              <>
                <p className="w-full text-5xl text-center">Killed By:
                  <span className="font-semibold"> {session?.user.killedByName}</span></p>
                <p className="text-center">Unfortunately, you have been killed in the game of spoons. If you disagree
                  with this outcome, you can <button onClick={contestKill}>
                    <span className="underline decoration-orange-500 decoration-2"> contest by clicking here</span>
                  </button>.
                </p>
              </>
              :
              <>
                <p className="w-full text-5xl text-center">Current Target:
                  <span className="font-semibold"> {session?.user.currentTargetName}</span></p>
                <button className="mx-auto w-1/2 p-5 bg-green-400 rounded-lg" onClick={submitKillClick}>
                  <p className="text-xl text-gray-900">Submit Kill</p>
                </button>
              </>
          }
        </div>
      </div>
      {
        showKillForm ?
          <div className="absolute top-0 w-full h-full bg-opacity-50 bg-black z-10">
            <div className="flex flex-row justify-center py-4">
              <div className="w-2/3 bg-opacity-100 bg-gray-700 p-5 rounded-md flex flex-row
               gap-x-4 z-20">
                <div className="w-1/2">
                  <LoadScript
                    googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={mapCenter}
                      zoom={17}
                      onClick={handleMapClick}
                      onLoad={onLoad}
                      options={mapOptions}
                    >
                      <Marker position={markerPosition} />
                    </GoogleMap>
                  </LoadScript>
                </div>
                <div className="w-1/2">
                  <p className="text-lg text-center">Please enter the following information
                    and indicate using the map on the left where the kill happened. </p>
                  {
                    error ?
                      <p className="text-lg text-center text-red-500">{error}</p> :
                      null
                  }
                  <div className="w-[90%] mx-auto bg-gray-400 h-[2px] my-5"></div>
                  <div className="flex flex-col">
                    <p className="text-lg py-2">Select the date and time: </p>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      showTimeSelect
                      timeFormat="h:mm aa"
                      timeIntervals={5}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="p-2 border rounded-md text-black w-1/2"
                    />
                    <div>
                      <button className="my-4 p-5 bg-green-400 rounded-lg" onClick={sendKillData}>
                        <p className="text-xl text-gray-900">Submit Kill</p>
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowKillForm(false)}
                  className="h-min">
                  <Image
                    src={'/close.svg'}
                    alt={'Close'}
                    height={32}
                    width={32}
                  />
                </button>
              </div>
            </div>
          </div> : null
      }
      {
        showContestForm ?
          <div className="absolute top-0 w-full h-full bg-opacity-50 bg-black z-10">
            <div className="flex flex-row justify-center py-4">
              <div className="w-2/3 bg-opacity-100 bg-gray-700 p-5 rounded-md flex flex-row
               gap-x-4 z-20">
                <div className="w-full">
                  <p>If this page displays that you were killed, but you in fact are still in the game, contesting
                  is your opportunity to report the wrong doing. Doing so will require the Spoonmaster to reach out
                  to you and the person targeting you to resolve the issue. Please ensure that the information in
                    the <button onClick={() => redirect("/account")}>
                      <span className="underline decoration-orange-500 decoration-2">account page
                      </span></button> is accurate,
                  including your phone number so that you can be contacted easily. </p>
                  <button className="my-4 p-5 bg-amber-400 rounded-lg" onClick={submitContestKill}>
                    <p className="text-xl text-gray-900">Contest Kill</p>
                  </button>
                </div>
                <button
                  onClick={() => setContestForm(false)}
                  className="h-min">
                  <Image
                    src={'/close.svg'}
                    alt={'Close'}
                    height={32}
                    width={32}
                  />
                </button>
              </div>
            </div>
          </div> : null
      }
    </main>
  )
}

export default function MyTargetWrapper() {
  return (
    <SessionProvider>
      <MyTarget />
    </SessionProvider>
  )
}

export enum gameState {
  PREGAME = "PREGAME",
  RUNNING = "RUNNING",
  POSTGAME = "POSTGAME"
}