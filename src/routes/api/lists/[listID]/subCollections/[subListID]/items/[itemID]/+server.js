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
    params.subListID,
    "items",
    params.itemID
  );
  //TODO: filter request
  await updateDoc(ref, body);
  return new Response(JSON.stringify({ status: 200, message: "OK" }));
}

export async function GET({ params }) {
  const ref = doc(
    db,
    "lists",
    params.listID,
    "subCollections",
    params.subListID,
    "items",
    params.itemID
  );
  const snapshot = await getDoc(ref);
  const res = snapshot.data();
  if (res) {
    return new Response(
      JSON.stringify({ status: 200, message: "OK", data: res })
    );
  } else {
    return new Response(
      JSON.stringify({ status: 404, message: "File not found" })
    );
  }
}

export async function DELETE({ params }) {
  const ref = doc(
    db,
    "lists",
    params.listID,
    "subCollections",
    params.subListID,
    "items",
    params.itemID
  );
  await deleteDoc(ref);
  return new Response(JSON.stringify({ status: 200, message: "OK" }));
}
