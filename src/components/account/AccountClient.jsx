"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  ChevronRight,
  CreditCard,
  Download,
  FileCheck2,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  MapPin,
  Package,
  Plus,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { coaRecords } from "@/data/coa-records";

const nav = [
  { slug: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { slug: "orders", label: "Orders", icon: Package },
  { slug: "downloads", label: "Downloads & COAs", icon: Download },
  { slug: "addresses", label: "Addresses", icon: MapPin },
  { slug: "details", label: "Account details", icon: UserRound },
  { slug: "password", label: "Password", icon: LockKeyhole },
  { slug: "payment-methods", label: "Payment methods", icon: CreditCard },
];
const input =
  "h-12 w-full rounded-xl border border-[#E8DCEA] bg-white px-4 text-[15px] text-[#34283A] outline-none focus:border-primary";
const money = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number(n) || 0,
  );
const emptyAddress = {
  label: "Shipping",
  full_name: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postal_code: "",
};
async function api(action, data) {
  const res = await fetch(`/api/account/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Request failed.");
  return json;
}
function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = true,
  minLength,
  autoComplete,
}) {
  return (
    <label className="block text-[14px] font-semibold text-[#49394F]">
      {label}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        className={`${input} mt-2`}
      />
    </label>
  );
}
function Button({ children, busy = false }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="bg-primary inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-[14px] font-semibold text-white hover:bg-[#35143E] disabled:opacity-50"
    >
      {busy ? "Please wait..." : children}
      <ArrowUpRight size={17} />
    </button>
  );
}
function Panel({ title, subtitle, children, action }) {
  return (
    <section className="rounded-[22px] border border-[#ECE2ED] bg-white p-5 sm:p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-primary text-[25px] font-bold">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-[14px] leading-6 text-[#817586]">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
function Empty({ icon: Icon, title, description, href, action }) {
  return (
    <div className="rounded-[18px] border border-dashed border-[#E6D9E8] bg-[#FCFAFC] px-5 py-10 text-center">
      <Icon className="text-primary/60 mx-auto" size={34} />
      <h3 className="font-heading text-primary mt-4 text-[22px] font-bold">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-[14px] leading-7 text-[#817586]">
        {description}
      </p>
      {href && (
        <Link
          href={href}
          className="bg-primary mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white"
        >
          {action}
          <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}
function AuthForms({ section, onSuccess }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  const change = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  async function submit(e, action) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const result = await api(action, form);
      if (action === "forgot") setMessage(result.message);
      else onSuccess();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  if (section === "lost-password")
    return (
      <div className="mx-auto max-w-xl py-12">
        <Panel
          title="Forgot password?"
          subtitle="For local development, reset links are printed in your Next.js terminal."
        >
          <form onSubmit={(e) => submit(e, "forgot")} className="space-y-5">
            <Field
              label="Email address"
              name="email"
              type="email"
              value={form.email}
              onChange={change}
              autoComplete="email"
            />
            <Button busy={busy}>Generate reset link</Button>
          </form>
          <Link
            href="/account"
            className="text-primary mt-5 inline-block text-[14px] font-semibold"
          >
            Back to sign in
          </Link>
          {message && (
            <p role="status" className="text-primary mt-4 text-[14px]">
              {message}
            </p>
          )}
          {error && (
            <p role="alert" className="mt-4 text-[14px] text-red-600">
              {error}
            </p>
          )}
        </Panel>
      </div>
    );
  return (
    <div className="grid gap-6 py-10 lg:grid-cols-2 lg:gap-8 lg:py-14">
      <section className="rounded-[22px] border border-[#ECE2ED] bg-white p-6 sm:p-9">
        <span className="text-secondary text-[13px] font-bold tracking-widest uppercase">
          Existing record
        </span>
        <h2 className="font-heading text-primary mt-3 text-[32px] font-bold">
          Welcome back.
        </h2>
        <p className="mt-2 text-[15px] text-[#817586]">
          Sign in with the email you order with.
        </p>
        <form onSubmit={(e) => submit(e, "login")} className="mt-7 space-y-5">
          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={change}
            autoComplete="email"
          />
          <Field
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={change}
            autoComplete="current-password"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button busy={busy}>Sign in</Button>
            <Link
              href="/account/lost-password"
              className="text-primary text-[14px] font-semibold"
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </section>
      <section className="rounded-[22px] border border-[#ECE2ED] bg-[#FCF9FD] p-6 sm:p-9">
        <span className="text-secondary text-[13px] font-bold tracking-widest uppercase">
          New to Spectrum?
        </span>
        <h2 className="font-heading text-primary mt-3 text-[32px] font-bold">
          Open an Account.
        </h2>
        <p className="mt-2 text-[15px] leading-7 text-[#817586]">
          Order history and batch certificates, filed under one address.
        </p>
        <form
          onSubmit={(e) => submit(e, "register")}
          className="mt-7 space-y-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="First name"
              name="first_name"
              value={form.first_name}
              onChange={change}
              autoComplete="given-name"
            />
            <Field
              label="Last name"
              name="last_name"
              value={form.last_name}
              onChange={change}
              autoComplete="family-name"
            />
          </div>
          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={change}
            autoComplete="email"
          />
          <Field
            label="Password"
            name="password"
            type="password"
            minLength={8}
            value={form.password}
            onChange={change}
            autoComplete="new-password"
          />
          <p className="text-[14px] text-[#817586]">At least 8 characters.</p>
          <Button busy={busy}>Open an Account</Button>
        </form>
      </section>
      {error && (
        <p role="alert" className="text-[14px] text-red-600 lg:col-span-2">
          {error}
        </p>
      )}
    </div>
  );
}
function Orders({ orders }) {
  return (
    <Panel
      title="Orders"
      subtitle="Your orders will appear here when your checkout saves them to the local database."
    >
      {orders.length ? (
        <div className="divide-y divide-[#EEE6EF]">
          {orders.map((o) => (
            <div
              key={o.id}
              className="flex justify-between gap-4 py-4 text-[15px]"
            >
              <div>
                <p className="text-primary font-semibold">{o.order_number}</p>
                <p className="mt-1 text-[#817586] capitalize">
                  {o.status.replaceAll("_", " ")}
                </p>
              </div>
              <strong className="text-primary">{money(o.total)}</strong>
            </div>
          ))}
        </div>
      ) : (
        <Empty
          icon={Package}
          title="No orders yet"
          description="Your order history will appear here after checkout is connected."
          href="/shop"
          action="Browse compounds"
        />
      )}
    </Panel>
  );
}
function Downloads({ orders }) {
  const docs = [],
    seen = new Set();
  for (const order of orders)
    for (const item of order.items || []) {
      const slug = item.slug || item.productSlug,
        variantId = item.variantId || item.variant_id;
      const record =
        coaRecords[`${slug}:${variantId}`] || coaRecords[variantId];
      if (!record?.pdfUrl || record.demo || !slug || !variantId) continue;
      const key = `${slug}:${variantId}:${record.lot || ""}`;
      if (seen.has(key)) continue;
      seen.add(key);
      docs.push({ key, name: item.name, lot: record.lot, url: record.pdfUrl });
    }
  return (
    <Panel
      title="Downloads & COAs"
      subtitle="Certificates associated with recorded orders."
    >
      {docs.length ? (
        <div className="space-y-4">
          {docs.map((d) => (
            <a
              key={d.key}
              target="_blank"
              rel="noopener noreferrer"
              href={d.url}
              className="text-primary flex items-center justify-between rounded-xl border border-[#E8DCEA] p-4"
            >
              <span>
                {d.name} · {d.lot}
              </span>
              <ArrowUpRight size={18} />
            </a>
          ))}
        </div>
      ) : (
        <Empty
          icon={FileCheck2}
          title="No documents available"
          description="Verified certificates for your orders will appear here when available."
          href="/coa"
          action="Browse CoA library"
        />
      )}
    </Panel>
  );
}
function Addresses({ addresses, reload }) {
  const [editing, setEditing] = useState(false),
    [form, setForm] = useState(emptyAddress),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const change = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const edit = (row) => {
    setForm(row ? { ...emptyAddress, ...row } : emptyAddress);
    setEditing(true);
    setError("");
  };
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("address-save", form);
      setEditing(false);
      reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function remove(id) {
    if (!confirm("Remove this address?")) return;
    try {
      await api("address-delete", { id });
      reload();
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <Panel
      title="Addresses"
      subtitle="Manage your saved US shipping addresses."
      action={
        !editing && (
          <button
            type="button"
            onClick={() => edit(null)}
            className="bg-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-semibold text-white"
          >
            <Plus size={17} /> Add address
          </button>
        )
      }
    >
      {editing ? (
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Label"
              name="label"
              value={form.label}
              onChange={change}
            />
            <Field
              label="Full name"
              name="full_name"
              value={form.full_name}
              onChange={change}
            />
          </div>
          <Field
            label="Address line 1"
            name="address1"
            value={form.address1}
            onChange={change}
          />
          <Field
            label="Address line 2"
            name="address2"
            required={false}
            value={form.address2}
            onChange={change}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              label="City"
              name="city"
              value={form.city}
              onChange={change}
            />
            <Field
              label="State"
              name="state"
              value={form.state}
              onChange={change}
            />
            <Field
              label="ZIP"
              name="postal_code"
              value={form.postal_code}
              onChange={change}
            />
          </div>
          <div className="flex gap-3">
            <Button busy={busy}>Save address</Button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-primary rounded-full border border-[#E8DCEA] px-5 text-[14px]"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : addresses.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <article
              key={a.id}
              className="rounded-xl border border-[#E8DCEA] p-5"
            >
              <strong className="text-primary">{a.label}</strong>
              <address className="mt-3 text-[14px] leading-7 text-[#817586] not-italic">
                {a.full_name}
                <br />
                {a.address1} {a.address2}
                <br />
                {a.city}, {a.state} {a.postal_code}
              </address>
              <div className="mt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => edit(a)}
                  className="text-primary text-[14px] font-semibold"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(a.id)}
                  className="flex items-center gap-1 text-[14px] text-red-600"
                >
                  <Trash2 size={15} /> Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          icon={MapPin}
          title="No addresses saved"
          description="Save a shipping address for future checkout integration."
        />
      )}
      {error && (
        <p role="alert" className="mt-4 text-[14px] text-red-600">
          {error}
        </p>
      )}
    </Panel>
  );
}
function Details({ user, reload }) {
  const [form, setForm] = useState({ ...user }),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState("");
  const change = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api("details", form);
      setNotice("Account details saved.");
      reload();
    } catch (e) {
      setNotice(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Panel title="Account details" subtitle="Keep your information up to date.">
      <form onSubmit={save} className="max-w-2xl space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="First name"
            name="first_name"
            value={form.first_name}
            onChange={change}
          />
          <Field
            label="Last name"
            name="last_name"
            value={form.last_name}
            onChange={change}
          />
        </div>
        <Field
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={change}
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          required={false}
          value={form.phone || ""}
          onChange={change}
        />
        <Button busy={busy}>Save changes</Button>
        {notice && (
          <p role="status" className="text-primary text-[14px]">
            {notice}
          </p>
        )}
      </form>
    </Panel>
  );
}
function Password({ resetToken, onSuccess }) {
  const [form, setForm] = useState({
      current_password: "",
      password: "",
      confirm: "",
    }),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState("");
  const change = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  async function submit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setNotice("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const res = await api(resetToken ? "reset" : "password", {
        ...form,
        token: resetToken,
      });
      setNotice(res.message);
      setForm({ current_password: "", password: "", confirm: "" });
      if (resetToken) setTimeout(onSuccess, 900);
    } catch (e) {
      setNotice(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Panel
      title={resetToken ? "Reset password" : "Change password"}
      subtitle="Use at least eight characters."
    >
      <form onSubmit={submit} className="max-w-xl space-y-5">
        {!resetToken && (
          <Field
            label="Current password"
            name="current_password"
            type="password"
            value={form.current_password}
            onChange={change}
          />
        )}
        <Field
          label="New password"
          name="password"
          type="password"
          minLength={8}
          value={form.password}
          onChange={change}
        />
        <Field
          label="Confirm password"
          name="confirm"
          type="password"
          minLength={8}
          value={form.confirm}
          onChange={change}
        />
        <Button busy={busy}>Update password</Button>
        {notice && (
          <p role="status" className="text-primary text-[14px]">
            {notice}
          </p>
        )}
      </form>
    </Panel>
  );
}
export default function AccountClient({ section = "dashboard" }) {
  const router = useRouter(),
    params = useSearchParams(),
    token = params.get("token");
  const [data, setData] = useState({ user: null, orders: [], addresses: [] }),
    [ready, setReady] = useState(false);
  const reload = useCallback(async () => {
    try {
      const res = await fetch("/api/account/me", { cache: "no-store" });
      setData(await res.json());
    } catch {
      setData({ user: null, orders: [], addresses: [] });
    } finally {
      setReady(true);
    }
  }, []);
  useEffect(() => {
    reload();
  }, [reload]);
  async function logout() {
    await api("logout", {});
    setData({ user: null, orders: [], addresses: [] });
    router.replace("/account");
  }
  const { user, orders, addresses } = data;
  const active = nav.find((n) => n.slug === section) || nav[0];
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-[#EEE6EF] px-5 py-6 sm:px-8 md:py-12">
        <div className="mx-auto max-w-7xl">
          <nav
            className="mb-5 flex items-center gap-2 text-[13px] text-[#817586]"
            aria-label="Breadcrumb"
          >
            <Link href="/">Home</Link>
            <ChevronRight size={14} />
            <span className="text-primary font-semibold">My Account</span>
          </nav>
          <p className="text-secondary mb-4 flex items-center gap-2 font-sans text-xs font-bold tracking-[0.15em] uppercase">
            Spectrum Biosciences
          </p>
          <h1 className="section-heading">
            {user && section !== "dashboard" ? active.label : "My Account"}
            <span className="text-secondary">.</span>
          </h1>
          <p className="mt-2 text-[15px] text-[#817586]">
            {user
              ? "Manage your profile, orders and documents."
              : "Sign in or create your account."}
          </p>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {!ready ? (
          <p role="status" className="py-16 text-[15px] text-[#817586]">
            Loading account...
          </p>
        ) : section === "reset-password" && token ? (
          <div className="mx-auto max-w-xl py-12">
            <Password
              resetToken={token}
              onSuccess={() => router.replace("/account")}
            />
          </div>
        ) : !user ? (
          <AuthForms
            section={section}
            onSuccess={() => {
              reload();
              router.replace("/account");
            }}
          />
        ) : (
          <div className="grid items-start gap-7 py-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:py-14">
            <aside className="rounded-[22px] border border-[#ECE2ED] bg-white p-3 lg:sticky lg:top-24">
              <div className="border-b border-[#EEE6EF] p-3 pb-5">
                <p className="text-primary text-[16px] font-bold">
                  {user.first_name} {user.last_name}
                </p>
                <p className="mt-1 truncate text-[13px] text-[#817586]">
                  {user.email}
                </p>
              </div>
              <nav
                aria-label="Account sections"
                className="mt-3 grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1"
              >
                {nav.map(({ slug, label, icon: Icon }) => (
                  <Link
                    key={slug}
                    href={
                      slug === "dashboard" ? "/account" : `/account/${slug}`
                    }
                    className={`flex items-center gap-2 rounded-xl px-3 py-3 text-[14px] font-semibold ${active.slug === slug ? "bg-primary text-white" : "hover:text-primary text-[#635367] hover:bg-[#F8EFF9]"}`}
                  >
                    <Icon size={18} className="shrink-0" />
                    {label}
                  </Link>
                ))}
              </nav>
              <button
                type="button"
                onClick={logout}
                className="mt-3 flex w-full items-center gap-3 border-t border-[#EEE6EF] px-3 py-4 text-[14px] font-semibold text-[#7A617D]"
              >
                <LogOut size={18} /> Sign out
              </button>
            </aside>
            <div className="min-w-0 space-y-5">
              {active.slug === "dashboard" && (
                <>
                  <div className="rounded-[22px] bg-[linear-gradient(110deg,#35143E,#55205F)] p-6 text-white sm:p-8">
                    <p className="text-[13px] font-bold tracking-widest text-[#F6B17D] uppercase">
                      Account overview
                    </p>
                    <h2 className="font-heading mt-3 text-[34px] font-bold">
                      Welcome, {user.first_name}.
                    </h2>
                    <p className="mt-2 text-[15px] text-white/80">
                      Your research account and documentation in one place.
                    </p>
                  </div>
                  <Orders orders={orders.slice(0, 3)} />
                  <Panel title="Everything else">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {nav.slice(1, 5).map(({ slug, label, icon: Icon }) => (
                        <Link
                          key={slug}
                          href={`/account/${slug}`}
                          className="text-primary flex items-center gap-3 rounded-xl border border-[#EEE6EF] p-5 text-[15px] font-semibold hover:bg-[#FCF7FD]"
                        >
                          <Icon size={21} />
                          {label}
                          <ArrowUpRight size={16} className="ml-auto" />
                        </Link>
                      ))}
                    </div>
                  </Panel>
                </>
              )}
              {active.slug === "orders" && <Orders orders={orders} />}
              {active.slug === "downloads" && <Downloads orders={orders} />}
              {active.slug === "addresses" && (
                <Addresses addresses={addresses} reload={reload} />
              )}
              {active.slug === "details" && (
                <Details key={user.id} user={user} reload={reload} />
              )}
              {active.slug === "password" && <Password />}
              {active.slug === "payment-methods" && (
                <Panel
                  title="Payment methods"
                  subtitle="Saved payment methods require an integrated payment provider."
                >
                  <Empty
                    icon={CreditCard}
                    title="No saved payment methods"
                    description="Card data is not stored by this local account system."
                  />
                </Panel>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
