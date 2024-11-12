// Component.tsx
"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase"; // Importa la instancia de Supabase configurada
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Mail, User } from "lucide-react";

export default function Component() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [seller, setSeller] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

        // Validación
       if (!code || !email || !seller) {
         setErrorMessage("Todos los campos son obligatorios.");
         setIsSubmitting(false);
         return;
       }

       if (!/^[A-Z0-9-]{9}$/.test(code)) {
         setErrorMessage("Formato de código inválido. Debe tener 9 caracteres alfanuméricos o incluir '-'.");
         setIsSubmitting(false);
         return;
       }

       if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         setErrorMessage("Formato de email inválido.");
         setIsSubmitting(false);
         return;
       }

   try {
      // Consulta a Supabase
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("code", code)
        .single();

      if (error) throw error;

      if (!data) {
        setErrorMessage("No se encontró una coincidencia para el email y código proporcionados.");
      } else if (data.seller) {
        setErrorMessage("Este email y código ya tienen un vendedor asignado.");
      } else {
        // Actualizar la columna seller
        const { error: updateError } = await supabase
          .from("users")
          .update({ seller: seller })
          .eq("email", email)
          .eq("code", code);

        if (updateError) throw updateError;

        setSuccessMessage("Validación exitosa. Bienvenido al Despertar.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Ocurrió un error durante la validación. Por favor, inténtelo de nuevo.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#001a00] text-[#33ff33] p-4">
      <div className="w-full max-w-md">
        <div className="border-4 border-[#33ff33] p-8 rounded-lg relative">
          <div className="absolute top-0 left-0 p-2 text-xs font-mono">SISTEMA v2.4.1</div>
          <div className="absolute top-0 right-0 p-2 text-xs font-mono">CONEXIÓN SEGURA</div>

          <h1 className="text-3xl font-bold mb-6 text-center font-mono glitch-effect" data-text="SE REQUIERE VALIDACIÓN">
            SE REQUIERE VALIDACIÓN
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm font-mono">CÓDIGO DE ACCESO</Label>
              <div className="relative">
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="pl-10 bg-[#001a00] border-[#33ff33] text-[#33ff33] placeholder-[#33ff33]/50 font-mono uppercase"
                  placeholder="INGRESE CÓDIGO"
                  maxLength={9}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#33ff33]" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-mono">CORREO ELECTRÓNICO</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-[#001a00] border-[#33ff33] text-[#33ff33] placeholder-[#33ff33]/50 font-mono"
                  placeholder="INGRESE CORREO"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#33ff33]" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seller" className="text-sm font-mono">IDENTIFICACIÓN DEL VENDEDOR</Label>
              <div className="relative">
                <Input
                  id="seller"
                  type="text"
                  value={seller}
                  onChange={(e) => setSeller(e.target.value)}
                  className="pl-10 bg-[#001a00] border-[#33ff33] text-[#33ff33] placeholder-[#33ff33]/50 font-mono"
                  placeholder="INGRESE NOMBRE DEL VENDEDOR"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#33ff33]" />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#33ff33] text-[#001a00] hover:bg-[#66ff66] disabled:opacity-50 font-mono border border-[#33ff33]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  VALIDANDO...
                </>
              ) : (
                "INICIAR VALIDACIÓN"
              )}
            </Button>
          </form>

          {errorMessage && (
            <p className="mt-4 text-red-500 text-sm font-mono">{errorMessage}</p>
          )}

          {successMessage && (
            <p className="mt-4 text-[#33ff33] text-sm font-mono">{successMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}