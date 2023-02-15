import { error } from "@sveltejs/kit";
import { db } from "$lib/firebase.js";
import { collection, addDoc } from "firebase/firestore";

export async function POST({ params, request }) {
  const body = await request.json();
  const collectionRef = collection(
    db,
    "lists",
    params.listID,
    "subCollections"
  );
  if (!body.title || typeof body.title != "string") {
    return new Response(
      JSON.stringify({
        status: 400,
        message: "Title must be a JSON object { title: string }",
      })
    );
  }
  if (body.title.length < 3 || body.title.length > 20) {
    return new Response(
      JSON.stringify({
        status: 400,
        message: "Title must be between 3 and 20 characters long",
      })
    );
  }

  const docRef = await addDoc(collectionRef, body);
  return new Response(
    JSON.stringify({
      status: 200,
      message: "OK",
      data: { title: body.title, id: docRef.id },
    })
  );
}
