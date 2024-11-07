// app/actions/saveEmail.ts
import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Function to generate a unique alphanumeric code in the format "xxxx-xxxx"
const generateUniqueCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const code = Array.from({ length: 8 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("")
  return `${code.slice(0, 4)}-${code.slice(4)}`
}

export const saveEmail = async (email: string) => {
  const code = generateUniqueCode()

  // Insert the email and unique code into Supabase
  const { data, error } = await supabase
    .from("users")
    .insert({ email, code })
    .single()

  if (error) {
    throw new Error("Failed to save email to database")
  }

  // Revalidate the path if needed
  revalidatePath('/')

  return data
}
