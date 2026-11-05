import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { db, digest, getUser, newToken } from "@/lib/local-account";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const COOKIE = "spectrum_session";
const TTL = 1000 * 60 * 60 * 24 * 14;
const cookieOptions = { httpOnly:true, sameSite:"lax", secure:process.env.NODE_ENV==="production", path:"/", maxAge:TTL/1000 };
const error = (message,status=400) => NextResponse.json({error:message},{status});
const value = (v,max=250) => String(v ?? "").trim().slice(0,max);
const emailOf = (v) => value(v,254).toLowerCase();
const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidPassword = (v) => typeof v==="string" && v.length>=8 && v.length<=128;
const userById = (id) => db().prepare("SELECT id,email,first_name,last_name,phone FROM users WHERE id=?").get(id);
function sessionResponse(user,status=200) {
  const token=newToken();
  db().prepare("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)").run(digest(token),user.id,Date.now()+TTL);
  const res=NextResponse.json({user}, {status});
  res.cookies.set(COOKIE,token,cookieOptions);
  return res;
}
function authenticated(request) { return getUser(request.cookies.get(COOKIE)?.value); }
export async function GET(request,{params}) {
  const {action}=await params;
  if(action!=="me") return error("Not found",404);
  const user=authenticated(request);
  if(!user) return NextResponse.json({user:null,orders:[],addresses:[]});
  const orders=db().prepare("SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC").all(user.id).map(row=>({...row,items:JSON.parse(row.items)}));
  const addresses=db().prepare("SELECT * FROM addresses WHERE user_id=? ORDER BY rowid DESC").all(user.id);
  return NextResponse.json({user,orders,addresses});
}
export async function POST(request,{params}) {
  const {action}=await params;
  let body;
  try {body=await request.json();} catch {return error("Invalid request body");}
  const database=db();
  if(action==="register") {
    const email=emailOf(body.email), first=value(body.first_name,80), last=value(body.last_name,80);
    if(!validEmail(email) || !first || !last || !isValidPassword(body.password)) return error("Provide your name, a valid email and a password of 8–128 characters.");
    if(database.prepare("SELECT id FROM users WHERE email=?").get(email)) return error("This email is already registered.",409);
    const id=randomUUID();
    try { database.prepare("INSERT INTO users(id,email,password_hash,first_name,last_name) VALUES(?,?,?,?,?)").run(id,email,await bcrypt.hash(body.password,12),first,last); }
    catch { return error("Unable to register this email.",409); }
    return sessionResponse(userById(id),201);
  }
  if(action==="login") {
    const email=emailOf(body.email), row=database.prepare("SELECT * FROM users WHERE email=?").get(email);
    if(!row || !await bcrypt.compare(String(body.password||""),row.password_hash)) return error("Invalid email or password.",401);
    return sessionResponse(userById(row.id));
  }
  if(action==="forgot") {
    const email=emailOf(body.email);
    const row=database.prepare("SELECT id FROM users WHERE email=?").get(email);
    if(row && process.env.NODE_ENV!=="production") {
      const token=newToken();
      database.prepare("INSERT INTO reset_tokens(token_hash,user_id,expires_at) VALUES(?,?,?)").run(digest(token),row.id,Date.now()+15*60*1000);
      console.info(`[LOCAL ACCOUNT RESET] http://localhost:3000/account/reset-password?token=${token}`);
    }
    return NextResponse.json({message:process.env.NODE_ENV==="production" ? "Email delivery is not configured; ask the site administrator for help." : "If the account exists, a local reset link was printed in your Next.js terminal."});
  }
  if(action==="reset") {
    const token=value(body.token,100), row=database.prepare("SELECT * FROM reset_tokens WHERE token_hash=? AND expires_at>?").get(digest(token),Date.now());
    if(!row || !isValidPassword(body.password)) return error("Invalid or expired reset link, or password is too short.");
    database.transaction(()=>{
      database.prepare("UPDATE users SET password_hash=? WHERE id=?").run(bcrypt.hashSync(body.password,12),row.user_id);
      database.prepare("DELETE FROM reset_tokens WHERE user_id=?").run(row.user_id);
      database.prepare("DELETE FROM sessions WHERE user_id=?").run(row.user_id);
    })();
    return NextResponse.json({message:"Password reset. You can now sign in."});
  }
  const user=authenticated(request);
  if(!user) return error("Please sign in.",401);
  if(action==="logout") {
    database.prepare("DELETE FROM sessions WHERE token_hash=?").run(digest(request.cookies.get(COOKIE)?.value||""));
    const res=NextResponse.json({ok:true});res.cookies.set(COOKIE,"",{...cookieOptions,maxAge:0});return res;
  }
  if(action==="details") {
    const first=value(body.first_name,80),last=value(body.last_name,80),email=emailOf(body.email),phone=value(body.phone,40);
    if(!first || !last || !validEmail(email)) return error("Please provide a valid name and email.");
    try {database.prepare("UPDATE users SET first_name=?,last_name=?,email=?,phone=? WHERE id=?").run(first,last,email,phone,user.id);}
    catch {return error("That email is already used by another account.",409);}
    return NextResponse.json({user:userById(user.id)});
  }
  if(action==="password") {
    if(!isValidPassword(body.password)) return error("Password must contain 8–128 characters.");
    const row=database.prepare("SELECT password_hash FROM users WHERE id=?").get(user.id);
    if(!await bcrypt.compare(String(body.current_password||""),row.password_hash)) return error("Current password is incorrect.",403);
    database.prepare("UPDATE users SET password_hash=? WHERE id=?").run(await bcrypt.hash(body.password,12),user.id);
    return NextResponse.json({message:"Password updated."});
  }
  if(action==="address-save") {
    const data={label:value(body.label,60),full_name:value(body.full_name,150),address1:value(body.address1),address2:value(body.address2),city:value(body.city,100),state:value(body.state,100),postal_code:value(body.postal_code,20)};
    if(!data.label||!data.full_name||!data.address1||!data.city||!data.state||!data.postal_code) return error("Fill in all required address fields.");
    const id=value(body.id,60);
    if(id) {
      const r=database.prepare(`UPDATE addresses SET label=@label,full_name=@full_name,address1=@address1,address2=@address2,city=@city,state=@state,postal_code=@postal_code WHERE id=@id AND user_id=@user_id`).run({...data,id,user_id:user.id});
      if(!r.changes) return error("Address not found.",404);
    } else database.prepare(`INSERT INTO addresses(id,user_id,label,full_name,address1,address2,city,state,postal_code) VALUES(@id,@user_id,@label,@full_name,@address1,@address2,@city,@state,@postal_code)`).run({...data,id:randomUUID(),user_id:user.id});
    return NextResponse.json({ok:true});
  }
  if(action==="address-delete") {
    database.prepare("DELETE FROM addresses WHERE id=? AND user_id=?").run(value(body.id,60),user.id);
    return NextResponse.json({ok:true});
  }
  return error("Not found",404);
}
