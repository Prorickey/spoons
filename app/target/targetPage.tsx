"use client";

import { SessionProvider, useSession } from 'next-auth/react';
import NavBar, { NavbarProvider } from '@/app/navbar';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { SubmitKillPayload } from '@/app/api/submitKill/route';
import { Session } from 'next-auth';

const center = { lat: 36.018950, lng: -78.920737 };

function MyTarget() {

  const { data: session, update: update } = useSession()

  const [showKillForm, setShowKillForm] = useState<boolean>(false);
  const [victimId, setVictimId] = useState<string | null>(null);
  const [showContestForm, setContestForm] = useState(false);

  const [ffa, setFfa] = useState(false);

  useEffect(() => {
    fetch("/api/status").then(r => r.json()).then(r => {
      setFfa(r.ffa)
    })
  }, []);

  return (
    <LoadScript
      // TODO: Figure this out process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
      googleMapsApiKey={"AIzaSyBFAstnYDPsiKxxJR0IBsnPHK7NbKuxnTY"}>
      <main>
        <NavbarProvider>
          <NavBar current={'mytarget'} />
        </NavbarProvider>
        <div className="flex flex-row w-full p-10 pt-20 justify-center">
          <div className="flex flex-col w-5/6 lg:w-1/2 gap-y-4 justify-center">
            {
              session?.user.killed ?
                <KilledSection session={session} setContestForm={setContestForm} />
                :
                (
                  ffa ?
                    <FFATargetSection setShowKillForm={setShowKillForm} setVictimId={setVictimId} />
                    :
                    <TargetSection session={session} setShowKillForm={setShowKillForm} />
                )
            }
          </div>
        </div>
        { showKillForm && <KillForm update={update} setShowKillForm={setShowKillForm} ffa={ffa} victimId={victimId} /> }
        { showContestForm && <ContestForm setContestForm={setContestForm} /> }
      </main>
    </LoadScript>
  )
}

function ContestForm({ setContestForm }: { setContestForm: (show: boolean) => void }) {

  const submitContestKill = () => {
    fetch("/api/contestKill", {
      method: "POST"
    }).then(r => {
      if(r.ok) {
        setContestForm(false)
        return null;
      }
      return r.text();
    })
    redirect("/target")
  }

  return (
    <div className="absolute top-0 w-full h-full bg-opacity-50 bg-black z-10">
      <div className="flex flex-row justify-center py-4">
        <div className="w-2/3 bg-opacity-100 bg-gray-700 p-5 rounded-md flex flex-row
                 gap-x-4 z-20">
          <div className="w-full">
            <p>If this page displays that you were killed, but you in fact are still in the game, contesting
              is your opportunity to report the wrong doing. Doing so will require the Spoonmaster to reach out
              to you and the person targeting you to resolve the issue. Please ensure that the information in
              the <button onClick={() => redirect('/account')}>
                        <span className="underline decoration-orange-500 decoration-2">account page
                        </span></button> is accurate,
              including your phone number so that you can be contacted easily.
            </p>
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
    </div>
  )
}

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

function KillForm({ update, setShowKillForm, ffa, victimId }: { update: () => void, setShowKillForm: (show: boolean) => void, ffa: boolean, victimId: string | null }) {

  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [verifyName, setVerifyName] = useState('');
  const mapRef = useRef<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState(center);

  const verificationTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setVerifyName(event.target.value);
  };

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const center = mapRef.current?.getCenter();
      if (center) setMapCenter({ lat: center.lat(), lng: center.lng() });
      if (
        event.latLng.lat() > bounds.top ||
        event.latLng.lat() < bounds.bottom ||
        event.latLng.lng() > bounds.right ||
        event.latLng.lng() < bounds.left
      ) {
        setError('You can only kill people on campus. You cannot select a location off campus.');
      } else {
        setMarkerPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() });
        setError(null);
      }
    }
  };

  const sendKillData = () => {
    if (!selectedDate) return setError('Please select date.');
    const data: SubmitKillPayload = {
      date: selectedDate,
      lat: markerPosition.lat,
      lng: markerPosition.lng,
      verificationName: ffa ? '' : verifyName,
      victimId: ffa ? victimId : null
    };

    fetch('/api/submitKill', {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(r => {
      if(r.ok) {
        update()
        setShowKillForm(false)
        return null;
      }
      return r.text();
    })
      .then(r => setError(r))
      .then(() => redirect("/target"))
  }

  return (
    <div className="absolute top-0 w-full h-full bg-opacity-50 bg-black z-10">
      <div className="flex flex-row justify-center py-4">
        <div className="w-full mx-2 lg:w-2/3 lg:mx-0 bg-opacity-100 bg-gray-700 p-5 rounded-md flex flex-row
                 gap-x-4 z-20">
          <div className="flex flex-col lg:flex-row w-full gap-x-4">
            <div className="w-full lg:w-1/2">
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
            </div>
            <div className="w-full pt-4 lg:w-1/2 lg:pt-0">
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
                  className="p-2 bg-gray-300 border rounded-md text-black w-full lg:w-1/2"
                />
                {
                  !ffa &&
                  <>
                    <p className="text-lg py-2">Enter the full name of your next target: </p>
                    <textarea
                      id={'verification'}
                      placeholder={'Trevor Bedson...'}
                      onChange={verificationTextChange}
                      className="h-6 bg-gray-300 text-black resize-none px-2 rounded-md" />
                  </>
                }
                <div>
                  <button className="my-4 p-5 bg-green-400 rounded-lg" onClick={sendKillData}>
                    <p className="text-xl text-gray-900">Submit Kill</p>
                  </button>
                </div>
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
    </div>
  )
}

function KilledSection({ session, setContestForm }: { session: Session | null, setContestForm: (show: boolean) => void }) {

  const contestKill = () => {
    setContestForm(true);
  };

  const submitApproveKill = () => {
    fetch('/api/approveKill', {
      method: 'POST',
    }).then(r => {
      if (r.ok) {
        setContestForm(false);
        return null;
      }
      return r.text();
    });
    redirect('/target');
  };

  return (
    <>
      <p className="w-full text-5xl text-center">Killed By:
        <span className="font-semibold"> {session?.user.killedByName}</span></p>
      {
        session?.user.approvedKill ?
          <p className="text-center text-lg">You have been killed in the game of spoons. The kill has been
            approved and you are out of the game. </p>
          :
          (session?.user.contesting ?
            <p className="text-center text-lg">Unfortunately, you have been killed in the game of spoons. You have
              already submitted a request to contest and will be contacted shortly about that. If
              the kill is correct, please <button onClick={submitApproveKill}>
                <span className="underline decoration-green-600 decoration-2">click here to approve the kill</span>
              </button>.
            </p>
            :
            <p className="text-center text-lg">Unfortunately, you have been killed in the game of spoons. If you
              disagree
              with this outcome, you can <button onClick={contestKill}>
                <span className="underline decoration-orange-500 decoration-2"> contest by clicking here</span>
              </button>. If this is correct, please <button onClick={submitApproveKill}>
                <span className="underline decoration-green-600 decoration-2">click here to approve the kill</span>
              </button>.
            </p>)
      }
    </>
  );
}

function TargetSection({ session, setShowKillForm }: { session: Session | null, setShowKillForm: (show: boolean) => void }) {

  return (
    <>
      <p className="w-full text-5xl text-center">Current Target:
        <span className="font-semibold"> {session?.user.currentTargetName}</span></p>
      <button className="mx-auto w-1/2 p-5 bg-green-400 rounded-lg" onClick={() => setShowKillForm(true)}>
        <p className="text-xl text-gray-900">Submit Kill</p>
      </button>
    </>
  );
}

function FFATargetSection({ setShowKillForm, setVictimId }: { setShowKillForm: (show: boolean) => void, setVictimId: (id: string) => void }) {

  const [chopping, setChopping] = useState<{ firstName: string, lastName: string, id: number }[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/choppingBlock').then(r => r.json()).then(r => {
      setChopping(r);
    });
  }, []);

  return (
    <>
      <p className="w-full text-5xl text-center">Submit Kill:</p>
      <div className="p-4">
        <label htmlFor="player-select" className="block text-lg font-semibold mb-2">
          Select a Player:
        </label>
        <select
          id="player-select"
          className="border rounded px-4 py-2 w-full bg-stone-700"
          value={selectedPlayer || ""}
          onChange={(e) => {
            setSelectedPlayer(e.target.value)
            setVictimId(e.target.value)
            setError(null)
          }}
        >
          <option value="">Choose a player</option>
          {chopping.map((player) => (
            <option key={player.id} value={player.id}>
              {player.firstName} {player.lastName}
            </option>
          ))}
        </select>

        { error && <div className="mt-2 text-red-500 text-center">{error}</div> }

        <div className="flex flex-row justify-center">
          <button
            onClick={() => setShowKillForm(true)}
            className={`w-1/2 mx-auto mt-4 p-5 rounded-lg ${selectedPlayer ? 'bg-green-400' : 'border-2 border-gray-400'}`}>
            <p className={`text-xl ${selectedPlayer ? 'text-gray-900' : 'text-white'}`}>Submit Kill</p>
          </button>
        </div>
      </div>
    </>
  )
}

export default function MyTargetWrapper() {
  return (
    <SessionProvider>
      <MyTarget />
    </SessionProvider>
  )
}