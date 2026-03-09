"use client";

import { useState, useEffect, useCallback } from "react";

type RSVPResponse = {
  id: string;
  prenom: string;
  nom: string;
  email: string | null;
  telephone: string | null;
  ceremonie_civile: boolean;
  reception_chateau: boolean;
  plus_one: boolean;
  plus_one_nom: string | null;
  nombre_enfants_mairie: number;
  message: string | null;
  created_at: string;
};

type Filter = "tous" | "civile" | "chateau" | "les-deux";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>("tous");
  const [storedPassword, setStoredPassword] = useState("");

  const fetchRsvps = useCallback(async (pwd: string) => {
    setLoading(true);
    const res = await fetch("/api/admin/rsvps", {
      headers: { "x-admin-password": pwd },
    });
    if (res.ok) {
      const data = await res.json();
      setRsvps(data);
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setAuthenticated(true);
      setStoredPassword(password);
    } else {
      setAuthError("Mot de passe incorrect");
    }
  };

  useEffect(() => {
    if (authenticated && storedPassword) {
      fetchRsvps(storedPassword);
    }
  }, [authenticated, storedPassword, fetchRsvps]);

  const filtered = rsvps.filter((r) => {
    if (filter === "civile") return r.ceremonie_civile && !r.reception_chateau;
    if (filter === "chateau") return r.reception_chateau && !r.ceremonie_civile;
    if (filter === "les-deux") return r.ceremonie_civile && r.reception_chateau;
    return true;
  });

  const totalCivile = rsvps.filter((r) => r.ceremonie_civile).length;
  const totalChateau = rsvps.filter((r) => r.reception_chateau).length;
  const totalPlusOnes = rsvps.filter((r) => r.plus_one).length;

  const exportCSV = () => {
    const headers = [
      "Prénom",
      "Nom",
      "Email",
      "Téléphone",
      "Cérémonie civile",
      "Réception château",
      "+1",
      "Nom +1",
      "Enfants mairie",
      "Message",
      "Date",
    ];

    const rows = filtered.map((r) => [
      r.prenom,
      r.nom,
      r.email || "",
      r.telephone || "",
      r.ceremonie_civile ? "Oui" : "Non",
      r.reception_chateau ? "Oui" : "Non",
      r.plus_one ? "Oui" : "Non",
      r.plus_one_nom || "",
      r.nombre_enfants_mairie.toString(),
      r.message || "",
      new Date(r.created_at).toLocaleDateString("fr-FR"),
    ]);

    const csvContent =
      "\uFEFF" +
      [headers, ...rows]
        .map((row) =>
          row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rsvp-mariage-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Login screen
  if (!authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="font-script text-4xl text-sage text-center mb-8">
            Admin
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full px-4 py-3 bg-white border border-sage/30 rounded-lg font-serif text-charcoal focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/30 transition-colors"
            />
            {authError && (
              <p className="text-red-600 text-sm text-center font-serif">
                {authError}
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-sage text-white font-serif rounded-lg hover:bg-sage-dark transition-colors"
            >
              Se connecter
            </button>
          </form>
        </div>
      </main>
    );
  }

  // Dashboard
  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="font-script text-4xl text-sage">
            Réponses RSVP
          </h1>
          <button
            onClick={exportCSV}
            className="px-6 py-2 bg-gold text-white font-serif rounded-lg hover:bg-gold-dark transition-colors text-sm"
          >
            Exporter CSV
          </button>
        </div>

        {/* Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border border-sage/20 text-center">
            <p className="text-3xl font-semibold text-sage">{rsvps.length}</p>
            <p className="text-sm text-charcoal/60 font-serif">
              Total réponses
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-sage/20 text-center">
            <p className="text-3xl font-semibold text-sage">{totalCivile}</p>
            <p className="text-sm text-charcoal/60 font-serif">
              Cérémonie civile
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-sage/20 text-center">
            <p className="text-3xl font-semibold text-sage">{totalChateau}</p>
            <p className="text-sm text-charcoal/60 font-serif">
              Réception château
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-sage/20 text-center">
            <p className="text-3xl font-semibold text-sage">{totalPlusOnes}</p>
            <p className="text-sm text-charcoal/60 font-serif">
              +1 confirmés
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(
            [
              { value: "tous", label: "Tous" },
              { value: "civile", label: "Civile uniquement" },
              { value: "chateau", label: "Château uniquement" },
              { value: "les-deux", label: "Les deux" },
            ] as { value: Filter; label: string }[]
          ).map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg font-serif text-sm transition-colors ${
                filter === f.value
                  ? "bg-sage text-white"
                  : "bg-white border border-sage/20 text-charcoal/70 hover:border-sage/40"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-center text-charcoal/50 font-serif py-12">
            Chargement...
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-charcoal/50 font-serif py-12">
            Aucune réponse pour ce filtre.
          </p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg border border-sage/20">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-sage/20 bg-sage-light/30">
                  <th className="px-4 py-3 font-serif font-medium text-sm text-charcoal/70">
                    Nom
                  </th>
                  <th className="px-4 py-3 font-serif font-medium text-sm text-charcoal/70">
                    Contact
                  </th>
                  <th className="px-4 py-3 font-serif font-medium text-sm text-charcoal/70">
                    Événement
                  </th>
                  <th className="px-4 py-3 font-serif font-medium text-sm text-charcoal/70">
                    +1
                  </th>
                  <th className="px-4 py-3 font-serif font-medium text-sm text-charcoal/70">
                    Enfants
                  </th>
                  <th className="px-4 py-3 font-serif font-medium text-sm text-charcoal/70">
                    Message
                  </th>
                  <th className="px-4 py-3 font-serif font-medium text-sm text-charcoal/70">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-sage/10 hover:bg-sage-light/20 transition-colors"
                  >
                    <td className="px-4 py-3 font-serif text-sm whitespace-nowrap">
                      {r.prenom} {r.nom}
                    </td>
                    <td className="px-4 py-3 font-serif text-sm">
                      <div>{r.email || "—"}</div>
                      <div className="text-charcoal/50">
                        {r.telephone || ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-serif text-sm">
                      {r.ceremonie_civile && r.reception_chateau
                        ? "Les deux"
                        : r.ceremonie_civile
                        ? "Civile"
                        : "Château"}
                    </td>
                    <td className="px-4 py-3 font-serif text-sm">
                      {r.plus_one
                        ? r.plus_one_nom || "Oui"
                        : "—"}
                    </td>
                    <td className="px-4 py-3 font-serif text-sm text-center">
                      {r.nombre_enfants_mairie || 0}
                    </td>
                    <td className="px-4 py-3 font-serif text-sm max-w-[200px] truncate">
                      {r.message || "—"}
                    </td>
                    <td className="px-4 py-3 font-serif text-sm whitespace-nowrap text-charcoal/50">
                      {new Date(r.created_at).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
