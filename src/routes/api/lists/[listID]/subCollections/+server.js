import { error } from "@sveltejs/kit";
import { db } from "$lib/firebase.js";
import { collection, addDoc } from "firebase/firestore";

//TODO: Implement
export async function POST({ params, request }) {
  return new Response(JSON.stringify({ status: 200, message: "OK" }));
}
