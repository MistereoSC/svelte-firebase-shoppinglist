import { error } from "@sveltejs/kit";
import { db } from "$lib/firebase.js";
import { doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";

//TODO: Implement
export async function PATCH({ params, request }) {
  return new Response(JSON.stringify({ status: 200, message: "OK" }));
}
//TODO: Implement
export async function DELETE({ params, request }) {
  return new Response(JSON.stringify({ status: 200, message: "OK" }));
}
