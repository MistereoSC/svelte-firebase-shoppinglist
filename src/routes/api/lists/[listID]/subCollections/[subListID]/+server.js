import { error } from "@sveltejs/kit";
import { db } from "$lib/firebase.js";
import { doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";

export async function PATCH({ params, request }) {
  const body = await request.json();
  const ref = doc(
    db,
    "lists",
    params.listID,
    "subCollections",
    params.subListID
  );
  if (body.title.length < 3 || typeof body.title != "string" || !body.title) {
    return new Response(
      JSON.stringify({
        status: 400,
        message:
          "Request must be an Object {title: string}, and title must be at least 3 characters long",
      })
    );
  }
  await updateDoc(ref, body);
  return new Response(JSON.stringify({ status: 200, message: "OK" }));
}

//TODO: Implement
export async function DELETE({ params, request }) {
  return new Response(JSON.stringify({ status: 200, message: "OK" }));
}
