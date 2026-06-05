"use client";

import { FormEvent, useState } from "react";

type FormState = {
  age: string;
  sex: "male" | "female";
  bmi: string;
  children: string;
  smoker: "yes" | "no";
  region: "southwest" | "southeast" | "northwest" | "northeast";
};

const initialForm: FormState = {
  age: "30",
  sex: "male",
  bmi: "28.5",
  children: "1",
  smoker: "no",
  region: "southwest",
};

export default function HomePage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setPrediction(null);

    const payload = {
      age: Number(form.age),
      sex: form.sex,
      bmi: Number(form.bmi),
      children: Number(form.children),
      smoker: form.smoker,
      region: form.region,
    };

    if (
      Number.isNaN(payload.age) ||
      Number.isNaN(payload.bmi) ||
      Number.isNaN(payload.children)
    ) {
      setError("Please enter valid numeric values.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/predict/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Prediction request failed");
      }

      setPrediction(Number(data.prediction));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while predicting."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 px-4 py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Medical Insurance ML App
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Insurance Charges Predictor
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Enter a few details and the trained machine learning model will
            estimate the expected medical insurance charge.
          </p>

          <form
            className="mt-8 grid gap-4 sm:grid-cols-2"
            onSubmit={handleSubmit}
          >
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Age
              <input
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                type="number"
                min="1"
                max="120"
                value={form.age}
                onChange={(event) => handleChange("age", event.target.value)}
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Sex
              <select
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                value={form.sex}
                onChange={(event) =>
                  handleChange("sex", event.target.value as FormState["sex"])
                }
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              BMI
              <input
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                type="number"
                step="0.1"
                min="1"
                value={form.bmi}
                onChange={(event) => handleChange("bmi", event.target.value)}
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Children
              <input
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                type="number"
                min="0"
                value={form.children}
                onChange={(event) =>
                  handleChange("children", event.target.value)
                }
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Smoker
              <select
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                value={form.smoker}
                onChange={(event) =>
                  handleChange(
                    "smoker",
                    event.target.value as FormState["smoker"]
                  )
                }
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Region
              <select
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                value={form.region}
                onChange={(event) =>
                  handleChange(
                    "region",
                    event.target.value as FormState["region"]
                  )
                }
              >
                <option value="southwest">Southwest</option>
                <option value="southeast">Southeast</option>
                <option value="northwest">Northwest</option>
                <option value="northeast">Northeast</option>
              </select>
            </label>

            <div className="sm:col-span-2">
              <button
                className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? "Predicting..." : "Predict Charges"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-slate-900 px-6 py-7 text-white shadow-xl shadow-slate-300/60 sm:px-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
            Result
          </h2>

          {prediction !== null ? (
            <p className="mt-4 text-4xl font-bold text-emerald-300">
              $
              {new Intl.NumberFormat("en-US", {
                maximumFractionDigits: 2,
              }).format(prediction)}
            </p>
          ) : (
            <p className="mt-4 text-lg text-slate-300">
              Submit the form to see the model prediction.
            </p>
          )}

          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        </section>
      </div>
    </main>
  );
}