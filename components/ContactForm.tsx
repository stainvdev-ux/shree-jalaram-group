"use client";

import { useState, type FormEvent } from "react";
import { group, ventures } from "@/lib/content";

// Form UI only — it isn't connected to an email service yet.
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    setSent(true);
  };

  return (
    <form className="form" onSubmit={onSubmit} noValidate={false}>
      <div className="form__row">
        <label className="field">
          <input name="name" required placeholder=" " autoComplete="name" />
          <span>Full name *</span>
        </label>
        <label className="field">
          <input name="email" type="email" required placeholder=" " autoComplete="email" />
          <span>Email *</span>
        </label>
      </div>
      <div className="form__row">
        <label className="field">
          <input name="phone" type="tel" placeholder=" " autoComplete="tel" />
          <span>Phone</span>
        </label>
        <label className="field field--select">
          <select name="venture" defaultValue="">
            <option value="">General enquiry</option>
            {ventures.map((v) => (
              <option key={v.slug} value={v.slug}>
                {v.name}
              </option>
            ))}
          </select>
          <span>Regarding</span>
        </label>
      </div>
      <label className="field">
        <textarea name="message" required rows={5} placeholder=" " />
        <span>Your message *</span>
      </label>
      <div className="form__foot">
        <button type="submit" className="btn btn--accent" data-magnetic>
          <span>Send message</span>
          <i aria-hidden="true">→</i>
        </button>
        <p className="form__status" role="status">
          {sent && (
            <>
              Thank you. Online messages aren&apos;t switched on yet, so please email{" "}
              <a href={`mailto:${group.email}`}>{group.email}</a> or call {group.phone}.
            </>
          )}
        </p>
      </div>
    </form>
  );
}
