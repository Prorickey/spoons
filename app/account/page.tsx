"use client";

import {SessionProvider, useSession} from "next-auth/react";
import NavBar from "@/app/navbar";
import {redirect} from "next/navigation";
import Select from "react-select"
import {useEffect, useState} from "react";
import {AccountUpdate} from "@/app/api/updateAccount/route";
import {halls} from "@/app/api/auth/[...nextauth]/halls";

function AccountPage() {

  const { data: session, status } = useSession()

  if (status === "unauthenticated") redirect("/auth/signin")

  const [highlightMissing, setHighlightMissing] = useState(false)

  const [nickname, setNickname] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [hallId, setHallId] = useState<string | null>(null)
  const [grade, setGrade] = useState<string | null>(null)

  useEffect(() => {
    if(session?.user["firstName"] != null) {
      setNickname(session.user.firstName);
      setFirstName(session.user.firstName);
      setLastName(session.user.lastName);
      setPhone(session.user.phone);
      setGrade(session.user.grade);
      setHallId(session.user.hallId);
    }
  }, [session, nickname, firstName, lastName, phone, grade, hallId]);

  const saveSubmit = () => {
    setHighlightMissing(true)

    if(nickname == "" || firstName == "" || lastName == "" ||
      phone == "" || !hallId || !grade) return

    const data: AccountUpdate = {
      nickname: nickname,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      hallId: hallId,
      grade: grade
    }

    fetch("/api/updateAccount", {
      method: "POST",
      body: JSON.stringify(data)
    })
  }

  const clearFields = () => {
    setHighlightMissing(false)

    setNickname("")
    setFirstName("")
    setLastName("")
    setPhone("")
    setHallId(null)
    setGrade(null)
  }

  return (
    <>
      <NavBar current={"updateAccount"} />
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
                  maxLength={20}
                  onChange={(event) => setNickname(event.target.value)}
                  value={nickname}
                  className={"bg-stone-700 resize-none w-full " +
                    "h-6 rounded-md px-2 " +
                    (highlightMissing && nickname == "" ?
                      "border border-[1px] border-red-500 h-7" : "")} />
              </div>
              <div>
                <p>First Name</p>
                <textarea
                  id="firstName"
                  maxLength={100}
                  onChange={(event) => setFirstName(event.target.value)}
                  value={firstName}
                  className={"bg-stone-700 resize-none w-full h-6 rounded-md px-2 " +
                    (highlightMissing && firstName == "" ?
                      "border border-[1px] border-red-500 h-7" : "")}/>
              </div>
              <div>
                <p>Last Name</p>
                <textarea
                  id="lastName"
                  maxLength={100}
                  onChange={(event) => setLastName(event.target.value)}
                  value={lastName}
                  className={"bg-stone-700 resize-none w-full h-6 rounded-md px-2 " +
                    (highlightMissing && lastName == "" ?
                    "border border-[1px] border-red-500 h-7" : "")}/>
              </div>
              <div className="flex flex-row gap-x-2">
                <button onClick={saveSubmit}>
                  <div className="bg-blue-500 w-min px-2 py-1 rounded-md">
                    <p className="text-left text-xl">Save</p>
                  </div>
                </button>
                <button onClick={clearFields}>
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
                  onChange={(event) => setPhone(event.target.value)}
                  value={phone}
                  className={"bg-stone-700 resize-none h-6 rounded-md px-2 w-full " +
                    (highlightMissing && phone == "" ?
                      "border border-[1px] border-red-500 h-7" : "")}/>
              </div>
              <div className="py-2">
                <p>Residence Hall</p>
                <Select
                  value={
                  hallId != null ? {
                    value: hallId,
                    label: halls.find(d => d.value == hallId)?.label
                  } : null}
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
                  options={halls}
                />
              </div>
              <div>
                <p>Grade</p>
                <Select
                  value={
                    grade != null ? {
                      value: grade,
                      label: grade == "S" ? "Senior" : "Junior"
                    } : null}
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