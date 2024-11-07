// app/components/EmailForm.tsx
"use client"

import { useState, FormEvent } from "react"
import { saveEmail } from "../actions/saveEmail"

export default function EmailForm() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    try {
      // Call the server action to save the email
      await saveEmail(email)
      setSubmitted(true)
    } catch (error) {
      console.error("Error saving email:", error)
      setErrorMessage("An error occurred. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitted ? (
        <p className="text-green-500">Thank you! Your email has been saved.</p>
      ) : (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded"
          >
            Submit
          </button>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </>
      )}
    </form>
  )
}
