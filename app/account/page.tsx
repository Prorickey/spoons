"use client";

import {SessionProvider, useSession} from "next-auth/react";
import NavBar from "@/app/navbar";
import {redirect} from "next/navigation";
import Select from "react-select"
import {useRef, useState} from "react";

function AccountPage() {

  const { data: session, status } = useSession()

  if (status === "unauthenticated") redirect("/auth/signin")

  const [stateReloadKey, setStateReloadKey] = useState(0);
  const reloadComponent = () => setStateReloadKey(prevState => prevState+1);

  const [highlightMissing, setHighlightMissing] = useState(true)

  const nicknameta = useRef<HTMLTextAreaElement | null>(null)
  const firstNameta = useRef<HTMLTextAreaElement | null>(null)
  const lastNameta = useRef<HTMLTextAreaElement | null>(null)
  const phoneta = useRef<HTMLTextAreaElement | null>(null)

  const [hallId, setHallId] = useState<string | null>(null)
  const [grade, setGrade] = useState<string | null>(null)

  const saveSubmit = () => {

  }

  return (
    <>
      <NavBar current={"account"} />
      <div className="flex flex-row justify-center h-full">
        <div className="bg-stone-800 w-1/2 h-min rounded-2xl flex flex-col mt-20 p-5 pb-10">
          <h1 className="text-4xl text-center font-semibold pt-5 pb-3">Account Information</h1>
          {
            session?.user["firstName"] == null ? (
              <p className="px-24 w-full pb-5 text-center">
                You are <span className="underline decoration-red-600 decoration-2">not currently
                enrolled</span> in Spoons. In order to enroll,
                fill out the information below and click save.
              </p>
            ) : (
              <p className="px-24 w-full pb-5 text-center">You are enrolled in
                Spoons. You may wait for the game to begin.</p>
            )
          }
          <div className="flex flex-row gap-x-2">
            <div className="bg-stone-800 w-1/2 h-2/3 rounded-2xl flex flex-col px-5 gap-y-4">
              <div>
                <p>Nickname/Alias</p>
                <textarea
                  id="nickname"
                  ref={nicknameta}
                  maxLength={20}
                  onChange={reloadComponent}
                  className={"bg-stone-700 resize-none w-full " +
                    "h-6 rounded-md px-2 " +
                    (highlightMissing && nicknameta.current?.value == "" ?
                      "border border-[1px] border-red-500 h-7" : "")} />
              </div>
              <div>
                <p>First Name</p>
                <textarea
                  id="firstName"
                  maxLength={100}
                  ref={firstNameta}
                  onChange={reloadComponent}
                  className={"bg-stone-700 resize-none w-full h-6 rounded-md px-2 " +
                    (highlightMissing && firstNameta.current?.value == "" ?
                      "border border-[1px] border-red-500 h-7" : "")}/>
              </div>
              <div>
                <p>Last Name</p>
                <textarea
                  id="lastName"
                  maxLength={100}
                  ref={lastNameta}
                  onChange={reloadComponent}
                  className={"bg-stone-700 resize-none w-full h-6 rounded-md px-2 " +
                    (highlightMissing && lastNameta.current?.value == "" ?
                    "border border-[1px] border-red-500 h-7" : "")}/>
              </div>
              <div className="flex flex-row gap-x-2">
                <button>
                  <div className="bg-blue-500 w-min px-2 py-1 rounded-md">
                    <p className="text-left text-xl">Save</p>
                  </div>
                </button>
                <button>
                  <div className="bg-red-500 w-min px-2 py-1 rounded-md">
                    <p className="text-left text-xl">Clear</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="px-5 w-1/2">
              <div>
                <p>Phone Number</p>
                <textarea
                  id="phone"
                  maxLength={20}
                  ref={phoneta}
                  onChange={reloadComponent}
                  className={"bg-stone-700 resize-none h-6 rounded-md px-2 w-full " +
                    (highlightMissing && phoneta.current?.value == "" ?
                      "border border-[1px] border-red-500 h-7" : "")}/>
              </div>
              <div className="py-2">
                <p>Residence Hall</p>
                <Select
                  onChange={(selectedOption) => {
                    if(selectedOption) setHallId(selectedOption.value);
                  }}
                  styles={{
                  control: (styles) => {
                    if(highlightMissing && hallId == null) {
                      return ({
                        ...styles,
                        backgroundColor: '#44403c',
                        border: '1px solid rgb(239 68 68)'
                      })
                    } else return ({
                      ...styles,
                      backgroundColor: '#44403c'
                    })
                  },
                  menu: (styles) => ({
                    ...styles,
                    backgroundColor: '#44403c'
                  }),
                  option: (styles) => ({
                    ...styles,
                    backgroundColor: '#44403c'
                  }),
                  singleValue: (styles) => ({
                    ...styles,
                    color: "#fff"
                  })
                }}
                        options={[
                          {value: '1H', label: 'First Hunt'},
                          {value: '2WH', label: 'Second West Hunt'},
                          {value: '2EH', label: 'Second East Hunt'},
                          {value: '3WH', label: 'Third West Hunt'},
                          {value: '3EH', label: 'Third East Hunt'},
                          {value: '4WH', label: 'Fourth West Hunt'},
                          {value: '4EH', label: 'Fourth East Hunt'},
                          {value: '1HI', label: 'First Hill'},
                          {value: '2HI', label: 'Second Hill'},
                          {value: "2BR", label: "Second Bryan"},
                          {value: "3BR", label: 'Third Bryan'},
                          {value: "4BR", label: 'Fourth Bryan'},
                          {value: "1BE", label: 'First Beall'},
                          {value: "2BE", label: 'Second Beall'},
                          {value: "3BE", label: 'Third Beall'},
                          {value: "RE1", label: 'Ground Reynolds'},
                          {value: "RE2", label: "Reynolds 1C2C1D"},
                          {value: "RE3", label: "Reynolds 1E2E2D"},
                          {value: "RO", label: "Royal"}
                        ]}/>
              </div>
              <div>
                <p>Grade</p>
                <Select
                  onChange={(selectedOption) => {
                    if(selectedOption) setGrade(selectedOption.value);
                  }}
                  styles={{
                  control: (styles) => {
                    if(highlightMissing && grade == null) {
                      return ({
                        ...styles,
                        backgroundColor: '#44403c',
                        border: '1px solid rgb(239 68 68)'
                      })
                    } else return ({
                      ...styles,
                      backgroundColor: '#44403c'
                    })
                  },
                  menu: (styles) => ({
                    ...styles,
                    backgroundColor: '#44403c'
                  }),
                  option: (styles) => ({
                    ...styles,
                    backgroundColor: '#44403c'
                  }),
                  singleValue: (styles) => ({
                    ...styles,
                    color: "#fff"
                  })
                }}
                        options={[
                          {value: 'S', label: 'Senior'},
                          {value: 'J', label: 'Junior'}
                        ]}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Wrapper() {
  return (
    <SessionProvider>
      <AccountPage/>
    </SessionProvider>
  )
}