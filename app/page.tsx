"use client";

import { useState } from "react";

type EventChoice = "civile" | "chateau" | "les-deux";

export default function RSVPPage() {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [eventChoice, setEventChoice] = useState<EventChoice | null>(null);
  const [plusOne, setPlusOne] = useState(false);
  const [plusOneName, setPlusOneName] = useState("");
  const [nombreEnfants, setNombreEnfants] = useState(0);

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!prenom.trim() || !nom.trim()) {
      setError("Le prénom et le nom sont requis.");
      return;
    }
    if (!eventChoice) {
      setError("Veuillez sélectionner un événement.");
      return;
    }

    const ceremonieCivile =
      eventChoice === "civile" || eventChoice === "les-deux";
    const receptionChateau =
      eventChoice === "chateau" || eventChoice === "les-deux";

    setSubmitting(true);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom: prenom.trim(),
          nom: nom.trim(),
          email: email.trim() || null,
          telephone: telephone.trim() || null,
          ceremonie_civile: ceremonieCivile,
          reception_chateau: receptionChateau,
          plus_one: plusOne,
          plus_one_nom: plusOne ? plusOneName.trim() || null : null,
          nombre_enfants_mairie: nombreEnfants,
          message: message.trim() || null,
        }),
      });

      setSubmitting(false);

      if (!res.ok) {
        setError("Une erreur est survenue. Veuillez réessayer.");
        return;
      }
    } catch {
      setSubmitting(false);
      setError("Une erreur est survenue. Veuillez réessayer.");
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center animate-fade-in-up">
          <div className="animate-scale-in mb-8">
            <svg
              className="w-24 h-24 mx-auto text-sage"
              viewBox="0 0 52 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="26"
                cy="26"
                r="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                opacity="0.3"
              />
              <path
                d="M15 27 L22 34 L37 19"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="animate-checkmark"
              />
            </svg>
          </div>
          <h2 className="font-script text-4xl md:text-5xl text-sage mb-4">
            Merci !
          </h2>
          <p className="font-serif text-xl text-charcoal/80 mb-2">
            Votre réponse a bien été enregistrée.
          </p>
          <p className="font-serif text-lg text-charcoal/60">
            Nous avons hâte de célébrer ce jour avec vous.
          </p>
          <div className="mt-8 text-sage/50 leaf-separator"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <p className="text-sage uppercase tracking-[0.3em] text-sm mb-4 font-serif">
            Nous nous marions
          </p>
          <h1 className="font-script text-5xl md:text-6xl text-sage mb-2">
            Johan
          </h1>
          <p className="text-gold text-2xl font-serif">&amp;</p>
          <h1 className="font-script text-5xl md:text-6xl text-sage mb-6">
            Camille
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px w-16 bg-gold/40"></span>
            <span className="text-sage/50 leaf-separator"></span>
            <span className="h-px w-16 bg-gold/40"></span>
          </div>
          <p className="font-serif text-lg text-charcoal/70">
            Merci de confirmer votre présence
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Prénom & Nom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal/70 mb-1">
                Prénom <span className="text-gold">*</span>
              </label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-sage/30 rounded-lg font-serif text-charcoal focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/30 transition-colors"
                placeholder="Votre prénom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal/70 mb-1">
                Nom <span className="text-gold">*</span>
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-sage/30 rounded-lg font-serif text-charcoal focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/30 transition-colors"
                placeholder="Votre nom"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-charcoal/70 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-sage/30 rounded-lg font-serif text-charcoal focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/30 transition-colors"
              placeholder="votre@email.com"
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-charcoal/70 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-sage/30 rounded-lg font-serif text-charcoal focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/30 transition-colors"
              placeholder="06 12 34 56 78"
            />
          </div>

          {/* Événement */}
          <fieldset>
            <legend className="block text-sm font-medium text-charcoal/70 mb-3">
              Événement(s) <span className="text-gold">*</span>
            </legend>
            <div className="space-y-3">
              {[
                { value: "civile" as EventChoice, label: "Cérémonie civile" },
                { value: "chateau" as EventChoice, label: "Réception au château" },
                { value: "les-deux" as EventChoice, label: "Les deux" },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    eventChoice === option.value
                      ? "border-sage bg-sage-light/50"
                      : "border-sage/20 hover:border-sage/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="event"
                    value={option.value}
                    checked={eventChoice === option.value}
                    onChange={() => setEventChoice(option.value)}
                    className="w-4 h-4 accent-sage"
                  />
                  <span className="font-serif text-charcoal">
                    {option.label}
                  </span>
                  {option.value === "les-deux" && (
                    <span className="text-xs text-charcoal/50 ml-auto">
                      Civile + Château
                    </span>
                  )}
                </label>
              ))}
            </div>
          </fieldset>

          {/* +1 */}
          <div>
            <label
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                plusOne
                  ? "border-sage bg-sage-light/50"
                  : "border-sage/20 hover:border-sage/40"
              }`}
            >
              <input
                type="checkbox"
                checked={plusOne}
                onChange={(e) => {
                  setPlusOne(e.target.checked);
                  if (!e.target.checked) setPlusOneName("");
                }}
                className="w-4 h-4 accent-sage"
              />
              <span className="font-serif text-charcoal">
                Avez-vous un +1 ?
              </span>
            </label>
            {plusOne && (
              <input
                type="text"
                value={plusOneName}
                onChange={(e) => setPlusOneName(e.target.value)}
                className="w-full mt-3 px-4 py-3 bg-white border border-sage/30 rounded-lg font-serif text-charcoal focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/30 transition-colors"
                placeholder="Prénom et nom de votre +1"
              />
            )}
          </div>

          {/* Nombre d'enfants mairie */}
          <div>
            <label className="block text-sm font-medium text-charcoal/70 mb-1">
              Nombre d&apos;enfants pour la mairie
            </label>
            <select
              value={nombreEnfants}
              onChange={(e) => setNombreEnfants(parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-white border border-sage/30 rounded-lg font-serif text-charcoal focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/30 transition-colors"
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n === 0 ? "Aucun" : n}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-charcoal/70 mb-1">
              Un petit mot pour les mariés
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-white border border-sage/30 rounded-lg font-serif text-charcoal focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/30 transition-colors resize-none"
              placeholder="Votre message..."
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-sm font-serif text-center">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-sage text-white font-serif text-lg rounded-lg hover:bg-sage-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Envoi en cours..." : "Confirmer ma présence"}
          </button>
        </form>

        {/* Footer */}
        <footer className="text-center mt-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="h-px w-12 bg-gold/30"></span>
            <span className="text-sage/40 leaf-separator"></span>
            <span className="h-px w-12 bg-gold/30"></span>
          </div>
          <p className="text-sm text-charcoal/40 font-serif">
            Johan &amp; Camille
          </p>
        </footer>
      </div>
    </main>
  );
}
